# Developer Resume & Portfolio Website

A modern, responsive personal resume and portfolio website built with **Django** for developers and programmers.

The project provides a clean and professional way to showcase personal information, technical skills, projects, career experience, education, social links, and contact information.

All portfolio content can be managed through the **Django Admin Panel**, making it easy to update the website without modifying the HTML templates directly.

> **Current version:** English
> **Project status:** Under Development

---

## 🔗 Repository

<div align="center">

### 🌐 GitHub Repository

<a href="https://github.com/navidmn56/portfolio-website">
  <img src="https://img.shields.io/badge/GitHub-Portfolio%20Website-181717?style=for-the-badge&logo=github" alt="GitHub Repository">
</a>

<br><br>

<a href="https://github.com/navidmn56/portfolio-website">
  <strong>github.com/navidmn56/portfolio-website</strong>
</a>

</div>

---

## 📸 Screenshots

The project includes screenshots demonstrating the different sections of the portfolio website.

| Home                          | Portfolio                                        |
| ----------------------------- | ------------------------------------------------ |
| ![Home](screenshots/home.png) | ![Portfolio](screenshots/download%20%283%29.png) |

| Skills                                        | Contact                                        |
| --------------------------------------------- | ---------------------------------------------- |
| ![Skills](screenshots/download%20%284%29.png) | ![Contact](screenshots/download%20%286%29.png) |

---

## ✨ Features

* Modern developer-focused resume website
* Fully responsive design
* Mobile-friendly interface
* Personal profile section
* Profile image support
* Technical skills and technologies
* Projects showcase
* Career and professional experience
* Education information
* Social media links
* Contact information
* Dynamic content management with Django Admin
* Image upload support
* Custom HTML/CSS/JavaScript frontend
* Docker support
* Production-ready deployment
* Gunicorn application server
* Caddy reverse proxy
* Automatic HTTPS / SSL
* Automated Linux server installation
* Static file collection
* Database migrations
* Production Docker Compose configuration

---

## 🛠️ Tech Stack

### Backend

| Technology | Version / Usage        |
| ---------- | ---------------------- |
| Python     | **3.12**               |
| Django     | Web framework          |
| Gunicorn   | Production WSGI server |

### Frontend

| Technology | Usage                       |
| ---------- | --------------------------- |
| HTML5      | Page structure              |
| CSS3       | Styling & responsive design |
| JavaScript | Interactive functionality   |

### Deployment

| Technology     | Usage                   |
| -------------- | ----------------------- |
| Docker         | Containerization        |
| Docker Compose | Container orchestration |
| Caddy          | Reverse proxy & HTTPS   |
| Linux          | Production server       |

---

## 📁 Project Structure

```text
portfolio-website/
│
├── deploy/
│   ├── Caddyfile
│   ├── docker-compose.prod.yml
│   └── install.sh
│
├── media/
│   └── profile_images/
│
├── resume_app/
│   ├── migrations/
│   ├── templates/
│   │   └── portfolio.html
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── resume_project/
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── screenshots/
│   ├── home.png
│   ├── download (3).png
│   ├── download (4).png
│   ├── download (6).png
│   └── download (7).png
│
├── static/
│   ├── css/
│   │   └── portfolio.css
│   ├── images/
│   │   └── profile.jpg
│   └── js/
│       └── portfolio.js
│
├── Dockerfile
├── docker-compose.yml
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

# ⚙️ Admin Panel

The website uses **Django Admin** as a content management interface.

After deployment, the administration panel is available at:

```text
https://your-domain.com/admin/
```

From the admin panel, you can manage:

* Profile information
* Profile image
* Technical skills
* Projects
* Career experience
* Education
* Social links
* Contact information

This allows the portfolio to be updated without directly editing the HTML templates.

---

# 🚀 Deployment

The project includes an automated deployment system for Linux servers using **Docker, Gunicorn, and Caddy**.

## Requirements

Before deployment, you need:

* Linux server
* Python 3.12 compatible environment
* A registered domain or subdomain
* DNS pointing to your server
* Ports `80` and `443` available
* Docker
* Docker Compose

The installation script can automatically install Docker and Docker Compose if they are not already available.

---

## 1. Clone the Repository

```bash
git clone https://github.com/navidmn56/portfolio-website.git
cd portfolio-website
```

---

## 2. Run the Installer

Make the installation script executable:

```bash
chmod +x deploy/install.sh
```

Then run:

```bash
sudo ./deploy/install.sh
```

The installer will guide you through the deployment process.

It automatically handles the main production setup, including:

* Detecting the server IP
* Checking DNS configuration
* Creating the production environment
* Building the Docker image
* Starting the Django application
* Running database migrations
* Collecting static files
* Starting Gunicorn
* Configuring Caddy
* Obtaining the SSL certificate
* Enabling HTTPS

Once the installation is complete:

```text
https://your-domain.com
```

The Django Admin panel will be available at:

```text
https://your-domain.com/admin/
```

---

# 👤 Creating an Admin Account

After deployment, create a Django superuser:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py createsuperuser
```

Follow the prompts to create your administrator account.

---

# 🔄 Updating the Website

After making changes locally and pushing them to GitHub, connect to your server and pull the latest version:

```bash
cd ~/portfolio-website
git pull
```

Rebuild and restart the production container:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  up -d --build
```

If you have model changes, create migrations:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py makemigrations
```

Apply the migrations:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py migrate
```

Collect static files:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py collectstatic --noinput
```

---

# 🧰 Useful Docker Commands

### Check containers

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  ps
```

### View logs

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  logs -f
```

### Restart application

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  restart
```

### Stop application

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  down
```

---

# 🔐 Environment Variables

Production environment variables are generated and configured on the server.

Sensitive information such as:

* Django Secret Key
* Database credentials
* Production configuration
* Other private environment variables

should **never be committed to GitHub**.

The production `.env` file should remain on the server and must be excluded through `.gitignore`.

---

# 🐳 Docker Architecture

The production deployment uses a containerized architecture:

```text
                    Internet
                       │
                       ▼
                 ┌───────────┐
                 │   Caddy   │
                 │ HTTPS/SSL │
                 └─────┬─────┘
                       │
                       ▼
                ┌─────────────┐
                │   Gunicorn  │
                │   Django    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │ Application │
                │    Data     │
                └─────────────┘
```

Caddy handles HTTPS and reverse proxying, while Gunicorn serves the Django application.

---

# 📌 Project Status

The project is currently **under active development**.

The current version provides an English-language developer resume and portfolio experience with dynamic content management through Django Admin.

Future versions may include:

* Additional language support
* More customization options
* Improved portfolio sections
* Additional animations and interactions
* Enhanced content management
* Further performance improvements

---

# 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

### 👨‍💻 Developer

**Navid**

<a href="https://github.com/navidmn56">
  <img src="https://img.shields.io/badge/GitHub-navidmn56-181717?style=for-the-badge&logo=github" alt="GitHub">
</a>

<br><br>

⭐ If you find this project useful, consider giving it a star!

</div>
