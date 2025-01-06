document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.tab-content');
    const navLinks = document.querySelectorAll('nav a');

    const showPage = (pageId) => {
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.tab;
            showPage(pageId);
            if (pageId === 'tasks') {
                updateProgressBars();  // Обновляем прогресс при переключении на страницу Финансы
            }
        });
    });

    showPage('tasks'); // Показываем финансы по умолчанию

    // Остальные функции из предыдущего описания
});
