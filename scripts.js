document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.tab-content');
    const navLinks = document.querySelectorAll('nav a');
    const taskList = document.getElementById('task-list');
    const totalTasks = () => Array.from(document.querySelectorAll('.task')).reduce((sum, task) => sum + parseFloat(task.textContent.split(' — ')[1]), 0);
    const goalAmount = 100000; // Предположим, что это ваша целевая сумма

    const showPage = (pageId) => {
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        });
    };

    const updateProgressBars = () => {
        const currentProgress = (totalTasks() / goalAmount) * 100;
        const goalProgress = ((goalAmount - totalTasks()) / goalAmount) * 100;
        document.getElementById('current-progress').style.width = `${currentProgress}%`;
        document.getElementById('current-progress').textContent = `${currentProgress.toFixed(1)}%`;
        document.getElementById('goal-progress').style.width = `${goalProgress}%`;
        document.getElementById('goal-progress').textContent = `${goalProgress.toFixed(1)}%`;
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.tab;
            showPage(pageId);
            if (pageId === 'tasks') {
                updateProgressBars();
            }
        });
    });

    const addWish = () => {
        const name = document.getElementById('wish-name').value.trim();
        const desc = document.getElementById('wish-desc').value.trim();
        const link = document.getElementById('wish-link').value.trim();
        const amount = parseFloat(document.getElementById('wish-amount').value) || 0;
        if (name && desc && link) {
            const wish = document.createElement('div');
            wish.className = 'wishlist-item';
            wish.dataset.amount = amount;
            wish.innerHTML = `
                <h4>${name}</h4>
                <p>${desc}</p>
                <a href="${link}" target="_blank">Посмотреть</a>
                <p>Сумма: ${amount} ₽</p>
            `;
            document.getElementById('wishlist-items').appendChild(wish);
            // Переносим данные в список задач на странице Финансы
            const task = document.createElement('div');
            task.className = 'task';
            task.innerHTML = `<p>${name} — ${amount} ₽</p>`;
            taskList.appendChild(task);
            updateProgressBars(); // Обновляем прогресс
        }
    };
    document.getElementById('add-wish-btn').addEventListener('click', addWish);

    const addMoodEntry = () => {
        const moodValue = document.querySelector('input[name="mood"]:checked')?.value;
        const comment = document.getElementById('mood-comment').value.trim();
        const dateTime = new Date().toLocaleString(); // Фиксируем дату и время
        if (moodValue) {
            const moodEntry = document.createElement('div');
            moodEntry.className = 'mood-entry';
            moodEntry.innerHTML = `
                <p>Настроение: ${moodValue}</p>
                <p>${comment}</p>
                <small>${dateTime}</small>
            `;
            document.getElementById('mood-entries').appendChild(moodEntry);
        }
    };
    document.getElementById('add-mood-btn').addEventListener('click', addMoodEntry);

    showPage('tasks'); // Показываем финансы по умолчанию
});
