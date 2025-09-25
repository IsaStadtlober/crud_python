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

NIVEL_FUNCAO_CHOICES = [
        (1, 'Nível 1'),
        (2, 'Nível 2'),
        (3, 'Nível 3'),
        (4, 'Nível 4'),
        (5, 'Nível 5'),
    ]

class Funcionario(models.Model):
    matricula = models.CharField(max_length=100, default='', primary_key=True)
    nome = models.CharField(max_length=100, default='')
    funcao = models.CharField( max_length=100, verbose_name="Função", default='')
    nivel_funcao = models.IntegerField(choices=NIVEL_FUNCAO_CHOICES, default=1)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='A')
    obra = models.CharField(max_length=150, default='')
    foto = models.ImageField(upload_to='fotos_funcionarios/', blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    data_admissao = models.DateField(null=True, blank=True)
    cep = models.CharField(max_length=9, blank=True, null=True)
    logradouro = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=100, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    uf = models.CharField(max_length=2, blank=True, null=True)
    ordem_servico = models.FileField(upload_to='ordens_servico/', blank=True, null=True)
    contrato_trabalho = models.FileField(upload_to='contratos_trabalho/', blank=True, null=True)
    
    def __str__(self) -> str: 
        return self.nome 