document.addEventListener('DOMContentLoaded', function () {
    const cpfInput = document.getElementById('id_cpf');
    if (cpfInput) {
        IMask(cpfInput, { mask: '000.000.000-00' });
    }

    const cepInput = document.getElementById('id_cep');
    if (cepInput) {
        IMask(cepInput, { mask: '00000-000' });
    }

    // formatação visual de CPFs exibidos em lista
    document.querySelectorAll('[data-format-cpf]').forEach(el => {
        let raw = el.textContent.replace(/\D/g, '');
        if (raw.length === 11) {
            el.textContent = raw.slice(0, 3) + '.' + raw.slice(3, 6) + '.' + raw.slice(6, 9) + '-' + raw.slice(9);
        }
    });
});
