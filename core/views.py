from django.shortcuts import render
from django.views.generic import ListView, CreateView
from .models import Funcionario
from .forms import FuncionarioForm
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect


class ListFuncionario(ListView):
    template_name = 'index.html'
    model = Funcionario
    context_object_name = 'funcionarios'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = FuncionarioForm()  # envia o formulário para o template
        return context

class CreateFuncionario(CreateView):
    form_class = FuncionarioForm
    template_name = 'form.html'  # não será usado
    success_url = reverse_lazy('Listar')

def update_funcionario(request, matricula):
    funcionario = get_object_or_404(Funcionario, matricula=matricula)
    if request.method == 'POST':
        # Atualiza usando o form do Django
        form = FuncionarioForm(request.POST, instance=funcionario)
        if form.is_valid():
            form.save()
            return redirect('Listar')
    else:
        # Se for GET, instancia o form com os dados do funcionário
        form = FuncionarioForm(instance=funcionario)

    # Como estamos usando modal na mesma página, apenas redireciona
    return redirect('Listar')