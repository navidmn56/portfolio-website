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





# resume_app/admin.py

from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect
from django.http import FileResponse, Http404
from django.template.response import TemplateResponse

from .models import (
    Profile,
    SocialMedia,
    Skill,
    Education,
    CareerGoal,
    Experience,
    ExperienceBullet,
    Project,
    ProjectTag,
    Language,
    Backup,
)



@admin.register(Backup)
class BackupAdmin(admin.ModelAdmin):

    list_display = [
        "name",
        "status_badge",
        "backup_size_display",
        "created_at",
        "restored_at",
        "actions_buttons",
    ]

    list_filter = [
        "status",
        "is_automatic",
    ]

    search_fields = [
        "name",
        "description",
    ]

    readonly_fields = [
        "backup_file",
        "backup_size",
        "status",
        "error_message",
        "created_at",
        "restored_at",
    ]

    fieldsets = (
        (
            "Backup Information",
            {
                "fields": (
                    "name",
                    "description",
                    "is_automatic",
                )
            },
        ),
        (
            "Backup File",
            {
                "fields": (
                    "backup_file",
                    "backup_size",
                )
            },
        ),
        (
            "Status",
            {
                "fields": (
                    "status",
                    "error_message",
                )
            },
        ),
        (
            "Timeline",
            {
                "fields": (
                    "created_at",
                    "restored_at",
                )
            },
        ),
    )

    # ---------------------------------------------------------
    # Custom Admin URLs
    # ---------------------------------------------------------

    def get_urls(self):
        urls = super().get_urls()

        custom_urls = [
            path(
                "create-backup/",
                self.admin_site.admin_view(
                    self.create_backup_view
                ),
                name="backup-create-backup",
            ),

            path(
                "<int:backup_id>/restore/",
                self.admin_site.admin_view(
                    self.restore_backup_view
                ),
                name="backup-restore-backup",
            ),

            path(
                "<int:backup_id>/download/",
                self.admin_site.admin_view(
                    self.download_backup_view
                ),
                name="backup-download-backup",
            ),
        ]

        return custom_urls + urls

    # ---------------------------------------------------------
    # Status
    # ---------------------------------------------------------

    @admin.display(description="Status")
    def status_badge(self, obj):

        colors = {
            Backup.BackupStatus.SUCCESS: "#4ade80",
            Backup.BackupStatus.FAILED: "#f87171",
            Backup.BackupStatus.PROCESSING: "#fbbf24",
        }

        color = colors.get(
            obj.status,
            "#6b7280"
        )

        return format_html(
            '<span style="'
            'background:{}20;'
            'color:{};'
            'padding:4px 10px;'
            'border-radius:12px;'
            'font-weight:600;'
            'font-size:12px;'
            '">'
            '{}</span>',
            color,
            color,
            obj.get_status_display(),
        )

    # ---------------------------------------------------------
    # Size
    # ---------------------------------------------------------

    @admin.display(description="Size")
    def backup_size_display(self, obj):
        return obj.get_human_size()

    # ---------------------------------------------------------
    # Action buttons
    # ---------------------------------------------------------

    @admin.display(description="Actions")
    def actions_buttons(self, obj):

        if (
            obj.status != Backup.BackupStatus.SUCCESS
            or not obj.backup_file
        ):
            return "-"

        download_url = (
            f"../{obj.pk}/download/"
        )

        restore_url = (
            f"../{obj.pk}/restore/"
        )

        return format_html(
            '<a href="{}" class="button" '
            'style="margin-right:5px;">'
            'Download'
            '</a>'

            '<a href="{}" class="button" '
            'style="background:#f59e0b;'
            'color:white;">'
            'Restore'
            '</a>',
            download_url,
            restore_url,
        )

    # ---------------------------------------------------------
    # Create backup
    # ---------------------------------------------------------

    def create_backup_view(self, request):

        if request.method == "POST":

            try:
                backup = Backup.create_backup()

                self.message_user(
                    request,
                    (
                        f'Backup "{backup.name}" '
                        f'created successfully '
                        f'({backup.get_human_size()}).'
                    ),
                    messages.SUCCESS,
                )

            except Exception as exc:

                self.message_user(
                    request,
                    f"Error creating backup: {exc}",
                    messages.ERROR,
                )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

        return TemplateResponse(
            request,
            "admin/resume_app/backup_create.html",
            {
                **self.admin_site.each_context(request),
                "title": "Create Backup",
                "opts": self.model._meta,
            },
        )

    # ---------------------------------------------------------
    # Restore backup
    # ---------------------------------------------------------

    def restore_backup_view(
        self,
        request,
        backup_id,
    ):

        backup = self.get_object(
            request,
            backup_id
        )

        if not backup:

            self.message_user(
                request,
                "Backup not found.",
                messages.ERROR,
            )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

        if (
            backup.status
            != Backup.BackupStatus.SUCCESS
        ):

            self.message_user(
                request,
                "This backup is not valid for restore.",
                messages.ERROR,
            )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

        if not backup.backup_file:

            self.message_user(
                request,
                "Backup file not found.",
                messages.ERROR,
            )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

        # GET = show confirmation page
        if request.method == "GET":

            return TemplateResponse(
                request,
                "admin/resume_app/backup_restore.html",
                {
                    **self.admin_site.each_context(request),
                    "title": "Restore Backup",
                    "backup": backup,
                    "opts": self.model._meta,
                },
            )

        # POST = actually restore
        if request.method == "POST":

            try:

                backup.restore_backup()

                self.message_user(
                    request,
                    (
                        f'Database successfully restored '
                        f'from "{backup.name}".'
                    ),
                    messages.SUCCESS,
                )

            except Exception as exc:

                self.message_user(
                    request,
                    f"Error restoring database: {exc}",
                    messages.ERROR,
                )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

    # ---------------------------------------------------------
    # Download backup
    # ---------------------------------------------------------

    def download_backup_view(
        self,
        request,
        backup_id,
    ):

        backup = self.get_object(
            request,
            backup_id
        )

        if (
            not backup
            or not backup.backup_file
        ):
            raise Http404(
                "Backup file not found."
            )

        response = FileResponse(
            backup.backup_file.open("rb"),
            content_type="application/x-sqlite3",
        )

        response["Content-Disposition"] = (
            f'attachment; '
            f'filename="{backup.backup_file.name}"'
        )

        return response

    # ---------------------------------------------------------
    # Permissions
    # ---------------------------------------------------------

    def has_delete_permission(
        self,
        request,
        obj=None,
    ):
        return False

    # ---------------------------------------------------------
    # Disable bulk delete
    # ---------------------------------------------------------

    def get_actions(self, request):

        actions = super().get_actions(request)

        actions.pop(
            "delete_selected",
            None
        )

        return actions

