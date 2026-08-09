#!/bin/bash

set -e

PROJECT_DIR="$HOME/resume-website"

COMPOSE="docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml"

DOMAIN="${DOMAIN:-}"

echo ""
echo "============================================================"
echo "        RESUME WEBSITE - PRODUCTION UPDATE"
echo "============================================================"
echo ""

cd "$PROJECT_DIR"

echo "[1/9] Checking current Git status..."
git status --short

echo ""
echo "[2/9] Updating source code from GitHub..."
git fetch origin

git checkout main

git reset --hard origin/main

echo ""
echo "Current commit:"
git log -1 --oneline

echo ""
echo "[3/9] Building Docker image..."
$COMPOSE build --no-cache web

echo ""
echo "[4/9] Recreating containers..."
$COMPOSE up -d --force-recreate

echo ""
echo "[5/9] Waiting for Django container..."
sleep 5

echo ""
echo "[6/9] Running database migrations..."
$COMPOSE exec -T web python manage.py migrate --noinput

echo ""
echo "[7/9] Collecting static files..."
$COMPOSE exec -T web python manage.py collectstatic --noinput --clear

echo ""
echo "[8/9] Restarting production services..."
$COMPOSE restart web caddy

sleep 3

echo ""
echo "============================================================"
echo "              STATIC FILE VERIFICATION"
echo "============================================================"
echo ""

echo "Source CSS:"
md5sum static/css/portfolio.css || true

echo ""
echo "Source JS:"
md5sum static/js/portfolio.js || true

echo ""
echo "Container CSS:"
$COMPOSE exec -T web sh -c \
"md5sum /app/staticfiles/css/portfolio.css"

echo ""
echo "Container JS:"
$COMPOSE exec -T web sh -c \
"md5sum /app/staticfiles/js/portfolio.js"

echo ""
echo "Caddy CSS:"
$COMPOSE exec -T caddy sh -c \
"md5sum /srv/static/css/portfolio.css"

echo ""
echo "Caddy JS:"
$COMPOSE exec -T caddy sh -c \
"md5sum /srv/static/js/portfolio.js"

echo ""
echo "============================================================"
echo "              FILE SIZES"
echo "============================================================"
echo ""

$COMPOSE exec -T web sh -c \
"ls -lh /app/staticfiles/css/portfolio.css /app/staticfiles/js/portfolio.js"

echo ""
echo "============================================================"
echo "              DOCKER STATUS"
echo "============================================================"
echo ""

$COMPOSE ps

echo ""
echo "============================================================"
echo "              CURRENT GIT COMMIT"
echo "============================================================"
echo ""

git log -1 --oneline

echo ""
echo "============================================================"
echo "              UPDATE COMPLETED"
echo "============================================================"
echo ""

echo "If source/container/Caddy MD5 values are identical,"
echo "the newest CSS and JS are installed correctly."

echo ""
echo "IMPORTANT:"
echo "If browser still shows old CSS/JS, use:"
echo ""
echo "  Ctrl + F5"
echo ""
echo "or open the site in Incognito mode."
echo ""

# ============================================================
# OPTIONAL WEBSITE CHECK
# ============================================================

if [ -n "$DOMAIN" ]; then

    echo ""
    echo "============================================================"
    echo "              WEBSITE CHECK"
    echo "============================================================"
    echo ""

    echo "Testing CSS from:"
    echo "https://$DOMAIN/static/css/portfolio.css"

    echo ""

    curl -L -s \
        "https://$DOMAIN/static/css/portfolio.css" \
        | md5sum

    echo ""
    echo "Testing JS from:"
    echo "https://$DOMAIN/static/js/portfolio.js"

    echo ""

    curl -L -s \
        "https://$DOMAIN/static/js/portfolio.js" \
        | md5sum

fi

echo ""
echo "============================================================"
echo "                  DONE"
echo "============================================================"
echo ""