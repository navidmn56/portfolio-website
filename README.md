```markdown
<div align="center">

# Developer Portfolio & Resume Website

**A modern, dynamic portfolio crafted with Django for showcasing your developer journey**

[![GitHub Stars](https://img.shields.io/github/stars/navidmn56/portfolio-website?style=flat-square&logo=github&color=f1c40f&labelColor=2c3e50)](https://github.com/navidmn56/portfolio-website/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square&logo=opensourceinitiative&color=3498db&labelColor=2c3e50)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white&color=2ecc71&labelColor=2c3e50)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-Latest-092E20?style=flat-square&logo=django&logoColor=white&color=44b78b&labelColor=2c3e50)](https://www.djangoproject.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white&color=2496ed&labelColor=2c3e50)](https://www.docker.com/)

<br>
<br>

<p align="center">
  <img src="screenshots/home.png" alt="Developer Portfolio Screenshot" width="85%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
</p>

</div>

---

## Overview

A fully responsive portfolio and resume website designed specifically for developers and programmers. Built with Django, it provides a clean, professional way to showcase your skills, projects, experience, and contact information.

All content is dynamically managed through the Django Admin Panel, allowing you to update your portfolio without touching a single line of HTML.

**Status:** Under Development  
**Language:** English

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
- [Production Deployment](#production-deployment)
  - [Automated Installation](#automated-installation)
  - [Post-Deployment](#post-deployment)
- [Updating the Website](#updating-the-website)
- [Useful Commands](#useful-commands)
- [Environment Variables](#environment-variables)
- [Production Architecture](#production-architecture)
- [Roadmap](#roadmap)
- [License](#license)
- [Developer](#developer)

---

## Key Features

| Category | Details |
|---|---|
| **Profile** | Personal introduction, profile image, professional title |
| **Skills** | Technical skills with visual proficiency indicators |
| **Projects** | Project showcase with descriptions, links, and technologies used |
| **Experience** | Career timeline with company details and achievements |
| **Education** | Academic background and certifications |
| **Social Links** | GitHub, LinkedIn, Twitter, and custom links |
| **Contact** | Email, phone, and location information |
| **Responsive Design** | Fully optimized for desktop, tablet, and mobile devices |
| **Admin Panel** | Dynamic content management through Django Admin |
| **HTTPS** | Automatic SSL certificates via Caddy |
| **Docker** | Containerized deployment for consistency and portability |

---

## Tech Stack

### Backend
- **Python 3.12** — Core programming language
- **Django** — Web framework with ORM and admin interface
- **Gunicorn** — WSGI HTTP server for production

### Frontend
- **HTML5** — Semantic structure
- **CSS3** — Custom styling with responsive design
- **JavaScript** — Interactive elements and animations

### Deployment
- **Docker & Docker Compose** — Container orchestration
- **Caddy** — Reverse proxy with automatic HTTPS
- **Linux** — Target production environment

---

## Project Structure

```
portfolio-website/
│
├── deploy/                        # Production deployment configurations
│   ├── Caddyfile                  # Caddy reverse proxy settings
│   ├── docker-compose.prod.yml    # Production overrides
│   └── install.sh                 # Automated server installer
│
├── media/                         # User-uploaded content
│   └── profile_images/
│
├── resume_app/                    # Main Django application
│   ├── migrations/                # Database migrations
│   ├── templates/
│   │   └── portfolio.html         # Main portfolio template
│   ├── admin.py                   # Admin panel configuration
│   ├── apps.py                    # App configuration
│   ├── models.py                  # Database models
│   ├── tests.py                   # Unit tests
│   ├── urls.py                    # URL routing
│   └── views.py                   # View logic
│
├── resume_project/                # Django project settings
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── static/                        # Static assets
│   ├── css/
│   │   └── portfolio.css
│   ├── images/
│   │   └── profile.jpg
│   └── js/
│       └── portfolio.js
│
├── screenshots/
│   └── home.png
│
├── Dockerfile                     # Docker image definition
├── docker-compose.yml             # Local development setup
├── manage.py                      # Django management script
├── requirements.txt               # Python dependencies
├── .gitignore
└── README.md
```

---

## Screenshots

<details>
<summary>Click to expand</summary>

<br>

### Home Section
*Personal introduction and profile image*

### Skills Section
*Technical skills with visual indicators*

### Projects Section
*Project cards with descriptions and links*

### Experience Section
*Career timeline with professional history*

### Contact Section
*Contact information and social links*

</details>

---

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Git
- Virtual environment (recommended)

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/navidmn56/portfolio-website.git
cd portfolio-website
```

**2. Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Apply database migrations**

```bash
python manage.py migrate
```

**5. Create a superuser for the admin panel**

```bash
python manage.py createsuperuser
```

**6. Run the development server**

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to see your portfolio.  
Access the admin panel at `http://127.0.0.1:8000/admin/`.

---

## Production Deployment

The project includes an automated deployment system for Linux servers using Docker, Gunicorn, and Caddy.

### Requirements

- Linux server (Ubuntu 20.04+ recommended)
- A domain or subdomain with DNS pointing to your server
- Ports `80` and `443` available
- Root or sudo access

### Automated Installation

**1. Clone the repository on your server**

```bash
git clone https://github.com/navidmn56/portfolio-website.git
cd portfolio-website
```

**2. Run the installer**

```bash
chmod +x deploy/install.sh
sudo ./deploy/install.sh
```

The installer handles:
- Docker and Docker Compose installation (if needed)
- Production environment configuration
- Docker image building
- Database migrations
- Static file collection
- Caddy configuration with automatic HTTPS

**3. Access your website**

```
https://your-domain.com
```

**4. Access the admin panel**

```
https://your-domain.com/admin/
```

### Post-Deployment

Create an admin account:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py createsuperuser
```

---

## Updating the Website

After pushing changes to GitHub, pull and rebuild on the server:

```bash
cd ~/portfolio-website
git pull
```

Rebuild and restart:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  up -d --build
```

If models changed:

```bash
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml exec web python manage.py makemigrations
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml exec web python manage.py migrate
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml exec web python manage.py collectstatic --noinput
```

---

## Useful Commands

```bash
# Check container status
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml logs -f

# Restart services
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml restart

# Stop services
docker compose -f docker-compose.yml -f deploy/docker-compose.prod.yml down
```

---

## Environment Variables

Production environment variables are stored in a `.env` file on the server. This file contains sensitive information and is excluded from version control via `.gitignore`.

Key variables include:
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- Database credentials (if applicable)

---

## Production Architecture

```
                        Internet
                           |
                           v
                    +---------------+
                    |     Caddy     |
                    |  HTTPS / SSL  |
                    |  Ports 80,443 |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    |   Gunicorn    |
                    |  WSGI Server  |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    |    Django     |
                    |  Application  |
                    +---------------+
```

Caddy automatically obtains and renews SSL certificates while reverse-proxying requests to Gunicorn, which serves the Django application.

---

## Roadmap

- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Blog section
- [ ] Downloadable PDF resume
- [ ] Contact form with email integration
- [ ] Performance optimizations
- [ ] Enhanced customization options

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Developer

**Navid**

- GitHub: [github.com/navidmn56](https://github.com/navidmn56)

---

<div align="center">
  <br>
  <p>Built with Django, Python, and modern web technologies</p>
  <p>
    <a href="https://github.com/navidmn56/portfolio-website/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/navidmn56/portfolio-website/issues">Request Feature</a>
  </p>
</div>
```