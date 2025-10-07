function setupFotoPreview() {
    const inputFoto = document.getElementById('id_foto');
    const preview = document.getElementById('preview-foto');

    if (inputFoto && preview) {
        inputFoto.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function setupIconAnimation(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input && icon) {
        input.addEventListener('change', function () {
            icon.src = input.files.length > 0
                ? "/static/img/box_fechado.png"
                : "/static/img/box_aberto.png";

            icon.classList.remove('icon-animate');
            void icon.offsetWidth;
            icon.classList.add('icon-animate');
        });
    }
}
