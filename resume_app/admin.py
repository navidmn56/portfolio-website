from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Profile, SocialMedia, Skill, Education, CareerGoal,
    Experience, ExperienceBullet, Project, ProjectTag, Language
)

class SocialMediaInline(admin.TabularInline):
    """شبکه‌های اجتماعی داخل پروفایل"""
    model = SocialMedia
    extra = 1
    fields = ['name', 'url', 'icon_class', 'show_tooltip', 'tooltip_text', 'order', 'is_active']
    ordering = ['order']


class ExperienceBulletInline(admin.TabularInline):
    model = ExperienceBullet
    extra = 1
    fields = ['text', 'order']


class ProjectTagInline(admin.TabularInline):
    model = ProjectTag
    extra = 1
    fields = ['name']


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('full_name', 'title', 'profile_image', 'summary', 'is_available')
        }),
        ('Contact Info', {
            'fields': ('email', 'phone', 'location', 'location_url')
        }),
        ('Footer', {
            'fields': ('collaboration_text',)
        }),
    )
    
    inlines = [SocialMediaInline]
    
    # پیش‌نمایش عکس توی لیست
    def image_preview(self, obj):
        if obj and obj.profile_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />',
                obj.profile_image.url
            )
        return "No Image"
    image_preview.short_description = 'Image'
    
    # اضافه کردن پیش‌نمایش به list_display
    list_display = ['full_name', 'image_preview', 'email', 'title']
    
    def has_add_permission(self, request):
        # فقط یه پروفایل
        return not Profile.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon_preview', 'url', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'url']
    
    def icon_preview(self, obj):
        if obj and obj.icon_class:
            return format_html(
                '<i class="{}" style="font-size: 1.5rem; color: #66d9ff;"></i>',
                obj.icon_class
            )
        return "-"
    icon_preview.short_description = 'Icon'


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'level_colored', 'order']
    list_editable = ['order']
    list_filter = ['level']
    search_fields = ['name']
    
    def level_colored(self, obj):
        if not obj:
            return "-"
        colors = {
            'advanced': '#4ade80',
            'intermediate': '#60a5fa',
            'beginner': '#fbbf24'
        }
        color = colors.get(obj.level, '#fff')
        level_display = obj.get_level_display()
        return format_html(
            '<span style="background:{}20; color:{}; padding:4px 12px; border-radius:12px; border:1px solid {}; font-weight:600;">{}</span>',
            color, color, color, level_display
        )
    level_colored.short_description = 'Level'


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'university', 'start_date', 'end_date', 'is_active', 'order']
    list_editable = ['order', 'is_active']


@admin.register(CareerGoal)
class CareerGoalAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon_preview']
    
    def icon_preview(self, obj):
        if obj and obj.icon:
            return format_html(
                '<i class="fas {}" style="font-size: 1.5rem; color: #66d9ff;"></i>',
                obj.icon
            )
        return "-"
    icon_preview.short_description = 'Icon'
    
    def has_add_permission(self, request):
        return not CareerGoal.objects.exists()


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['job_title', 'company', 'start_date', 'end_date', 'is_active', 'order']
    list_editable = ['order', 'is_active']
    inlines = [ExperienceBulletInline]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon_preview', 'is_active', 'order', 'tag_count']
    list_editable = ['order', 'is_active']
    inlines = [ProjectTagInline]
    search_fields = ['title', 'description']
    list_filter = ['is_active']
    
    def icon_preview(self, obj):
        if obj and obj.icon_class:
            return format_html(
                '<i class="fas {}" style="font-size: 1.5rem; color: #66d9ff;"></i>',
                obj.icon_class
            )
        return "-"
    icon_preview.short_description = 'Icon'
    
    def tag_count(self, obj):
        if not obj:
            return "0 tags"
        count = obj.tags.count()
        return format_html(
            '<span style="background:rgba(102,217,255,0.1); color:#66d9ff; padding:2px 10px; border-radius:10px;">{} tag{}</span>',
            count,
            's' if count != 1 else ''
        )
    tag_count.short_description = 'Tags'


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    list_editable = ['order']