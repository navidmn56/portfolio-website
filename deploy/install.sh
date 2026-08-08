#!/usr/bin/env bash

set -Eeuo pipefail

APP_NAME="resume-website"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${BASE_DIR}/.env"

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

log() {
    echo -e "${GREEN}[✓]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

fail() {
    error "$1"
    exit 1
}

trap 'error "Installation failed at line $LINENO."' ERR


# ============================================================
# Root
# ============================================================

if [[ "${EUID}" -ne 0 ]]; then
    fail "Run this installer as root or with sudo."
fi


# ============================================================
# Banner
# ============================================================

clear

echo
echo "============================================================"
echo "        Django Resume Website - Installer"
echo "============================================================"
echo


# ============================================================
# Project checks
# ============================================================

cd "${BASE_DIR}"

[[ -f "${BASE_DIR}/Dockerfile" ]] \
    || fail "Dockerfile not found."

[[ -f "${BASE_DIR}/docker-compose.yml" ]] \
    || fail "docker-compose.yml not found."

[[ -f "${BASE_DIR}/manage.py" ]] \
    || fail "manage.py not found."

[[ -f "${BASE_DIR}/deploy/docker-compose.prod.yml" ]] \
    || fail "deploy/docker-compose.prod.yml not found."

[[ -f "${BASE_DIR}/deploy/Caddyfile" ]] \
    || fail "deploy/Caddyfile not found."

log "Project directory detected: ${BASE_DIR}"


# ============================================================
# Domain
# ============================================================

while true; do

    read -rp "Enter your domain (example.com): " DOMAIN

    DOMAIN="${DOMAIN,,}"
    DOMAIN="${DOMAIN#http://}"
    DOMAIN="${DOMAIN#https://}"
    DOMAIN="${DOMAIN%%/*}"

    if [[ -z "${DOMAIN}" ]]; then
        warn "Domain cannot be empty."
        continue
    fi

    if [[ "${DOMAIN}" == *"."* ]]; then
        break
    fi

    warn "Please enter a valid domain."

done

log "Domain: ${DOMAIN}"


# ============================================================
# Admin username
# ============================================================

while true; do

    read -rp "Enter admin username: " ADMIN_USERNAME

    if [[ -z "${ADMIN_USERNAME}" ]]; then
        warn "Username cannot be empty."
        continue
    fi

    if [[ "${ADMIN_USERNAME}" =~ [[:space:]] ]]; then
        warn "Username cannot contain spaces."
        continue
    fi

    break

done

log "Admin username: ${ADMIN_USERNAME}"


# ============================================================
# Admin email
# ============================================================

while true; do

    read -rp "Enter admin email: " ADMIN_EMAIL

    if [[ "${ADMIN_EMAIL}" =~ ^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$ ]]; then
        break
    fi

    warn "Please enter a valid email address."

done

log "Admin email: ${ADMIN_EMAIL}"


# ============================================================
# Admin password
# ============================================================

while true; do

    read -rsp "Enter admin password: " ADMIN_PASSWORD
    echo

    if [[ -z "${ADMIN_PASSWORD}" ]]; then
        warn "Password cannot be empty."
        continue
    fi

    read -rsp "Confirm admin password: " ADMIN_PASSWORD_CONFIRM
    echo

    if [[ "${ADMIN_PASSWORD}" != "${ADMIN_PASSWORD_CONFIRM}" ]]; then
        warn "Passwords do not match."
        continue
    fi

    break

done

log "Admin password accepted."


# ============================================================
# Detect public IP
# ============================================================

info "Detecting public IPv4 address..."

SERVER_IP=""

for SERVICE in \
    "https://api.ipify.org" \
    "https://ifconfig.me/ip" \
    "https://icanhazip.com"
do

    SERVER_IP="$(curl -4 -fsSL --max-time 5 "${SERVICE}" 2>/dev/null || true)"

    SERVER_IP="$(echo "${SERVER_IP}" | tr -d '[:space:]')"

    if [[ "${SERVER_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        break
    fi

    SERVER_IP=""

done

[[ -n "${SERVER_IP}" ]] \
    || fail "Could not detect public IPv4 address."

log "Server public IP: ${SERVER_IP}"


# ============================================================
# DNS check
# ============================================================

info "Checking DNS for ${DOMAIN}..."

DOMAIN_IPS="$(
    getent ahostsv4 "${DOMAIN}" 2>/dev/null |
    awk '{print $1}' |
    sort -u ||
    true
)"

if [[ -z "${DOMAIN_IPS}" ]]; then

    warn "No IPv4 DNS record found for ${DOMAIN}."

    echo
    echo "Create this DNS record:"
    echo
    echo "Type : A"
    echo "Name : @"
    echo "Value: ${SERVER_IP}"
    echo
    echo "For initial SSL issuance use:"
    echo "Proxy: DNS Only"
    echo

    read -rp "Continue anyway? [y/N]: " ANSWER

    if [[ ! "${ANSWER}" =~ ^[Yy]$ ]]; then
        fail "Installation cancelled."
    fi

else

    echo
    echo "DNS records:"
    echo "${DOMAIN_IPS}"
    echo

fi


DNS_MATCH=false

while read -r IP; do

    if [[ "${IP}" == "${SERVER_IP}" ]]; then
        DNS_MATCH=true
        break
    fi

done <<< "${DOMAIN_IPS}"


if [[ "${DNS_MATCH}" == true ]]; then

    log "DNS points to this server."

else

    warn "Domain does not currently resolve directly to this server."

    echo
    echo "Server IP : ${SERVER_IP}"
    echo "Domain IP :"
    echo "${DOMAIN_IPS}"
    echo

    echo "If you use Cloudflare, make sure Proxy is disabled"
    echo "during the initial SSL certificate request."
    echo

    read -rp "Continue anyway? [y/N]: " ANSWER

    if [[ ! "${ANSWER}" =~ ^[Yy]$ ]]; then
        fail "Installation cancelled."
    fi

fi


# ============================================================
# Cloudflare detection
# ============================================================

info "Checking whether Cloudflare proxy is enabled..."

CLOUDFLARE=false

if [[ -n "${DOMAIN_IPS}" ]]; then

    if python3 - "${DOMAIN_IPS}" <<'PY'
import ipaddress
import sys

cloudflare_networks = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
]

networks = [
    ipaddress.ip_network(x)
    for x in cloudflare_networks
]

for value in sys.argv[1].split():

    try:
        address = ipaddress.ip_address(value)

        if any(address in network for network in networks):
            sys.exit(0)

    except ValueError:
        pass

sys.exit(1)
PY
    then

        CLOUDFLARE=true

    fi

fi


if [[ "${CLOUDFLARE}" == true ]]; then

    warn "Cloudflare Proxy appears to be enabled."

    echo
    echo "For initial SSL certificate issuance:"
    echo
    echo "Cloudflare DNS -> DNS Only (gray cloud)"
    echo
    echo "The domain should point directly to:"
    echo "${SERVER_IP}"
    echo

    read -rp "Have you disabled Cloudflare Proxy? [y/N]: " CF_ANSWER

    if [[ ! "${CF_ANSWER}" =~ ^[Yy]$ ]]; then
        fail "Disable Cloudflare Proxy and run the installer again."
    fi

else

    log "Domain appears to point directly to the server."

fi


# ============================================================
# Ports
# ============================================================

check_port() {

    local PORT="$1"

    if ss -ltn "( sport = :${PORT} )" 2>/dev/null |
        grep -q LISTEN; then

        error "Port ${PORT} is already in use."

        ss -ltnp "( sport = :${PORT} )" 2>/dev/null || true

        return 1

    fi

    return 0
}


info "Checking ports 80 and 443..."

check_port 80 \
    || fail "Port 80 must be available."

check_port 443 \
    || fail "Port 443 must be available."

log "Ports 80 and 443 are available."


# ============================================================
# Docker
# ============================================================

if command -v docker >/dev/null 2>&1; then

    log "Docker is already installed."

else

    info "Docker not found. Installing Docker..."

    curl -fsSL https://get.docker.com | sh

    systemctl enable --now docker

    log "Docker installed."

fi


# ============================================================
# Docker Compose
# ============================================================

docker compose version >/dev/null 2>&1 \
    || fail "Docker Compose is not available."

log "Docker Compose is available."


# ============================================================
# Generate SECRET_KEY
# ============================================================

SECRET_KEY="$(
python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(64))
PY
)"


