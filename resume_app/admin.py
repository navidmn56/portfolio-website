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
        label="Description",
        widget=forms.Textarea(
            attrs={
                "rows": 4,
                "placeholder": "Optional backup description..."
            }
        )
    )


@admin.register(Backup)
class BackupAdmin(admin.ModelAdmin):
    change_list_template = "admin/resume_app/change_list.html"

    list_display = (
        "name",
        "status_badge",
        "get_human_size_display",
        "created_at",
        "restored_at",
        "actions_buttons",
    )

    list_filter = (
        "status",
        "is_automatic",
    )

    search_fields = (
        "name",
        "description",
    )

    readonly_fields = (
        "backup_file",
        "backup_size",
        "get_human_size",
        "status",
        "error_message",
        "created_at",
        "restored_at",
    )

    fieldsets = (
        (
            "Backup Information",
            {
                "fields": (
                    "name",
                    "description",
                )
            },
        ),
        (
            "Statistics",
            {
                "fields": (
                    "backup_size",
                    "get_human_size",
                )
            },
        ),
        (
            "File",
            {
                "fields": (
                    "backup_file",
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
        (
            "Automation",
            {
                "fields": (
                    "is_automatic",
                )
            },
        ),
    )

    # ---------------------------------------------------------
    # IMPORTANT
    # Disable Django's normal "Add Backup" page.
    # ---------------------------------------------------------

    def has_add_permission(self, request):
        return False

    # Backup deletion from normal admin is disabled.
    def has_delete_permission(self, request, obj=None):
        return False

    # ---------------------------------------------------------
    # Custom URLs
    # ---------------------------------------------------------

    def get_urls(self):

        urls = super().get_urls()

        custom_urls = [
            path(
                "create-backup/",
                self.admin_site.admin_view(
                    self.create_backup_view
                ),
                name="backup-create",
            ),

            path(
                "<int:backup_id>/restore/",
                self.admin_site.admin_view(
                    self.restore_backup_view
                ),
                name="backup-restore",
            ),

            path(
                "<int:backup_id>/download/",
                self.admin_site.admin_view(
                    self.download_backup_view
                ),
                name="backup-download",
            ),
        ]

        return custom_urls + urls

    # ---------------------------------------------------------
    # Status
    # ---------------------------------------------------------

    @admin.display(
        description="Status"
    )
    def status_badge(self, obj):

        colors = {
            Backup.BackupStatus.SUCCESS: "#22c55e",
            Backup.BackupStatus.FAILED: "#ef4444",
            Backup.BackupStatus.PROCESSING: "#f59e0b",
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
            'border-radius:8px;'
            'font-weight:600;'
            '">'
            '{}'
            '</span>',
            color,
            color,
            obj.get_status_display(),
        )

    # ---------------------------------------------------------
    # Size
    # ---------------------------------------------------------

    @admin.display(
        description="Size"
    )
    def get_human_size_display(self, obj):
        return obj.get_human_size()

    # ---------------------------------------------------------
    # Actions
    # ---------------------------------------------------------

    @admin.display(
        description="Actions"
    )
    def actions_buttons(self, obj):

        buttons = []

        if (
            obj.status
            == Backup.BackupStatus.SUCCESS
            and obj.backup_file
        ):

            buttons.append(
                format_html(
                    '<a href="../{}/download/" '
                    'class="button">'
                    'Download'
                    '</a>',
                    obj.id,
                )
            )

            buttons.append(
                format_html(
                    '<a href="../{}/restore/" '
                    'class="button" '
                    'style="margin-left:5px;">'
                    'Restore'
                    '</a>',
                    obj.id,
                )
            )

        return format_html(
            "{}",
            " ".join(buttons)
        )

    # ---------------------------------------------------------
    # Create Backup
    # ---------------------------------------------------------

    def create_backup_view(self, request):

        if request.method == "POST":

            form = BackupForm(
                request.POST
            )

            if form.is_valid():

                try:

                    backup = Backup.create_backup(
                        description=form.cleaned_data[
                            "description"
                        ],
                        is_automatic=False,
                    )

                    self.message_user(
                        request,
                        (
                            f'Backup "{backup.name}" '
                            f'created successfully. '
                            f'({backup.get_human_size()})'
                        ),
                        messages.SUCCESS,
                    )

                except Exception as exc:

                    self.message_user(
                        request,
                        f"Backup failed: {exc}",
                        messages.ERROR,
                    )

                return redirect(
                    "admin:resume_app_backup_changelist"
                )

        else:
            form = BackupForm()

        context = {
            **self.admin_site.each_context(request),
            "title": "Create SQLite Backup",
            "form": form,
            "opts": self.model._meta,
        }

        return render(
            request,
            "admin/resume_app/backup_create.html",
            context,
        )

    # ---------------------------------------------------------
    # Restore
    # ---------------------------------------------------------

    def restore_backup_view(
        self,
        request,
        backup_id,
    ):

        backup = self.get_object(
            request,
            backup_id,
        )

        if not backup:
            raise Http404(
                "Backup not found."
            )

        if (
            backup.status
            != Backup.BackupStatus.SUCCESS
        ):
            self.message_user(
                request,
                "This backup cannot be restored.",
                messages.ERROR,
            )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

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
                    f"Restore failed: {exc}",
                    messages.ERROR,
                )

            return redirect(
                "admin:resume_app_backup_changelist"
            )

        context = {
            **self.admin_site.each_context(request),
            "title": "Restore SQLite Backup",
            "backup": backup,
            "opts": self.model._meta,
        }

        return render(
            request,
            "admin/resume_app/backup_restore.html",
            context,
        )

    # ---------------------------------------------------------
    # Download
    # ---------------------------------------------------------

    def download_backup_view(
        self,
        request,
        backup_id,
    ):

        backup = self.get_object(
            request,
            backup_id,
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

        response[
            "Content-Disposition"
        ] = (
            f'attachment; '
            f'filename="{backup.backup_file.name}"'
        )

        return response

    # ---------------------------------------------------------
    # Add Create Backup button to changelist
    # ---------------------------------------------------------

    def changelist_view(
        self,
        request,
        extra_context=None,
    ):

        extra_context = extra_context or {}

        extra_context[
            "create_backup_url"
        ] = "create-backup/"

        return super().changelist_view(
            request,
            extra_context=extra_context,
        )