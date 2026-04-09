from django.shortcuts import render

def home(request):
    context = {
        "message": "Hola a todos"
    }

    return render(request, 'index.html', context)