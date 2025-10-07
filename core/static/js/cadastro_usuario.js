// Botões para abrir o modal
document.getElementById('btn-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);
document.getElementById('footer-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);

// Botão imprimir
document.getElementById('print-pdf')?.addEventListener('click', e => {
    e.preventDefault();
    window.print();
});

// Função para preparar o modal de cadastro de usuário
function setUserCreateMode() {
    const form = document.getElementById('formCadastrarUsuario');
    form.reset();

    const campos = ['cpf', 'username', 'senha', 'confirmaSenha'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('is-invalid');
    });

    // Reaplica máscara no CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        IMask(cpfInput, { mask: '000.000.000-00' });
    }

    // Remove backdrop manualmente (garantia extra)
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Abre o modal e aplica o modo de criação
function abrirModalCadastro(e) {
    e.preventDefault();

    setUserCreateMode();

    const modalEl = document.getElementById('modalCadastrarUsuario');
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.show();
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
                    alert("Erro ao cadastrar usuário.");
                } else {
                    alert(data.message);

                    // Fecha o modal com segurança
                    const modalEl = document.getElementById('modalCadastrarUsuario');
                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                    if (modalInstance) {
                        modalInstance.hide();
                    }

                    // Remove backdrop manualmente (extra segurança)
                    setTimeout(() => {
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) backdrop.remove();
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }, 500);

                    // Limpa o formulário
                    document.getElementById('formCadastrarUsuario').reset();
                }
            });
    }
});

// Garante que o backdrop seja removido quando o modal for fechado
document.getElementById('modalCadastrarUsuario')?.addEventListener('hidden.bs.modal', () => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});

// Variável global para controlar a instância do modal
let modalUsuarioInstance = null;

// Evento para abrir o modal com CPF mascarado
function abrirModalCadastro(e) {
    e?.preventDefault();

    const modalEl = document.getElementById('modalCadastrarUsuario');

    // Se ainda não foi instanciado, cria
    if (!modalUsuarioInstance) {
        modalUsuarioInstance = new bootstrap.Modal(modalEl);

        // Garante limpeza da sombra ao fechar
        modalEl.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }

    // Remove sombras antigas, se existirem
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

    // Abre o modal
    modalUsuarioInstance.show();

    // Máscara CPF
    IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });
}

// Eventos para botões (desktop e mobile)
document.getElementById('btn-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);
document.getElementById('footer-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);

// Submissão do formulário de cadastro
document.getElementById('formCadastrarUsuario')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const cpfInput = document.getElementById('cpf');
    const userInput = document.getElementById('username');
    const senhaInput = document.getElementById('senha');
    const confirmaInput = document.getElementById('confirmaSenha');

    let valid = true;

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

                    // Fecha o modal com segurança
                    if (modalUsuarioInstance) {
                        modalUsuarioInstance.hide();
                    }

                    // Limpa o formulário
                    document.getElementById('formCadastrarUsuario').reset();
                }
            });
    }
});
