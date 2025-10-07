// Função para abrir o modal
function abrirModalCadastro(e) {
    e.preventDefault();

    const modalEl = document.getElementById('modalCadastrarUsuario');
    const myModal = new bootstrap.Modal(modalEl, {
        backdrop: true,
        keyboard: true
    });

    myModal.show();

    // Máscara do CPF
    IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });

    // Armazena a instância para uso posterior
    window.modalUsuarioInstance = myModal;
}

// Botões que abrem o modal
document.getElementById('btn-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);
document.getElementById('footer-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);

// Fecha modal e garante remoção da sombra
document.getElementById('modalCadastrarUsuario')?.addEventListener('hidden.bs.modal', () => {
    // Remove manualmente qualquer backdrop que persistir
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});

// Submissão do formulário
document.getElementById('formCadastrarUsuario')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const cpfInput = document.getElementById('cpf');
    const userInput = document.getElementById('username');
    const senhaInput = document.getElementById('senha');
    const confirmaInput = document.getElementById('confirmaSenha');

    let valid = true;

    // Validações
    if (!validarCPF(cpfInput.value)) {
        cpfInput.classList.add('is-invalid');
        valid = false;
    } else {
        cpfInput.classList.remove('is-invalid');
    }

    if (!userInput.value.trim()) {
        userInput.classList.add('is-invalid');
        valid = false;
    } else {
        userInput.classList.remove('is-invalid');
    }

    if (!senhaInput.value.trim()) {
        senhaInput.classList.add('is-invalid');
        valid = false;
    } else {
        senhaInput.classList.remove('is-invalid');
    }

    if (confirmaInput.value !== senhaInput.value || !confirmaInput.value.trim()) {
        confirmaInput.classList.add('is-invalid');
        valid = false;
    } else {
        confirmaInput.classList.remove('is-invalid');
    }

    if (valid) {
        fetch('/cadastrar-usuario/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                cpf: cpfInput.value,
                username: userInput.value,
                senha: senhaInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                alert("Erro ao cadastrar usuário.");
            } else {
                alert(data.message);

                // Fecha o modal usando instância salva
                if (window.modalUsuarioInstance) {
                    window.modalUsuarioInstance.hide();
                }

                // Limpa o formulário
                document.getElementById('formCadastrarUsuario').reset();
            }
        });
    }
});

