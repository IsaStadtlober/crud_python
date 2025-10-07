document.getElementById('searchInput')?.addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
        const texts = Array.from(row.cells).map(cell => cell.textContent.toLowerCase());
        const visible = texts.some(text => text.includes(filter));
        row.style.display = visible ? '' : 'none';
    });
});
