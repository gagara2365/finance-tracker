function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

let totalWishesAmount = 0; // Общая сумма желаний
let totalSavings = 0; // Текущие накопления

function updateSavings() {
    const inputAmount = parseFloat(document.getElementById('amount-input').value);
    totalSavings += inputAmount;
    document.getElementById('amount-input').value = ''; // Очистить поле ввода
    updateProgressBars();
}

function updateProgressBars() {
    const wishProgress = totalWishesAmount ? (totalSavings / totalWishesAmount) * 100 : 0;
    document.getElementById('wish-progress').children[0].style.width = `${wishProgress}%`;
    document.getElementById('savings-progress').children[0].style.width = `${(totalSavings / totalWishesAmount) * 100}%`;
}

function addWish() {
    const title = document.getElementById('wish-title').value;
    const description = document.getElementById('wish-description').value;
    const amount = parseFloat(document.getElementById('wish-amount').value);
    const link = document.getElementById('wish-link').value;

    const wishList = document.getElementById('wish-list');
    const wishEntry = `<div class="wish-item">
        <h4>${title}</h4>
        <p>${description}</p>
        <a href="${link}" target="_blank">Посмотреть</a>
        <span>Сумма: ${amount} ₽</span>
    </div>`;
    wishList.innerHTML += wishEntry;

    totalWishesAmount += amount;
    updateProgressBars(); // Обновление шкал прогресса
}

function addMoodEntry() {
    const selectedMood = document.querySelector('input[name="mood"]:checked').value;
    const comment = document.getElementById('mood-comment').value;
    const dateTime = new Date().toLocaleString();
    const entry = `<div class="mood-entry">
        <p>Настроение: ${selectedMood} - ${comment}</p>
        <small>${dateTime}</small>
    </div>`;
    document.getElementById('mood-entries').innerHTML += entry;
    document.getElementById('mood-comment').value = ''; // Очистка поля
}

// Show the first section initially
showSection('finance');
