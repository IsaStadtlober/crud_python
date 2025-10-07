document.getElementById('btn-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);
document.getElementById('footer-cadastrar-usuario')?.addEventListener('click', abrirModalCadastro);
document.getElementById('footer-print-pdf')?.addEventListener('click', e => {
    e.preventDefault();
    window.print();
});

function abrirModalCadastro(e) {
    e.preventDefault();
    var myModal = new bootstrap.Modal(document.getElementById('modalCadastrarUsuario'));
    myModal.show();
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
                    // trata erros
                } else {
                    alert(data.message);
                    bootstrap.Modal.getInstance(document.getElementById('modalCadastrarUsuario')).hide();
                    document.getElementById('formCadastrarUsuario').reset();
                }
            });
    }
});