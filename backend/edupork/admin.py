from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Course, Lecture, Flashcard, Note, Test

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Course)
admin.site.register(Lecture)
admin.site.register(Flashcard)
admin.site.register(Note)
admin.site.register(Test)