# ============================================================
# Backup existing .env
# ============================================================

if [[ -f "${ENV_FILE}" ]]; then

    warn ".env already exists."

    cp \
        "${ENV_FILE}" \
        "${ENV_FILE}.backup.$(date +%Y%m%d-%H%M%S)"

fi


# ============================================================
# Create .env
# ============================================================

cat > "${ENV_FILE}" <<EOF
# ============================================================
# Production Environment
# ============================================================

DOMAIN=${DOMAIN}

SERVER_IP=${SERVER_IP}

ADMIN_USERNAME=${ADMIN_USERNAME}
ADMIN_EMAIL=${ADMIN_EMAIL}

CADDY_EMAIL=${ADMIN_EMAIL}

DEBUG=False

SECRET_KEY=${SECRET_KEY}

ALLOWED_HOSTS=${DOMAIN},www.${DOMAIN},${SERVER_IP},localhost,127.0.0.1

DATABASE_PATH=/data/db.sqlite3
EOF

chmod 600 "${ENV_FILE}"

log ".env created."


# ============================================================
# Validate compose
# ============================================================

info "Validating Docker Compose configuration..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    config >/dev/null

log "Docker Compose configuration is valid."


# ============================================================
# Build
# ============================================================

info "Building Docker containers..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    build --pull

