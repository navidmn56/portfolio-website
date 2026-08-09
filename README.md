# Developer Resume & Portfolio Website

<p align="center">
  A modern, responsive personal resume and portfolio website built with <strong>Django</strong>, designed for developers and programmers.
</p>

<p align="center">
  A clean and professional platform for showcasing personal information, technical skills, projects, career experience, education, social links, and contact information.
</p>

<br>

<div align="center">

<table>
<tr>
<td align="center" width="50%">

<strong>Project Repository</strong>

<br><br>

<a href="https://github.com/navidmn56/portfolio-website">
  <img src="https://img.shields.io/badge/GitHub-Portfolio%20Website-181717?style=for-the-badge&logo=github" alt="Portfolio Repository">
</a>

<br><br>

</td>

<td align="center" width="50%">

<strong>Developer</strong>

<br><br>

<a href="https://github.com/navidmn56">
  <img src="https://img.shields.io/badge/GitHub-Navid%20Moradi-181717?style=for-the-badge&logo=github" alt="Developer GitHub">
</a>

<br><br>

<a href="https://github.com/navidmn56">
  github.com/navidmn56
</a>

</td>
</tr>

<tr>
<td colspan="2" align="center">

<br>

<img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.12">

<img src="https://img.shields.io/badge/Django-Framework-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">

<img src="https://img.shields.io/badge/Docker-Production-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">

<img src="https://img.shields.io/badge/Caddy-HTTPS-1F88C0?style=for-the-badge&logo=caddy&logoColor=white" alt="Caddy">

<br><br>

</td>
</tr>
</table>

</div>

---

## Screenshot

<p align="center">
  <img src="screenshots/home.png" alt="Developer Resume & Portfolio Website" width="900">
</p>

---

## Features

* Developer-focused resume and portfolio website
* Fully responsive design
* Mobile-friendly interface
* Personal profile section
* Profile image support
* Technical skills and technologies
* Projects showcase
* Career experience
* Education information
* Social media links
* Contact information
* Dynamic content management through Django Admin
* Image upload support
* Custom HTML, CSS and JavaScript frontend
* Docker support
* Production deployment with Gunicorn and Caddy
* Automatic HTTPS with Caddy
* Automated Linux server installation

---

## Tech Stack

### Backend

* Python 3.12
* Django
* Gunicorn

### Frontend

* HTML5
* CSS3
* JavaScript

### Deployment

* Docker
* Docker Compose
* Caddy
* Linux
---

## Project Structure

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
│   └── home.png
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

## Admin Panel

The website uses **Django Admin** to manage portfolio content.

After deployment, the admin panel is available at:

```text
https://your-domain.com/admin/
```

The following content can be managed through the admin panel:

* Profile information
* Profile image
* Technical skills
* Projects
* Career experience
* Education
* Social links
* Contact information

This makes it possible to update the portfolio without modifying the HTML templates directly.

---

## Deployment

The project includes an automated production deployment system for Linux servers using Docker, Gunicorn and Caddy.

### Requirements

* Linux server
* Python 3.12
* Domain or subdomain
* DNS pointing to the server
* Ports `80` and `443` available
* Docker
* Docker Compose

Docker and Docker Compose can be installed automatically by the deployment script if they are not already available.

### Clone the Repository

```bash
git clone https://github.com/navidmn56/portfolio-website.git
cd portfolio-website
```

### Run the Installer

```bash
chmod +x deploy/install.sh
sudo ./deploy/install.sh
```

The installer handles the main production deployment steps:

* Detecting the server IP
* Checking DNS configuration
* Creating the production environment
* Building the Docker image
* Starting Django
* Running database migrations
* Collecting static files
* Starting Gunicorn
* Configuring Caddy
* Obtaining the SSL certificate
* Enabling HTTPS

After installation:

```text
https://your-domain.com
```

Admin panel:

```text
https://your-domain.com/admin/
```

---

## Creating an Admin Account

After deployment, create a Django superuser:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py createsuperuser
```

Follow the prompts to create the administrator account.

---

## Updating the Website

After making changes and pushing them to GitHub:

```bash
cd ~/portfolio-website
git pull
```

Rebuild and restart the application:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  up -d --build
```

If model changes were made, create migrations:

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  exec web python manage.py makemigrations
```

Apply migrations:

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

## Useful Commands

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

### Restart the application

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  restart
```

### Stop the application

```bash
docker compose \
  -f docker-compose.yml \
  -f deploy/docker-compose.prod.yml \
  down
```

---

## Environment Variables

Production environment variables are configured on the server.

Sensitive information such as the Django secret key, database credentials and other private configuration values should never be committed to GitHub.

The production `.env` file should remain on the server and be excluded through `.gitignore`.

---

## Production Architecture

```text
                    Internet
                       |
                       v
                +-------------+
                |    Caddy    |
                | HTTPS / SSL |
                +------+------+
                       |
                       v
                +-------------+
                |  Gunicorn   |
                |    Django   |
                +------+------+
                       |
                       v
                +-------------+
                | Application |
                |    Data     |
                +-------------+
```

Caddy handles HTTPS and reverse proxying, while Gunicorn serves the Django application.

---

## Project Status

The project is currently under development.

The current version focuses on an English-language developer resume and portfolio experience with dynamic content management through Django Admin.

Future improvements may include additional language support, further customization options, enhanced portfolio sections and additional performance improvements.

---

## License

This project is licensed under the **MIT License**.

---


<p align="center">
  Built with Django, Python and modern web technologies.
</p>
