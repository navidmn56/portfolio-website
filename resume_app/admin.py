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
    
    
# resume_app/admin.py - بخش Backup (کامل)

from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, render
from django.contrib import messages
from django.http import FileResponse, Http404
from django import forms
from .models import Backup


class BackupForm(forms.Form):
    description = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 3,
            'style': 'width:100%; padding:10px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff;'
        }),
        label='📝 توضیحات',
        help_text='توضیحات دلخواه برای این بکاپ'
    )


@admin.register(Backup)
class BackupAdmin(admin.ModelAdmin):
    change_list_template = "admin/resume_app/backup_changelist.html"
    
    list_display = [
        'name',
        'status_badge',
        'get_human_size_display',
        'created_at',
        'restored_at',
        'actions_buttons'
    ]
    
    list_filter = ['status', 'is_automatic']
    search_fields = ['name', 'description']
    
    readonly_fields = [
        'backup_file',
        'backup_size',
        'status',
        'error_message',
        'created_at',
        'restored_at'
    ]
    
    fieldsets = (
        ('📦 Backup Information', {
            'fields': ('name', 'description')
        }),
        ('📊 Statistics', {
            'fields': ('backup_size', 'get_human_size')
        }),
        ('📁 File', {
            'fields': ('backup_file',)
        }),
        ('🔄 Status', {
            'fields': ('status', 'error_message')
        }),
        ('⏰ Timeline', {
            'fields': ('created_at', 'restored_at')
        }),
        ('🤖 Automation', {
            'fields': ('is_automatic',)
        })
    )
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'create-backup/',
                self.admin_site.admin_view(self.create_backup_view),
                name='backup-create-backup'
            ),
            path(
                '<int:backup_id>/restore/',
                self.admin_site.admin_view(self.restore_backup_view),
                name='backup-restore-backup'
            ),
            path(
                '<int:backup_id>/download/',
                self.admin_site.admin_view(self.download_backup_view),
                name='backup-download-backup'
            ),
            path(
                '<int:backup_id>/delete/',
                self.admin_site.admin_view(self.delete_backup_view),
                name='backup-delete-backup'
            ),
        ]
        return custom_urls + urls
    
    def status_badge(self, obj):
        colors = {
            'success': '#4ade80',
            'failed': '#f87171',
            'processing': '#fbbf24'
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{}20; color:{}; padding:4px 12px; border-radius:12px; font-weight:600; font-size:0.75rem;">{}</span>',
            color, color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def get_human_size_display(self, obj):
        return obj.get_human_size()
    get_human_size_display.short_description = 'Size'
    
    def actions_buttons(self, obj):
        buttons = []
        
        if obj.status == Backup.BackupStatus.SUCCESS and obj.backup_file:
            # دکمه دانلود
            buttons.append(
                format_html(
                    '<a href="{}" class="button" style="background:#3b82f6; color:#fff; padding:4px 10px; border-radius:6px; text-decoration:none; margin-right:4px; font-size:0.7rem; display:inline-block;">📥 Download</a>',
                    f'../{obj.id}/download/'
                )
            )
            
            # دکمه ریستور
            buttons.append(
                format_html(
                    '<a href="{}" class="button" style="background:#f59e0b; color:#fff; padding:4px 10px; border-radius:6px; text-decoration:none; margin-right:4px; font-size:0.7rem; display:inline-block;">🔄 Restore</a>',
                    f'../{obj.id}/restore/'
                )
            )
            
            # دکمه حذف
            buttons.append(
                format_html(
                    '<a href="{}" class="button" style="background:#ef4444; color:#fff; padding:4px 10px; border-radius:6px; text-decoration:none; margin-right:4px; font-size:0.7rem; display:inline-block;">🗑️ Delete</a>',
                    f'../{obj.id}/delete/'
                )
            )
        
        return format_html('{}', ' '.join(buttons))
    actions_buttons.short_description = 'Actions'
    actions_buttons.allow_tags = True
    
    def create_backup_view(self, request):
        """ایجاد بکاپ جدید - بدون دستور"""
        if request.method == 'POST':
            form = BackupForm(request.POST)
            if form.is_valid():
                description = form.cleaned_data['description']
                
                try:
                    backup = Backup.create_backup(description=description)
                    messages.success(
                        request,
                        f'✅ Backup "{backup.name}" created successfully! ({backup.get_human_size()})'
                    )
                except Exception as e:
                    messages.error(request, f'❌ Error creating backup: {str(e)}')
                
                return redirect('admin:resume_app_backup_changelist')
        else:
            form = BackupForm()
        
        context = {
            'form': form,
            'title': '📦 Create New SQLite Backup',
            'opts': self.model._meta,
            'app_label': self.model._meta.app_label,
            'media': self.media,
        }
        return render(request, 'admin/resume_app/backup_create.html', context)
    
    def restore_backup_view(self, request, backup_id):
        """ریستور کردن بکاپ - بدون دستور"""
        backup = self.get_object(request, backup_id)
        
        if not backup:
            messages.error(request, 'Backup not found!')
            return redirect('admin:resume_app_backup_changelist')
        
        if request.method == 'POST':
            try:
                backup.restore_backup()
                messages.success(
                    request,
                    f'✅ Database restored successfully from "{backup.name}"!'
                )
            except Exception as e:
                messages.error(request, f'❌ Error restoring backup: {str(e)}')
            
            return redirect('admin:resume_app_backup_changelist')
        
        context = {
            'backup': backup,
            'title': f'🔄 Restore Database from: {backup.name}',
            'opts': self.model._meta,
            'app_label': self.model._meta.app_label,
            'media': self.media,
        }
        return render(request, 'admin/resume_app/backup_restore.html', context)
    
    def download_backup_view(self, request, backup_id):
        """دانلود فایل بکاپ - بدون دستور"""
        backup = self.get_object(request, backup_id)
        
        if not backup or not backup.backup_file:
            raise Http404("Backup or file not found")
        
        response = FileResponse(
            backup.backup_file.open('rb'),
            content_type='application/x-sqlite3'
        )
        response['Content-Disposition'] = f'attachment; filename="{backup.backup_file.name}"'
        return response
    
    def delete_backup_view(self, request, backup_id):
        """حذف بکاپ - بدون دستور"""
        backup = self.get_object(request, backup_id)
        
        if not backup:
            messages.error(request, 'Backup not found!')
            return redirect('admin:resume_app_backup_changelist')
        
        if request.method == 'POST':
            backup_name = backup.name
            if backup.backup_file:
                backup.backup_file.delete()
            backup.delete()
            messages.success(request, f'✅ Backup "{backup_name}" deleted successfully!')
            return redirect('admin:resume_app_backup_changelist')
        
        context = {
            'backup': backup,
            'title': f'🗑️ Delete Backup: {backup.name}',
            'opts': self.model._meta,
            'app_label': self.model._meta.app_label,
            'media': self.media,
        }
        return render(request, 'admin/resume_app/backup_delete.html', context)
    
    def get_actions(self, request):
        """حذف اکشن‌های پیش‌فرض"""
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions