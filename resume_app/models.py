from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Profile(models.Model):
    """اطلاعات اصلی پروفایل"""
    full_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200, help_text="مثلاً: AI Engineer (in progress)")
    profile_image = models.ImageField(
        upload_to='profile_images/', 
        blank=True, 
        null=True,
        help_text="عکس پروفایل - فرمت JPG یا PNG - سایز مربعی (مثلاً 500x500)"
    )
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=100, default="Karaj, Iran")
    location_url = models.URLField(blank=True, null=True)
    summary = models.TextField(help_text="خلاصه درباره من")
    is_available = models.BooleanField(default=True, help_text="آماده همکاری؟")
    
    # Footer
    collaboration_text = models.CharField(max_length=200, default="Ready to collaborate on AI & Python projects")
    
    class Meta:
        verbose_name = "👤 Profile"
        verbose_name_plural = "👤 Profile"
    
    def __str__(self):
        return self.full_name
    
    def save(self, *args, **kwargs):
        # فقط یه پروفایل می‌تونه وجود داشته باشه
        if not self.pk and Profile.objects.exists():
            raise ValueError("Only one profile can exist. Edit the existing one.")
        super().save(*args, **kwargs)


class SocialMedia(models.Model):
    """شبکه‌های اجتماعی - کاملاً داینامیک"""
    # لیست آیکون‌های آماده
    ICON_CHOICES = [
        ('fab fa-github', 'GitHub'),
        ('fab fa-linkedin-in', 'LinkedIn'),
        ('fab fa-telegram-plane', 'Telegram'),
        ('fab fa-whatsapp', 'WhatsApp'),
        ('fab fa-instagram', 'Instagram'),
        ('fab fa-x-twitter', 'Twitter/X'),
        ('fab fa-youtube', 'YouTube'),
        ('fab fa-discord', 'Discord'),
        ('fab fa-stack-overflow', 'Stack Overflow'),
        ('fab fa-gitlab', 'GitLab'),
        ('fab fa-medium', 'Medium'),
        ('fab fa-dev', 'Dev.to'),
        ('fab fa-dribbble', 'Dribbble'),
        ('fab fa-behance', 'Behance'),
        ('fab fa-codepen', 'CodePen'),
        ('fas fa-envelope', 'Email'),
        ('fas fa-globe', 'Website'),
        ('fas fa-blog', 'Blog'),
    ]
    
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='social_media')
    name = models.CharField(max_length=50, help_text="اسم نمایشی (مثلاً: GitHub)")
    url = models.URLField(help_text="لینک کامل (مثلاً: https://github.com/username)")
    icon_class = models.CharField(
        max_length=50, 
        choices=ICON_CHOICES,
        help_text="آیکون فونت‌آسام",
        default='fab fa-github'
    )
    show_tooltip = models.BooleanField(default=False, help_text="متن راهنما نشون بده؟ (مثل آیدی تلگرام)")
    tooltip_text = models.CharField(max_length=50, blank=True, null=True, help_text="متن راهنما (مثلاً: @my_id)")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = "🔗 Social Media"
        verbose_name_plural = "🔗 Social Media Links"
    
    def __str__(self):
        return f"{self.name} ({self.url})"


class Skill(models.Model):
    """مهارت‌ها"""
    class Level(models.TextChoices):
        ADVANCED = 'advanced', '🟢 Advanced'
        INTERMEDIATE = 'intermediate', '🔵 Intermediate'
        BEGINNER = 'beginner', '🟡 Beginner'
    
    name = models.CharField(max_length=50)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.INTERMEDIATE)
    order = models.PositiveIntegerField(default=0, help_text="ترتیب نمایش (عدد کمتر = اولویت بالاتر)")
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = "💻 Skill"
        verbose_name_plural = "💻 Skills"
    
    def __str__(self):
        return f"{self.name} ({self.get_level_display()})"


class Education(models.Model):
    """تحصیلات"""
    degree = models.CharField(max_length=200)
    university = models.CharField(max_length=200)
    location = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.CharField(max_length=50, help_text="مثلاً: 2023")
    end_date = models.CharField(max_length=50, default="Present", help_text="مثلاً: Present یا 2025")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-start_date']
        verbose_name = "🎓 Education"
        verbose_name_plural = "🎓 Education"
    
    def __str__(self):
        return f"{self.degree} - {self.university}"


