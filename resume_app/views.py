from django.shortcuts import render
from .models import (
    Profile, SocialMedia, Skill, Education, CareerGoal,
    Experience, Project, Language
)

def portfolio_view(request):
    profile = Profile.objects.first()
    
    context = {
        'profile': profile,
        'social_media_links': SocialMedia.objects.filter(profile=profile, is_active=True) if profile else [],
        'skills': Skill.objects.all(),
        'education_list': Education.objects.filter(is_active=True),
        'career_goal': CareerGoal.objects.first(),
        'experiences': Experience.objects.filter(is_active=True).prefetch_related('bullets'),
        'projects': Project.objects.filter(is_active=True).prefetch_related('tags'),
        'languages': Language.objects.all(),
    }
    return render(request, 'portfolio.html', context)