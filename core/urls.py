from django.urls import path 
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),               # <-- aqui a raiz é login
    path('create/', views.create_funcionario, name='create'),
    path('listar/', views.ListFuncionario.as_view(), name='listar'),
    path('update/<int:matricula>/', views.update_funcionario, name='update'),
    path('delete/<str:matricula>/', views.delete_funcionario, name='delete'),
    path('logout/', views.logout_view, name='logout'),
    path('teste-acesso/', views.teste_acesso, name='teste_acesso'),
]