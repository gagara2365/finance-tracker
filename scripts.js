document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('nav a');

    const showPage = (pageId) => {
        pages.forEach(page => page.classList.toggle('hidden', page.id !== pageId));
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            showPage(pageId);
            if (pageId === 'tasks') {
                updateProgressBars();  // Обновляем прогресс при переключении на страницу Финансы
            }
        });
    });

    const updateProgressBars = () => {
        const totalTasks = Array.from(document.querySelectorAll('.task')).reduce((sum, task) => sum + parseFloat(task.textContent.split(' — ')[1]), 0);
        const goalAmount = 100000; // Предположим, что это ваша целевая сумма
        const currentProgress = (totalTasks / goalAmount) * 100;
        const goalProgress = ((goalAmount - totalTasks) / goalAmount) * 100;

        document.getElementById('current-progress').style.width = `${currentProgress}%`;
        document.getElementById('current-progress').textContent = `${currentProgress.toFixed(1)}%`;
        document.getElementById('goal-progress').style.width = `${goalProgress}%`;
        document.getElementById('goal-progress').textContent = `${goalProgress.toFixed(1)}%`;
    };

    const wishlist = document.getElementById('wishlist-items');
    const addWish = () => {
        const name = document.getElementById('wish-name').value.trim();
        const desc = document.getElementById('wish-desc').value.trim();
        const link = document.getElementById('wish-link').value.trim();
        const amount = parseFloat(document.getElementById('wish-amount').value) || 0;
        if (name && desc && link) {
            const wish = document.createElement('div');
            wish.className = 'wishlist-item';
            wish.dataset.amount = amount;  // Сохраняем сумму в data-attribute
            wish.innerHTML = `
                <h4>${name}</h4>
                <p>${desc}</p>
                <a href="${link}" target="_blank">Посмотреть</a>
                <p>Сумма: ${amount} ₽</p>
            `;
            wishlist.appendChild(wish);
            updateProgressBars();  // Обновляем прогресс после добавления желания
        }
    };
    document.getElementById('add-wish-btn').addEventListener('click', addWish);

    const moodEntries = document.getElementById('mood-entries');
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
                <small>${dateTime}</small>  <!-- Добавляем дату и время -->
            `;
            moodEntries.appendChild(moodEntry);
        }
    };
    document.getElementById('add-mood-btn').addEventListener('click', addMoodEntry);

    const taskList = document.getElementById('task-list');
    const loadTasksFromWishlist = () => {
        const wishlistItems = document.querySelectorAll('.wishlist-item');
        taskList.innerHTML = ''; // Очищаем существующие задачи перед загрузкой новых
        wishlistItems.forEach(item => {
            const taskName = item.querySelector('h4').textContent;
            const taskAmount = parseFloat(item.dataset.amount); // Загружаем сумму из data-attribute
            const task = document.createElement('div');
            task.className = 'task';
            task.innerHTML = `<p>${taskName} — ${taskAmount} ₽</p>`;
            taskList.appendChild(task);
        });
    };

    // Пер
