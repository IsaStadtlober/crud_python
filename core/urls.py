from django.urls import path 
from . import views

urlpatterns = [
    path('create/', views.CreateFuncionario.as_view(), name='create'),
    path('listar/', views.ListFuncionario.as_view(), name='Listar'),
    path('update/<int:matricula>/', views.update_funcionario, name='update'),
]