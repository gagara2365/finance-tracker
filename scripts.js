document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    function showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
            section.classList.toggle('hidden', section.id !== sectionId);
        });
    }

    function updateSavings() {
        const inputAmount = parseFloat(document.getElementById('amount-input').value) || 0;
        totalSavings += inputAmount;
        document.getElementById('amount-input').value = '';
        updateProgressBars();
    }

    function updateProgressBars() {
        const wishProgressPercent = totalWishesAmount ? (totalSavings / totalWishesAmount) * 100 : 0;
        animateProgress(document.querySelector('#wish-progress .progress'), wishProgressPercent);
        animateProgress(document.querySelector('#savings-progress .progress'), wishProgressPercent);
    }

    function animateProgress(element, targetWidth) {
        const currentWidth = parseFloat(element.style.width) || 0;
        if (currentWidth < targetWidth) {
            element.style.width = `${currentWidth + 0.5}%`;
            requestAnimationFrame(() => animateProgress(element, targetWidth));
        }
    }

    showSection('finance'); // Показать финансовый трекер по умолчанию
});
