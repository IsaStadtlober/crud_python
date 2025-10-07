document.addEventListener('DOMContentLoaded', function () {
    const btnCadastrar = document.getElementById('footer-cadastrar-usuario');
    const btnPrint = document.getElementById('footer-print-pdf');

    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', function (e) {
            e.preventDefault();
            const modalEl = document.getElementById('modalCadastrarUsuario');
            const modal = new bootstrap.Modal(modalEl);
            modal.show();

            const cpfElement = document.getElementById('cpf');
            if (cpfElement) {
                IMask(cpfElement, { mask: '000.000.000-00' });
            }
        });
    }

    if (btnPrint) {
        btnPrint.addEventListener('click', function (e) {
            e.preventDefault();
            window.print();
        });
    }
});
