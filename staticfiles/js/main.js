document.addEventListener('DOMContentLoaded', function () {
    console.log('Main JS carregado');
    setupFotoPreview();
    setupIconAnimation('id_ordem_servico', 'icon-ordem-servico');
    setupIconAnimation('id_contrato_trabalho', 'icon-contrato-trabalho');
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[id^='btnDownload']").forEach(function (button) {
        button.addEventListener("click", function () {
            const matricula = this.id.replace("btnDownload", "");
            const content = document.querySelector(`#viewModal${matricula} .modal-body`);

            if (!content) return;

            // Clonar o conteúdo para remover botões e preparar para exportação
            const clone = content.cloneNode(true);

            // Remove botões com a classe .no-print do clone
            clone.querySelectorAll('.no-print').forEach(el => el.remove());

            const opt = {
                margin: 10,
                filename: `funcionario_${matricula}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(clone).save();
        });
    });
});
