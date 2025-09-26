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
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse

class ListFuncionario(LoginRequiredMixin, ListView):
    login_url = 'login'  # <- usa o nome da rota definida no urls.py
    template_name = 'index.html'
    model = Funcionario
    context_object_name = 'funcionarios'
    
    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtro de busca
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(nome__icontains=search)

        # Filtro de quantidade
        quantidade = self.request.GET.get('quantidade')
        if quantidade and quantidade.isdigit():
            queryset = queryset[:int(quantidade)]

        return queryset

    def dispatch(self, request, *args, **kwargs):
        print(">>> ListFuncionario.dispatch — user:", request.user, "is_authenticated:", request.user.is_authenticated)
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        def calcula_idade(data_nascimento):
            if not data_nascimento:
                return None
            hoje = date.today()
            return hoje.year - data_nascimento.year - (
                (hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day)
            )

        funcionarios_com_idade = []
        for f in context['funcionarios']:
            idade = calcula_idade(f.data_nascimento)
            funcionarios_com_idade.append({'funcionario': f, 'idade': idade})

        context['funcionarios_com_idade'] = funcionarios_com_idade
        context['form'] = FuncionarioForm()
        
        context['search'] = self.request.GET.get('search', '')
        context['quantidade'] = self.request.GET.get('quantidade', '')
        return context

@login_required(login_url=reverse_lazy('login'))
def create_funcionario(request):
    if request.method == 'POST':
        form = FuncionarioForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Funcionário cadastrado com sucesso!', extra_tags='cadastro')
            return redirect('listar')  # Isso limpa o estado do POST
        else:
            funcionarios = Funcionario.objects.all()
            return render(request, 'index.html', {
                'form': form,
                'funcionarios': funcionarios,
                'funcionario': form.instance 
            })
    return redirect('listar')

@login_required(login_url=reverse_lazy('login'))
def update_funcionario(request, matricula):
    funcionario = get_object_or_404(Funcionario, matricula=matricula)

    if request.method == 'POST':
        form = FuncionarioForm(request.POST, request.FILES, instance=funcionario)
        if form.is_valid():
            form.save()
            return redirect('listar')
        else:
            funcionarios = Funcionario.objects.all()
            return render(request, 'index.html', {
                'form': form,
                'funcionarios': funcionarios,
                'funcionario': form.instance
            })

    return redirect('listar')

@login_required(login_url=reverse_lazy('login'))
def delete_funcionario(request, matricula):
    funcionario = get_object_or_404(Funcionario, matricula=matricula)
    funcionario.delete()
    messages.success(request, 'Funcionário deletado com sucesso!')
    return redirect('listar')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('listar')  # Redireciona para /index/
        else:
            messages.error(request, 'Usuário ou senha inválidos')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

def lista_funcionarios(request):
    funcionarios = Funcionario.objects.all()

    # Aplica o filtro da busca (se houver)
    search = request.GET.get('search')
    if search:
        funcionarios = funcionarios.filter(nome__icontains=search)

    # Aplica o filtro de quantidade independentemente da busca
    quantidade = request.GET.get('quantidade')
    if quantidade and quantidade.isdigit():
        funcionarios = funcionarios[:int(quantidade)]

    return render(request, 'index.html', {
        'funcionarios': funcionarios
    })
    
def lista_funcionarios(request):
    funcionarios = Funcionario.objects.all()

    quantidade = request.GET.get('quantidade')
    print(f"Quantidade recebida: {quantidade}")  # DEBUG