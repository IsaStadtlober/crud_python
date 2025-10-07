// ------------------------------
// Função: Modo Create
// ------------------------------
function setCreateMode() {
    document.getElementById("funcionarioModalLabel").innerText = "Cadastrar Funcionário";
    document.getElementById("funcionarioForm").action = "/create/";

    const campos = [
        'id_matricula', 'id_data_nascimento', 'id_nome', 'id_cpf',
        'id_funcao', 'id_status', 'id_obra', 'id_nivel_funcao', 'id_data_admissao',
        'id_cep', 'id_logradouro', 'id_bairro', 'id_cidade', 'id_uf',
        'id_numero', 'id_complemento'
    ];

    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    document.getElementById('id_matricula').readOnly = false;

    // Limpa erros e feedbacks
    document.querySelectorAll('#funcionarioForm .is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });

    document.querySelectorAll('#funcionarioForm .invalid-feedback').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('d-block');
    });

    // Reset arquivos e ícones
    const fileFields = [
        { id: 'id_foto', previewReset: true },
        { id: 'id_ordem_servico', iconId: 'icon-ordem-servico' },
        { id: 'id_contrato_trabalho', iconId: 'icon-contrato-trabalho' }
    ];

    fileFields.forEach(field => {
        const oldInput = document.getElementById(field.id);
        if (oldInput) {
            const newInput = oldInput.cloneNode(true);
            oldInput.parentNode.replaceChild(newInput, oldInput);

            if (field.previewReset) {
                const preview = document.getElementById('preview-foto');
                if (preview) {
                    preview.src = '';
                    preview.style.display = 'none';
                }
            }

            if (field.iconId) {
                const icon = document.getElementById(field.iconId);
                if (icon) {
                    icon.src = "/static/img/box_aberto.png";
                    icon.alt = "Baú aberto";
                    icon.classList.remove('icon-animate');
                }
            }
        }
    });

    setupFotoPreview();
    setupIconAnimation('id_ordem_servico', 'icon-ordem-servico');
    setupIconAnimation('id_contrato_trabalho', 'icon-contrato-trabalho');
}

// ------------------------------
// Função: Modo Update
// ------------------------------
function setUpdateMode(
    matricula, data_nascimento, nome, cpf, funcao, nivel_funcao,
    status, obra, data_admissao,
    cep, logradouro, bairro, cidade, uf, numero, complemento,
    fotoUrl, ordemServicoExiste, contratoTrabalhoExiste
) {
    function cleanValue(value) {
        return (!value || value === "None") ? '' : value;
    }

    document.getElementById("funcionarioModalLabel").innerText = "Editar Funcionário";
    document.getElementById("funcionarioForm").action = "/update/" + matricula + "/";

    document.getElementById('id_matricula').value = matricula;
    document.getElementById('id_data_nascimento').value = data_nascimento;
    document.getElementById('id_nome').value = nome;
    document.getElementById('id_cpf').value = formatCPF(cpf);
    document.getElementById('id_funcao').value = funcao;
    document.getElementById('id_status').value = status;
    document.getElementById('id_obra').value = obra;
    document.getElementById('id_nivel_funcao').value = nivel_funcao;
    document.getElementById('id_data_admissao').value = data_admissao;

    // Endereço
    document.getElementById('id_cep').value = cleanValue(cep);
    document.getElementById('id_logradouro').value = cleanValue(logradouro);
    document.getElementById('id_bairro').value = cleanValue(bairro);
    document.getElementById('id_cidade').value = cleanValue(cidade);
    document.getElementById('id_uf').value = cleanValue(uf);
    document.getElementById('id_numero').value = cleanValue(numero);
    document.getElementById('id_complemento').value = cleanValue(complemento);

    document.getElementById('id_matricula').readOnly = true;

    // Preview da foto
    const preview = document.getElementById('preview-foto');
    if (fotoUrl && fotoUrl.trim() !== '') {
        preview.src = fotoUrl;
        preview.style.display = 'inline-block';
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }

    // Reset dos campos de arquivo
    ['id_foto', 'id_ordem_servico', 'id_contrato_trabalho'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
        }
    });

    // Ícones
    const iconOrdem = document.getElementById('icon-ordem-servico');
    if (iconOrdem) {
        iconOrdem.src = ordemServicoExiste ? "/static/img/box_fechado.png" : "/static/img/box_aberto.png";
        iconOrdem.alt = ordemServicoExiste ? "Baú fechado" : "Baú aberto";
        iconOrdem.classList.remove('icon-animate');
    }

    const iconContrato = document.getElementById('icon-contrato-trabalho');
    if (iconContrato) {
        iconContrato.src = contratoTrabalhoExiste ? "/static/img/box_fechado.png" : "/static/img/box_aberto.png";
        iconContrato.alt = contratoTrabalhoExiste ? "Baú fechado" : "Baú aberto";
        iconContrato.classList.remove('icon-animate');
    }

    setupFotoPreview();
    setupIconAnimation('id_ordem_servico', 'icon-ordem-servico');
    setupIconAnimation('id_contrato_trabalho', 'icon-contrato-trabalho');
}

// ------------------------------
// Função auxiliar para formatar CPF
// ------------------------------
function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return cpf;
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
}

// ------------------------------
// Chamado pelo botão de editar
// ------------------------------
function handleEditClick(button) {
    const data = button.dataset;

    setUpdateMode(
        data.matricula,
        data.dataNascimento,
        data.nome,
        data.cpf,
        data.funcao,
        data.nivel_funcao,
        data.status,
        data.obra,
        data.data_admissao,
        data.cep,
        data.logradouro,
        data.bairro,
        data.cidade,
        data.uf,
        data.numero,
        data.complemento,
        data.fotoUrl,
        data.ordemServicoExiste === 'true',
        data.contratoTrabalhoExiste === 'true'
    );
}

// ------------------------------
// Reabre o modal se houver erros do Django (form.errors)
// ------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const formComErro = document.getElementById('funcionarioForm');
    if (formComErro && formComErro.classList.contains('form-with-errors')) {
        const modalEl = document.getElementById('funcionarioModal');
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    }
});
