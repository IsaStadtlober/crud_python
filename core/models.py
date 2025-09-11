from django.db import models

STATUS_CHOICES = [
    ('A', 'Ativo'),
    ('I', 'Inativo'),
]

class Funcionario(models.Model):
    matricula = models.IntegerField(primary_key=True)
    nome = models.CharField(max_length=100, default='')
    funcao = models.CharField(max_length=100, default='')
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='A')
    obra = models.CharField(max_length=150, default='')

    def __str__(self) -> str:
        return self.nome 