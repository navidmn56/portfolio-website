# Developer Resume Website

A personal resume and portfolio website built with **Django**, designed specifically for developers and programmers.

The website provides a clean way to present personal information, skills, projects, and other professional details. Content can be managed through the **Django Admin Panel**, making it possible to customize the resume without directly editing the website templates.

> Currently, the website is available in English.

---

## 📸 Screenshots

### Homepage

![Homepage](screenshots/home.png)


## ✨ Features

* Developer-focused resume and portfolio
* Responsive website layout
* Personal profile information
* Profile image management
* Projects section
* Skills and technologies section
* Content management through Django Admin
* Image upload support
* Social and contact information
* Docker support
* English language interface

---

## 🛠️ Built With

* **Python**
* **Django**
* **HTML**
* **CSS**
* **JavaScript**
* **Docker**
* **Git**

---

## ⚙️ Django Admin

The website uses Django Admin to manage the resume content.

Administrators can update the available information through the admin panel instead of changing the source code manually.

For example, profile information, projects, skills, and other available content can be managed from:

```text
/admin/
```

To create an administrator account:

```bash
python manage.py createsuperuser
```

## 📁 Project Structure

```text
resume_site/
│
├── resume_app/
│   ├── migrations/
│   ├── templates/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   └── views.py
│
├── resume_project/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── screenshots/
│   ├── home.png
│   ├── projects.png
│   ├── skills.png
│   └── admin.png
│
├── static/
│   ├── css/
│   ├── images/
│   └── js/
│
├── media/
│   └── profile_images/
│
├── Dockerfile
├── docker-compose.yml
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 🔧 Customization

The resume content is designed to be managed through Django Admin.

After creating a superuser, open:

```text
http://127.0.0.1:8000/admin/
```

From there, you can manage the content provided by the application.

The website is currently focused on an English-language resume and portfolio experience.

---

## 📌 Project Status

The project is currently under development.

More customization options and features may be added in future updates.

---

## 📄 License

This project is licensed under the MIT License.
