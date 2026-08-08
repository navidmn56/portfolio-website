#!/usr/bin/env bash

set -Eeuo pipefail


# Django Resume Website - Production Installer


APP_NAME="resume-website"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ENV_FILE="${BASE_DIR}/.env"
PROD_COMPOSE="${BASE_DIR}/docker-compose.prod.yml"

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



# Root check


if [[ "${EUID}" -ne 0 ]]; then
    fail "Run this installer as root or with sudo."
fi



# Banner


clear

echo
echo "============================================================"
echo "        Django Resume Website - Installer"
echo "============================================================"
echo



# Check project


cd "${BASE_DIR}"

[[ -f "${BASE_DIR}/Dockerfile" ]] \
    || fail "Dockerfile not found."

[[ -f "${BASE_DIR}/docker-compose.yml" ]] \
    || fail "docker-compose.yml not found."

[[ -f "${BASE_DIR}/manage.py" ]] \
    || fail "manage.py not found."

log "Project directory detected: ${BASE_DIR}"



# Ask for domain


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



# Detect public IP


info "Detecting public IPv4 address..."

SERVER_IP=""

for SERVICE in \
    "https://api.ipify.org" \
    "https://ifconfig.me/ip" \
    "https://icanhazip.com"
do

    SERVER_IP="$(curl -4 -fsSL --max-time 5 "${SERVICE}" 2>/dev/null || true)"

    if [[ "${SERVER_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        break
    fi

    SERVER_IP=""
done

[[ -n "${SERVER_IP}" ]] \
    || fail "Could not detect public IPv4 address."

log "Server public IP: ${SERVER_IP}"



# DNS check


info "Checking DNS for ${DOMAIN}..."

DOMAIN_IPS="$(getent ahostsv4 "${DOMAIN}" 2>/dev/null | awk '{print $1}' | sort -u || true)"

if [[ -z "${DOMAIN_IPS}" ]]; then
    fail "No IPv4 DNS record found for ${DOMAIN}."
fi

echo
echo "DNS records:"
echo "${DOMAIN_IPS}"
echo

DNS_MATCH=false

while read -r IP; do

    if [[ "${IP}" == "${SERVER_IP}" ]]; then
        DNS_MATCH=true
        break
    fi

done <<< "${DOMAIN_IPS}"

if [[ "${DNS_MATCH}" != true ]]; then

    warn "The domain does not currently resolve to this server."

    echo
    echo "Server IP : ${SERVER_IP}"
    echo "Domain IP :"
    echo "${DOMAIN_IPS}"
    echo

    echo "Before continuing, create/update this DNS record:"
    echo
    echo "Type: A"
    echo "Name: @"
    echo "Value: ${SERVER_IP}"
    echo "Proxy: DNS Only"
    echo

    read -rp "Continue anyway? [y/N]: " ANSWER

    if [[ ! "${ANSWER}" =~ ^[Yy]$ ]]; then
        fail "Installation cancelled."
    fi

else
    log "DNS points to this server."
fi



# Cloudflare detection


info "Checking whether Cloudflare proxy is enabled..."

CLOUDFLARE=false

CLOUDFLARE_IPS=(
    "173.245.48.0/20"
    "103.21.244.0/22"
    "103.22.200.0/22"
    "103.31.4.0/22"
    "141.101.64.0/18"
    "108.162.192.0/18"
    "190.93.240.0/20"
    "188.114.96.0/20"
    "197.234.240.0/22"
    "198.41.128.0/17"
    "162.158.0.0/15"
    "104.16.0.0/13"
    "104.24.0.0/14"
    "172.64.0.0/13"
    "131.0.72.0/22"
)

if command -v python3 >/dev/null 2>&1; then

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

networks = [ipaddress.ip_network(x) for x in cloudflare_networks]

ips = sys.argv[1].split()

for ip in ips:
    try:
        address = ipaddress.ip_address(ip)

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
    echo "For the initial SSL certificate:"
    echo
    echo "Cloudflare DNS → DNS Only (gray cloud)"
    echo
    echo "The domain must point directly to:"
    echo "${SERVER_IP}"
    echo

    read -rp "Have you disabled Cloudflare Proxy? [y/N]: " CF_ANSWER

    if [[ ! "${CF_ANSWER}" =~ ^[Yy]$ ]]; then
        fail "Please disable Cloudflare Proxy and run the installer again."
    fi

else

    log "Domain appears to point directly to the server."
fi



# Port checks


check_port() {

    local PORT="$1"

    if ss -ltn "( sport = :${PORT} )" 2>/dev/null | grep -q LISTEN; then

        error "Port ${PORT} is already in use."

        ss -ltnp "( sport = :${PORT} )" 2>/dev/null || true

        return 1

    fi

    return 0
}


info "Checking ports 80 and 443..."

check_port 80 \
    || fail "Port 80 must be available for SSL."

check_port 443 \
    || fail "Port 443 must be available for HTTPS."

log "Ports 80 and 443 are available."



# Docker installation


if command -v docker >/dev/null 2>&1; then

    log "Docker is already installed."

else

    info "Docker not found. Installing Docker..."

    curl -fsSL https://get.docker.com | sh

    systemctl enable --now docker

    log "Docker installed."

fi



# Docker Compose check


docker compose version >/dev/null 2>&1 \
    || fail "Docker Compose is not available."

log "Docker Compose is available."



# Generate .env


if [[ -f "${ENV_FILE}" ]]; then

    warn ".env already exists."

    cp "${ENV_FILE}" "${ENV_FILE}.backup.$(date +%Y%m%d-%H%M%S)"

fi


# Generate a random Django secret key
SECRET_KEY="$(python3 - <<'PY'
import secrets

print(secrets.token_urlsafe(64))
PY
)"


cat > "${ENV_FILE}" <<EOF
# ============================================================
# Production Environment
# ============================================================

DOMAIN=${DOMAIN}

SERVER_IP=${SERVER_IP}

DEBUG=False

SECRET_KEY=${SECRET_KEY}

ALLOWED_HOSTS=${DOMAIN},www.${DOMAIN},${SERVER_IP},localhost,127.0.0.1
EOF

chmod 600 "${ENV_FILE}"

log ".env created."



# Create production compose file


cat > "${PROD_COMPOSE}" <<'EOF'
services:

  web:
    env_file:
      - .env

    restart: unless-stopped

    networks:
      - resume_network

  caddy:
    image: caddy:2-alpine

    container_name: resume_caddy

    restart: unless-stopped

    ports:
      - "80:80"
      - "443:443"

    volumes:
      - caddy_data:/data
      - caddy_config:/config
      - ./deploy/Caddyfile:/etc/caddy/Caddyfile:ro

    depends_on:
      - web

    networks:
      - resume_network


networks:
  resume_network:


volumes:
  caddy_data:
  caddy_config:
EOF



# Create Caddyfile


mkdir -p "${BASE_DIR}/deploy"

cat > "${BASE_DIR}/deploy/Caddyfile" <<EOF
{
    email admin@${DOMAIN}
}

${DOMAIN} {
    encode gzip

    reverse_proxy web:8000
}
EOF

log "Caddy configuration created."



# Validate Docker Compose


cd "${BASE_DIR}"

docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    config >/dev/null

log "Docker Compose configuration is valid."



# Build application


info "Building Docker containers..."

docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    build

log "Docker image built."



# Start Django


info "Starting Django container..."

docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    up -d web

log "Django container started."



# Wait for Django container


info "Waiting for Django container..."

for i in {1..30}; do

    if docker compose \
        -f docker-compose.yml \
        -f docker-compose.prod.yml \
        ps web 2>/dev/null | grep -q "Up\|running"; then

        break

    fi

    sleep 2

done



# Django migrations


info "Running Django migrations..."

docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    exec -T web python manage.py migrate --noinput

log "Django migrations completed."


#creat superuser
echo "[INFO] Creating Django superuser..."

docker compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  exec -T web python manage.py shell -c "
from django.contrib.auth import get_user_model
import os

User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if username and password:
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email or '',
            'is_staff': True,
            'is_superuser': True,
        }
    )

    if created:
        user.set_password(password)
        user.save()
        print('Superuser created successfully.')
    else:
        print('Superuser already exists.')
else:
    print('Superuser credentials are not configured.')
"

# Collect static


info "Collecting static files..."

docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    exec -T web python manage.py collectstatic --noinput \
    || warn "collectstatic failed or is not configured."


# Start Caddy


info "Starting Caddy..."

docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    up -d caddy

log "Caddy started."



# Wait for HTTPS


info "Waiting for HTTPS certificate..."

SUCCESS=false

for i in {1..30}; do

    sleep 2

    if curl \
        -k \
        -s \
        -o /dev/null \
        --max-time 5 \
        "https://${DOMAIN}"; then

        SUCCESS=true
        break

    fi

done



# Final output


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
echo "Server IP:"
echo "${SERVER_IP}"
echo
echo "Docker status:"
docker compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    ps
echo
echo "Useful commands:"
echo
echo "  View logs:"
echo "  docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo
echo "  Restart:"
echo "  docker compose -f docker-compose.yml -f docker-compose.prod.yml restart"
echo
echo "  Stop:"
echo "  docker compose -f docker-compose.yml -f docker-compose.prod.yml down"
echo
echo "============================================================"