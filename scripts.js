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

    document.getElementById('add-wish-btn').addEventListener('click', () => {
        const name = document.getElementById('wish-name').value.trim();
        const desc = document.getElementById('wish-desc').value.trim();
        const link = document.getElementById('wish-link').value.trim();
        const amount = parseFloat(document.getElementById('wish-amount').value);
        if (name && desc && link && !isNaN(amount)) {
            const wish = document.createElement('div');
            wish.className = 'wishlist-item';
            wish.innerHTML = `
                <h4>${name} - ${amount} руб</h4>
                <p>${desc}</p>
                <a href="${link}" target="_blank">Посмотреть</a>
            `;
            const wishlist = document.getElementById('wishlist-items');
            wishlist.appendChild(wish);
            updateFinanceTracker(name, amount);
        }
    });

    function updateFinanceTracker(itemName, itemAmount) {
        const financeList = document.getElementById('finance-list');
        financeList.innerHTML += `<p>${itemName}: ${itemAmount} руб</p>`;
        updateFinanceProgress();
    }

    function updateFinanceProgress() {
        const totalNeeded = [...document.querySelectorAll('.wishlist-item')].reduce((acc, item) => acc + parseFloat(item.querySelector('h4').textContent.split('-')[1]), 0);
        const progressElement = document.getElementById('finance-progress');
        progressElement.max = totalNeeded;
        const totalCollected = parseFloat(document.getElementById('total-collected').textContent);
        progressElement.value = totalCollected;
    }

    document.getElementById('add-mood-btn').addEventListener('click', () => {
        const moodValue = document.querySelector('input[name="mood"]:checked')?.value;
        const comment = document.getElementById('mood-comment').value.trim();
        const dateTime = new Date().toLocaleString();
        const moodEntry = document.createElement('div');
        moodEntry.className = 'mood-entry';
        moodEntry.innerHTML = `
            <p>Настроение: ${moodValue} | ${dateTime}</p>
            <p>${comment}</p>
        `;
        const moodEntries = document.getElementById('mood-entries');
        moodEntries.appendChild(moodEntry);
    });
});
