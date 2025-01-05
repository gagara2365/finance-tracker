// Переключение вкладок
function switchTab(event, tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// Финансы
let totalBalance = 0;
function updateBalance() {
    const change = parseFloat(document.getElementById("balance-change").value) || 0;
    totalBalance += change;
    document.getElementById("total-balance").textContent = totalBalance;
}
function addTask() {
    const taskName = document.getElementById("task-name").value;
    const taskAmount = parseFloat(document.getElementById("task-amount").value) || 0;
    if (!taskName || taskAmount <= 0) return;
    const taskList = document.getElementById("task-list");
    taskList.innerHTML += `<div class="task"><p>${taskName} — ${taskAmount} ₽</p></div>`;
}

// Желания
function addWish() {
    const wishName = document.getElementById("wish-name").value;
    const wishDesc = document.getElementById("wish-desc").value;
    const wishLink = document.getElementById("wish-link").value;
    if (!wishName) return;
    const wishList = document.getElementById("wishlist-items");
    wishList.innerHTML += `<div class="wishlist-item">
        <p><strong>${wishName}</strong> — ${wishDesc}</p>
        <a href="${wishLink}" target="_blank">Ссылка</a>
    </div>`;
}

// Настроение
function addMoodEntry() {
    const moodValue = document.querySelector('input[name="mood"]:checked')?.value || '';
    const moodComment = document.getElementById("mood-comment").value;
    const moodEntries = document.getElementById("mood-entries");
    if (!moodValue) return;
    moodEntries.innerHTML += `<div class="mood-entry">
        <p>Настроение: ${moodValue}</p>
        <p>${moodComment}</p>
    </div>`;
}
