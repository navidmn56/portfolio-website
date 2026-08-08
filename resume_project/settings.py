from pathlib import Path
import os


BASE_DIR = Path(__file__).resolve().parent.parent


# ============================================================
# Security
# ============================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-development-only-change-me",
)

DEBUG = os.getenv(
    "DEBUG",
    "False",
).lower() in ("true", "1", "yes")


ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1",
    ).split(",")
    if host.strip()
]


# ============================================================
# Applications
# ============================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "resume_app",
]


# ============================================================
# Middleware
# ============================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URLs / Templates
# ============================================================

ROOT_URLCONF = "resume_project.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "resume_project.wsgi.application"


# ============================================================
# Database
# ============================================================

DATABASE_PATH = os.getenv(
    "DATABASE_PATH",
    str(BASE_DIR / "db.sqlite3"),
)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": DATABASE_PATH,
    }
}


# ============================================================
# Password validation
# ============================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator",
    },
]


# ============================================================
# Internationalization
# ============================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# ============================================================
# Static files
# ============================================================

STATIC_URL = "/static/"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

STATIC_ROOT = BASE_DIR / "staticfiles"


# ============================================================
# Media files
# ============================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# ============================================================
# Reverse Proxy / HTTPS
# ============================================================

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)


# ============================================================
# Email
# ============================================================

EMAIL_BACKEND = (
    "django.core.mail.backends.console.EmailBackend"
)