log "Docker image built."


# ============================================================
# Start Django
# ============================================================

info "Starting Django container..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    up -d web

log "Django container started."


# ============================================================
# Wait for container
# ============================================================

info "Waiting for Django container..."

for i in {1..30}; do

    if docker compose \
        -f docker-compose.yml \
        -f deploy/docker-compose.prod.yml \
        ps web 2>/dev/null |
        grep -q "Up\|running"
    then
        break
    fi

    sleep 2

done


# ============================================================
# Database migrations
# ============================================================

info "Running Django migrations..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    exec -T web \
    python manage.py migrate --noinput

log "Django migrations completed."


# ============================================================
# Create Django superuser
# ============================================================

info "Creating Django admin account..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    exec -T \
    -e DJANGO_ADMIN_USERNAME="${ADMIN_USERNAME}" \
    -e DJANGO_ADMIN_EMAIL="${ADMIN_EMAIL}" \
    -e DJANGO_ADMIN_PASSWORD="${ADMIN_PASSWORD}" \
    web \
    python manage.py shell <<'PY'

import os

from django.contrib.auth import get_user_model


User = get_user_model()


username = os.environ["DJANGO_ADMIN_USERNAME"]
email = os.environ["DJANGO_ADMIN_EMAIL"]
password = os.environ["DJANGO_ADMIN_PASSWORD"]


user = User.objects.filter(username=username).first()


if user is None:

    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
    )

    print(
        f"Superuser '{username}' created successfully."
    )

else:

    changed = False

    if not user.is_staff:
        user.is_staff = True
        changed = True

    if not user.is_superuser:
        user.is_superuser = True
        changed = True

    if user.email != email:
        user.email = email
        changed = True

    if changed:
        user.set_password(password)
        user.save()

    print(
        f"Superuser '{username}' already exists."
    )

PY

log "Django admin account ready."


# ============================================================
# Collect static
# ============================================================

info "Collecting static files..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    exec -T web \
    python manage.py collectstatic --noinput

log "Static files collected."

# ============================================================
# Verify static files
# ============================================================

info "Verifying collected static files..."

STATIC_ADMIN_FILE="/app/staticfiles/admin/css/base.css"

if ! docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    exec -T web \
    test -f "${STATIC_ADMIN_FILE}"
then

    fail "Django admin static files were not collected correctly."
fi

log "Django admin static files verified."

STATIC_MAIN_FILE="/app/staticfiles/css/portfolio.css"

if ! docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    exec -T web \
    test -f "${STATIC_MAIN_FILE}"
then

    fail "Main website CSS was not collected correctly."
fi

log "Main website CSS verified."
# ============================================================
# Start Caddy
# ============================================================

info "Starting Caddy..."

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    up -d caddy

log "Caddy started."


# ============================================================
# Wait for HTTPS
# ============================================================

info "Waiting for HTTPS certificate..."

SUCCESS=false

for i in {1..60}; do

    sleep 2

    if curl \
        -k \
        -s \
        -o /dev/null \
        --max-time 5 \
        "https://${DOMAIN}"
    then

        SUCCESS=true
        break

    fi

done


# ============================================================
# Final
# ============================================================

echo
echo "============================================================"

if [[ "${SUCCESS}" == true ]]; then

    echo -e "${GREEN}Installation completed successfully.${NC}"

else

    echo -e "${YELLOW}Application started, but HTTPS is not ready yet.${NC}"

fi

echo "============================================================"
echo

echo "Website:"
echo "https://${DOMAIN}"
echo

echo "Admin:"
echo "https://${DOMAIN}/admin/"
echo

echo "Admin email:"
echo "${ADMIN_EMAIL}"
echo

echo "Server IP:"
echo "${SERVER_IP}"
echo

echo "Docker status:"

docker compose \
    -f docker-compose.yml \
    -f deploy/docker-compose.prod.yml \
    ps

echo

echo "Useful commands:"
echo

echo "View logs:"
echo "docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml logs -f"

echo

echo "Restart:"
echo "docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml restart"

echo

echo "Stop:"
echo "docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml down"

echo

echo "============================================================"