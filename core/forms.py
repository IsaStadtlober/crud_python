from django import forms
from core.models import Funcionario
import re
from datetime import date

class FuncionarioForm(forms.ModelForm):
    class Meta:
        model = Funcionario
        fields = '__all__'
        widgets = {
            'foto': forms.FileInput(attrs={'class': 'form-control'}),
            'nivel_funcao': forms.Select(attrs={'class': 'form-select'}),  # para <select>, geralmente usa 'form-select'
            'cep': forms.TextInput(attrs={'id': 'id_cep', 'class': 'form-control'}),
            'logradouro': forms.TextInput(attrs={'id': 'id_logradouro', 'class': 'form-control'}),
            'bairro': forms.TextInput(attrs={'id': 'id_bairro', 'class': 'form-control'}),
            'cidade': forms.TextInput(attrs={'id': 'id_cidade', 'class': 'form-control'}),
            'uf': forms.TextInput(attrs={'id': 'id_uf', 'class': 'form-control'}),
            'data_admissao': forms.DateInput(attrs={'type': 'date', 'class': 'form-control', 'id': 'id_data_admissao'}),
            'ordem_servico': forms.FileInput(attrs={'class': 'form-control'}),
            'contrato_trabalho': forms.FileInput(attrs={'class': 'form-control'}),
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_name, field in self.fields.items():
            # Começa com form-control
            css_class = 'form-control'

            # Se o campo tem erro, adiciona 'is-invalid'
            if self.errors.get(field_name):
                css_class += ' is-invalid'

            # Aplica no widget
            field.widget.attrs.update({'class': css_class})

    def clean_matricula(self):
        matricula = self.cleaned_data.get('matricula')
        qs = Funcionario.objects.filter(matricula=matricula)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("Esta matrícula já está cadastrada.")
        return matricula
    
    def clean_cpf(self):
        cpf = self.cleaned_data.get('cpf')

        if not cpf:
            raise forms.ValidationError('Campo CPF é obrigatório.')

        # Remove caracteres não numéricos
        cpf = re.sub(r'\D', '', cpf)

        if len(cpf) != 11:
            raise forms.ValidationError('CPF deve conter exatamente 11 dígitos numéricos.')

        if cpf == cpf[0] * 11:
            raise forms.ValidationError('CPF inválido (todos os dígitos são iguais)')

        # Validação do 1º dígito verificador
        soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
        digito1 = (soma * 10 % 11) % 10
        if int(cpf[9]) != digito1:
            raise forms.ValidationError('CPF inválido')

        # Validação do 2º dígito verificador
        soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
        digito2 = (soma * 10 % 11) % 10
        if int(cpf[10]) != digito2:
            raise forms.ValidationError('CPF inválido')

        # Verifica se já existe esse CPF no banco (caso de novo cadastro)
        qs = Funcionario.objects.filter(cpf=cpf)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError('Este CPF já está cadastrado.')

        return cpf  # ✅ CPF limpo e válido

    def clean_data_admissao(self):
        data = self.cleaned_data.get('data_admissao')
        hoje = date.today()
        cem_anos_atras = date(hoje.year - 100, hoje.month, hoje.day)

        if not data:
            raise forms.ValidationError('Data de admissão é obrigatória.')

        if data < cem_anos_atras or data > hoje:
            raise forms.ValidationError(
                f'Data deve estar entre {cem_anos_atras.strftime("%d/%m/%Y")} e {hoje.strftime("%d/%m/%Y")}.'
            )
        return data