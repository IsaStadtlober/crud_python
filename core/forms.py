from django import forms
from core.models import Funcionario
import re

class FuncionarioForm(forms.ModelForm):
    class Meta:
        model = Funcionario
        fields = '__all__'

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

        cpf = cpf.replace('.', '').replace('-', '').strip()

        # Aqui você pode continuar sua validação, por exemplo:
        if len(cpf) != 11 or not cpf.isdigit():
            raise forms.ValidationError('CPF inválido.')

        # Pode adicionar a validação dos dígitos verificadores aqui

        return cpf
