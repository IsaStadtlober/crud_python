// Botões para abrir o modal
document.getElementById('btn-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);
document.getElementById('footer-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);

// Botão imprimir
document.getElementById('print-pdf')?.addEventListener('click', e => {
    e.preventDefault();
    window.print();
});

// Função para abrir o modal
function abrirModalCadastro(e) {
    e.preventDefault();
    const modalEl = document.getElementById('modalCadastrarUsuario');
    const myModal = new bootstrap.Modal(modalEl);
    myModal.show();

    // Máscara do CPF
    IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });
}

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

    // Se tudo estiver válido
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
                // Exibe os erros (você pode personalizar isso)
                alert("Erro ao cadastrar usuário.");
            } else {
                alert(data.message);

                // Fecha o modal com segurança
                const modalEl = document.getElementById('modalCadastrarUsuario');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) {
                    modalInstance.hide();

                    // Fallback: remove backdrop se continuar na tela
                    setTimeout(() => {
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) backdrop.remove();
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }, 500);
                }

                // Limpa o formulário
                document.getElementById('formCadastrarUsuario').reset();
            }
        });
    }
});

// Fallback extra: caso o backdrop não saia sozinho
document.getElementById('modalCadastrarUsuario')?.addEventListener('hidden.bs.modal', () => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
});
