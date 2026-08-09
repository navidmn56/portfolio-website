```bash
#!/usr/bin/env bash

set -Eeuo pipefail

# ============================================================
# Portfolio Website
# Full Production Update + Docker Cleanup
#
# IMPORTANT:
# - Database is NEVER deleted
# - Media is NEVER deleted
# - Docker volumes are NEVER deleted
# ============================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

COMPOSE="docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml"

echo ""
echo "============================================================"
echo " Portfolio Website - Production Update"
echo "============================================================"
echo ""

# ============================================================
# SAFETY CHECK
# ============================================================

echo "[1/11] Checking project..."

if [ ! -f "docker-compose.yml" ]; then
    echo "ERROR: docker-compose.yml not found."
    exit 1
fi

if [ ! -f "deploy/docker-compose.prod.yml" ]; then
    echo "ERROR: deploy/docker-compose.prod.yml not found."
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "ERROR: Git repository not found."
    exit 1
fi

echo "Project directory:"
echo "$PROJECT_DIR"

# ============================================================
# SHOW VOLUMES BEFORE ANYTHING
# ============================================================

echo ""
echo "[2/11] Checking Docker volumes..."

docker volume ls | grep -E "db_volume|media_volume|static_volume" || true

echo ""
echo "IMPORTANT:"
echo "Database and Media volumes will NOT be deleted."
echo ""

# ============================================================
# GET LATEST GITHUB VERSION
# ============================================================

echo "[3/11] Updating from GitHub..."

git fetch origin main

git reset --hard origin/main

echo ""
echo "Current commit:"
git log -1 --oneline

# ============================================================
# STOP PROJECT
# ============================================================

echo ""
echo "[4/11] Stopping project containers..."

$COMPOSE down --remove-orphans

# IMPORTANT:
# DO NOT USE:
#
# docker compose down -v
#
# because that can remove project volumes.

# ============================================================
# REMOVE STOPPED CONTAINERS
# ============================================================

echo ""
echo "[5/11] Removing stopped Docker containers..."

docker container prune -f

# ============================================================
# REMOVE UNUSED IMAGES
# ============================================================

echo ""
echo "[6/11] Removing unused Docker images..."

docker image prune -af

# ============================================================
# REMOVE BUILD CACHE
# ============================================================

echo ""
echo "[7/11] Removing Docker build cache..."

docker builder prune -af

# ============================================================
# REMOVE UNUSED NETWORKS
# ============================================================

echo ""
echo "[8/11] Removing unused Docker networks..."

docker network prune -f

# ============================================================
# DO NOT REMOVE VOLUMES
# ============================================================

echo ""
echo "[9/11] Protecting Docker volumes..."

echo ""
echo "Current volumes:"
docker volume ls

echo ""
echo "Database and Media volumes remain untouched."

# ============================================================
# BUILD COMPLETELY FRESH
# ============================================================

echo ""
echo "[10/11] Building latest application..."

$COMPOSE build --no-cache --pull

# ============================================================
# START APPLICATION
# ============================================================

echo ""
echo "[11/11] Starting application..."

$COMPOSE up -d --force-recreate --remove-orphans

echo ""
echo "Waiting for Django..."
sleep 5

# ============================================================
# COLLECT STATIC
# ============================================================

echo ""
echo "Collecting latest CSS / JS..."

$COMPOSE exec -T web python manage.py collectstatic --noinput --clear

# ============================================================
# RESTART
# ============================================================

echo ""
echo "Restarting services..."

$COMPOSE restart

sleep 5

# ============================================================
# VERIFY CONTAINERS
# ============================================================

echo ""
echo "============================================================"
echo " CONTAINERS"
echo "============================================================"

$COMPOSE ps

# ============================================================
# VERIFY STATIC FILES
# ============================================================

echo ""
echo "============================================================"
echo " STATIC FILES"
echo "============================================================"

$COMPOSE exec -T web sh -c \
"ls -lh /app/staticfiles/css/portfolio.css"

$COMPOSE exec -T web sh -c \
"ls -lh /app/staticfiles/js/portfolio.js"

# ============================================================
# VERIFY DJANGO STATIC
# ============================================================

echo ""
echo "============================================================"
echo " DJANGO STATIC CHECK"
echo "============================================================"

$COMPOSE exec -T web python manage.py findstatic css/portfolio.css
$COMPOSE exec -T web python manage.py findstatic js/portfolio.js

# ============================================================
# VERIFY IMPORTANT VOLUMES
# ============================================================

echo ""
echo "============================================================"
echo " PROTECTED VOLUMES"
echo "============================================================"

docker volume ls

echo ""
echo "The following data was NOT deleted:"
echo ""
echo "  [SAFE] Database"
echo "  [SAFE] Media / uploaded images"
echo "  [SAFE] Django static volume"
echo ""

# ============================================================
# DOCKER DISK USAGE
# ============================================================

echo "============================================================"
echo " DOCKER DISK USAGE"
echo "============================================================"

docker system df

# ============================================================
# FINAL
# ============================================================

echo ""
echo "============================================================"
echo " UPDATE COMPLETED"
echo "============================================================"

echo ""
echo "Latest Git commit:"
git log -1 --oneline

echo ""
echo "Docker:"
echo "  Containers       -> refreshed"
echo "  Unused images    -> cleaned"
echo "  Build cache      -> cleaned"
echo "  Networks         -> cleaned"
echo ""

echo "Data:"
echo "  Database         -> PRESERVED"
echo "  Media            -> PRESERVED"
echo "  Docker volumes   -> PRESERVED"
echo ""

echo "CSS / JS:"
echo "  Fresh Docker build"
echo "  collectstatic --clear"
echo ""

echo "============================================================"
echo " DONE"
echo "============================================================"
echo ""
```