class CareerGoal(models.Model):
    """هدف شغلی"""
    ICON_CHOICES = [
        ('fa-robot', '🤖 Robot'),
        ('fa-brain', '🧠 Brain'),
        ('fa-rocket', '🚀 Rocket'),
        ('fa-star', '⭐ Star'),
        ('fa-lightbulb', '💡 Lightbulb'),
        ('fa-fire', '🔥 Fire'),
        ('fa-bullseye', '🎯 Target'),
        ('fa-gem', '💎 Gem'),
    ]
    
    icon = models.CharField(max_length=50, choices=ICON_CHOICES, default='fa-robot')
    title = models.CharField(max_length=200, default="Career Goal")
    description = models.TextField(help_text="می‌تونی از HTML استفاده کنی (مثلاً لینک)")
    link_text = models.CharField(max_length=100, blank=True, null=True)
    link_url = models.URLField(blank=True, null=True)
    
    class Meta:
        verbose_name = "🎯 Career Goal"
        verbose_name_plural = "🎯 Career Goal"
    
    def __str__(self):
        return self.title


class Experience(models.Model):
    """تجربه کاری"""
    job_title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, default="Present")
    is_active = models.BooleanField(default=True, help_text="آیا هنوز مشغول به کار هستید؟")
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-start_date']
        verbose_name = "💼 Experience"
        verbose_name_plural = "💼 Experiences"
    
    def __str__(self):
        return f"{self.job_title} at {self.company}"


class ExperienceBullet(models.Model):
    """آیتم‌های لیست تجربه کاری"""
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='bullets')
    text = models.CharField(max_length=300)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = "📌 Experience Bullet"
        verbose_name_plural = "📌 Experience Bullets"
    
    def __str__(self):
        return self.text[:50]


class Project(models.Model):
    """پروژه‌ها"""
    # لیست کامل آیکون‌های مناسب پروژه
    ICON_CHOICES = [
        # Web & Development
        ('fa-code', '💻 Code'),
        ('fa-laptop-code', '🖥️ Laptop Code'),
        ('fa-globe', '🌐 Globe'),
        ('fa-server', '🖧 Server'),
        ('fa-database', '🗄️ Database'),
        ('fa-cloud', '☁️ Cloud'),
        # Apps & Tools
        ('fa-calendar-check', '📅 Calendar'),
        ('fa-tasks', '✅ Tasks'),
        ('fa-shopping-cart', '🛒 Shopping Cart'),
        ('fa-shopping-bag', '🛍️ Shopping Bag'),
        ('fa-store', '🏪 Store'),
        # AI & Data
        ('fa-robot', '🤖 Robot/AI'),
        ('fa-brain', '🧠 Brain/ML'),
        ('fa-chart-line', '📈 Chart'),
        ('fa-chart-bar', '📊 Bar Chart'),
        ('fa-chart-pie', '🥧 Pie Chart'),
        # Communication
        ('fa-comments', '💬 Chat'),
        ('fa-comment-dots', '🗨️ Comment'),
        ('fa-envelope', '✉️ Email'),
        ('fa-bell', '🔔 Notification'),
        # Media
        ('fa-camera', '📷 Camera'),
        ('fa-image', '🖼️ Image'),
        ('fa-video', '🎬 Video'),
        ('fa-music', '🎵 Music'),
        # Weather & Maps
        ('fa-cloud-sun', '⛅ Weather'),
        ('fa-map-marker-alt', '📍 Map'),
        ('fa-map', '🗺️ Map 2'),
        # Security
        ('fa-shield-alt', '🛡️ Security'),
        ('fa-lock', '🔒 Lock'),
        ('fa-key', '🔑 Key'),
        # Gaming
        ('fa-gamepad', '🎮 Game'),
        ('fa-chess', '♟️ Chess'),
        # Health
        ('fa-heartbeat', '❤️ Health'),
        ('fa-stethoscope', '🩺 Medical'),
        # Other
        ('fa-cogs', '⚙️ Settings'),
        ('fa-tools', '🔧 Tools'),
        ('fa-magic', '✨ Magic'),
        ('fa-bolt', '⚡ Fast'),
        ('fa-fire', '🔥 Hot'),
        ('fa-mobile-alt', '📱 Mobile'),
        ('fa-desktop', '🖥️ Desktop'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    github_url = models.URLField(help_text="لینک گیت‌هاب پروژه")
    icon_class = models.CharField(
        max_length=50,
        choices=ICON_CHOICES,
        default='fa-code',
        help_text="آیکون پروژه - با ایموجی انتخاب کن"
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "🚀 Project"
        verbose_name_plural = "🚀 Projects"
    
    def __str__(self):
        return self.title


class ProjectTag(models.Model):
    """تگ‌های تکنولوژی هر پروژه"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=50)
    
    class Meta:
        verbose_name = "🏷️ Project Tag"
        verbose_name_plural = "🏷️ Project Tags"
    
    def __str__(self):
        return f"{self.name} ({self.project.title})"


class Language(models.Model):
    """زبان‌ها"""
    name = models.CharField(max_length=100, help_text="مثلاً: Persian (Native)")
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = "🌐 Language"
        verbose_name_plural = "🌐 Languages"
    
    def __str__(self):
        return self.name