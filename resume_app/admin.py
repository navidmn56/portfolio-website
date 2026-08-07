from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Profile, Skill, Education, CareerGoal,
    Experience, ExperienceBullet, Project, ProjectTag, Language
)

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
        ('Social Media', {
            'fields': ('github_url', 'linkedin_url', 'telegram_url', 'telegram_id')
        }),
        ('Footer', {
            'fields': ('collaboration_text',)
        }),
    )
    
    def has_add_permission(self, request):
        # فقط یه پروفایل می‌خوایم
        return not Profile.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'level_colored', 'order']
    list_editable = ['order']
    list_filter = ['level']
    search_fields = ['name']
    
    def level_colored(self, obj):
        colors = {
            'advanced': '#4ade80',
            'intermediate': '#60a5fa',
            'beginner': '#fbbf24'
        }
        color = colors.get(obj.level, '#fff')
        return format_html(
            '<span style="background:{}20; color:{}; padding:2px 10px; border-radius:10px; border:1px solid {}">{}</span>',
            color, color, color, obj.get_level_display()
        )
    level_colored.short_description = 'Level'

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'university', 'start_date', 'end_date', 'is_active', 'order']
    list_editable = ['order', 'is_active']

@admin.register(CareerGoal)
class CareerGoalAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not CareerGoal.objects.exists()

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['job_title', 'company', 'start_date', 'end_date', 'is_active', 'order']
    list_editable = ['order', 'is_active']
    inlines = [ExperienceBulletInline]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'order', 'tag_count', 'created_at']
    list_editable = ['order', 'is_active']
    inlines = [ProjectTagInline]
    
    def tag_count(self, obj):
        return obj.tags.count()
    tag_count.short_description = 'Tags'

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    list_editable = ['order']