from django.db import models

STATUS_CHOICES = [
    ('AT', 'Ativo'),
    ('IN', 'Inativo'),
    ('FE', 'Férias'),
    ('LI', 'Licença'),
    ('AF', 'Afastado do INSS'),
    ('AV', 'Aviso'),
    ('AC', 'Admitido em casa'),
    ('FO', 'Folga'),
    ('EC', 'Em contratação')
]

class Funcionario(models.Model):
    matricula = models.IntegerField(primary_key=True)
    nome = models.CharField(max_length=100, default='')
    funcao = models.CharField( max_length=100, verbose_name="Função", default='')
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='A')
    obra = models.CharField(max_length=150, default='')
    foto = models.ImageField(upload_to='fotos_funcionarios/', blank=True, null=True)
    
    def __str__(self) -> str:
        return self.nome 