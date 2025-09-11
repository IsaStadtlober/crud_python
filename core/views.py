from django.shortcuts import render
from django.views.generic import ListView, CreateView
from .models import Funcionario
from .forms import FuncionarioForm
from django.urls import reverse_lazy

class ListFuncionario(ListView):
    template_name = 'index.html'
    model = Funcionario
    context_object_name = 'funcionarios'

class CreateFuncionario(CreateView):
    form_class = FuncionarioForm
    template_name = 'form.html'
    success_url = reverse_lazy('Listar')