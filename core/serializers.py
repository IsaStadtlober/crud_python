from rest_framework import serializers
from .models import Usuario  # ou o nome correto do seu model usuário

class UsuarioSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['cpf', 'username', 'senha']

    def create(self, validated_data):
        senha = validated_data.pop('senha')
        usuario = Usuario(**validated_data)
        usuario.set_senha(senha)
        usuario.save()
        return usuario