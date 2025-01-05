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
        });
    });

    const totalBalance = document.getElementById('total-balance');
    const updateBalance = () => {
        const changeInput = document.getElementById('balance-change');
        const changeValue = parseFloat(changeInput.value) || 0;
        totalBalance.textContent = (parseFloat(totalBalance.textContent) + changeValue).toFixed(2);
        changeInput.value = '';
    };
    document.getElementById('update-balance-btn').addEventListener('click', updateBalance);

    const taskList = document.getElementById('task-list');
    const deletedTasks = document.getElementById('deleted-tasks');
    const addTask = () => {
        const taskName = document.getElementById('task-name').value.trim();
        const taskAmount = parseFloat(document.getElementById('task-amount').value);
        if (taskName && !isNaN(taskAmount)) {
            const task = document.createElement('div');
            task.className = 'task';
            task.innerHTML = `
                <p>${taskName} — ${taskAmount} ₽</p>
                <button class="delete-task-btn">Удалить</button>
            `;
            task.querySelector('.delete-task-btn').addEventListener('click', () => {
                deletedTasks.appendChild(task);
                task.querySelector('.delete-task-btn').remove();
            });
            taskList.appendChild(task);
        }
    };
    document.getElementById('add-task-btn').addEventListener('click', addTask);

    const wishlist = document.getElementById('wishlist-items');
    const addWish = () => {
        const name = document.getElementById('wish-name').value.trim();
        const desc = document.getElementById('wish-desc').value.trim();
        const link = document.getElementById('wish-link').value.trim();
        if (name && desc && link) {
            const wish = document.createElement('div');
            wish.className = 'wishlist-item';
            wish.innerHTML = `
                <h4>${name}</h4>
                <p>${desc}</p>
                <a href="${link}" target="_blank">Посмотреть</a>
            `;
            wishlist.appendChild(wish);
        }
    };
    document.getElementById('add-wish-btn').addEventListener('click', addWish);

    const moodEntries = document.getElementById('mood-entries');
    const addMoodEntry = () => {
        const moodValue = document.querySelector('input[name="mood"]:checked')?.value;
        const comment = document.getElementById('mood-comment').value.trim();
        if (moodValue) {
            const moodEntry = document.createElement('div');
            moodEntry.className = 'mood-entry';
            moodEntry.innerHTML = `
                <p>Настроение: ${moodValue}</p>
                <p>${comment}</p>
            `;
            moodEntries.appendChild(moodEntry);
        }
    };
    document.getElementById('add-mood-btn').addEventListener('click', addMoodEntry);
});
