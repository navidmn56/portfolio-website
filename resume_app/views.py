from django.shortcuts import render
from .models import (
    Profile, Skill, Education, CareerGoal,
    Experience, Project, Language
)

def portfolio_view(request):
    context = {
        'profile': Profile.objects.first(),
        'skills': Skill.objects.all(),
        'education_list': Education.objects.filter(is_active=True),
        'career_goal': CareerGoal.objects.first(),
        'experiences': Experience.objects.filter(is_active=True).prefetch_related('bullets'),
        'projects': Project.objects.filter(is_active=True).prefetch_related('tags'),
        'languages': Language.objects.all(),
    }
    return render(request, 'portfolio.html', context)