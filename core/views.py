from django.shortcuts import render, redirect
from django.views.generic import ListView, CreateView
from .models import Funcionario
from .forms import FuncionarioForm
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from datetime import date
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

class ListFuncionario(ListView):
    template_name = 'index.html'
    model = Funcionario
    context_object_name = 'funcionarios'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        def calcula_idade(data_nascimento):
            if not data_nascimento:
                return None
            hoje = date.today()
            return hoje.year - data_nascimento.year - ((hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day))

        # Calcula idade para cada funcionário
        funcionarios_com_idade = []
        for f in context['funcionarios']:
            idade = calcula_idade(f.data_nascimento)
            funcionarios_com_idade.append({
                'funcionario': f,
                'idade': idade,
            })

        context['funcionarios_com_idade'] = funcionarios_com_idade
        
        # Só adiciona o form se não estiver vindo de um erro (i.e., via render com form com erros)
        if 'form' not in context:
            context['form'] = FuncionarioForm()
        
        return context

def create_funcionario(request):
    if request.method == 'POST':
        form = FuncionarioForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Funcionário cadastrado com sucesso!', extra_tags='cadastro')
            return redirect('Listar')  # Isso limpa o estado do POST
        else:
            funcionarios = Funcionario.objects.all()
            return render(request, 'index.html', {
                'form': form,
                'funcionarios': funcionarios,
                'funcionario': form.instance 
            })
    return redirect('Listar')

def update_funcionario(request, matricula):
    funcionario = get_object_or_404(Funcionario, matricula=matricula)

    if request.method == 'POST':
        form = FuncionarioForm(request.POST, request.FILES, instance=funcionario)
        if form.is_valid():
            form.save()
            return redirect('Listar')
        else:
            funcionarios = Funcionario.objects.all()
            return render(request, 'index.html', {
                'form': form,
                'funcionarios': funcionarios,
                'funcionario': form.instance
            })

    return redirect('Listar')

def delete_funcionario(request, matricula):
    funcionario = get_object_or_404(Funcionario, matricula=matricula)
    funcionario.delete()
    messages.success(request, 'Funcionário deletado com sucesso!')
    return redirect('Listar')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('index')  # Redireciona para /index/
        else:
            messages.error(request, 'Usuário ou senha inválidos')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')