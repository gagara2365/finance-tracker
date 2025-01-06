let totalWishSum = 0;
let savedAmount = 0;
let wishListData = [];
let transactionHistory = [];
let moodLogData = [];

// Загрузка данных из LocalStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateUI();
});

// Сохранение данных в LocalStorage
function saveData() {
  localStorage.setItem('wishList', JSON.stringify(wishListData));
  localStorage.setItem('savedAmount', savedAmount);
  localStorage.setItem('totalWishSum', totalWishSum);
  localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
  localStorage.setItem('moodLog', JSON.stringify(moodLogData));
}

// Загрузка данных из LocalStorage
function loadData() {
  const savedWishList = localStorage.getItem('wishList');
  const savedAmountData = localStorage.getItem('savedAmount');
  const savedTotalSum = localStorage.getItem('totalWishSum');
  const savedTransactions = localStorage.getItem('transactionHistory');
  const savedMoodLog = localStorage.getItem('moodLog');

  if (savedWishList) wishListData = JSON.parse(savedWishList);
  if (savedAmountData) savedAmount = parseFloat(savedAmountData);
  if (savedTotalSum) totalWishSum = parseFloat(savedTotalSum);
  if (savedTransactions) transactionHistory = JSON.parse(savedTransactions);
  if (savedMoodLog) moodLogData = JSON.parse(savedMoodLog);
}

// Обновление интерфейса
function updateUI() {
  // Обновляем список желаний
  const wishList = document.getElementById('wish-list');
  wishList.innerHTML = '';
  wishListData.forEach((wish, index) => {
    const wishItem = document.createElement('div');
    wishItem.className = 'wish';
    wishItem.innerHTML = `
      <h4>${wish.name} (${wish.priority})</h4>
      <p>${wish.description}</p>
      <p>Цена: ${wish.price}</p>
      <a href="${wish.link}" target="_blank">Ссылка</a>
      <div class="progress-bar">
        <div class="progress" style="width: ${wish.progress}%;" id="progress-${index}"></div>
      </div>
      <p>Накоплено: ${wish.saved} из ${wish.price}</p>
      <button onclick="deleteWish(${index})">Удалить</button>
    `;
    wishList.appendChild(wishItem);
  });

  // Обновляем финансы
  document.getElementById('saved-amount').innerText = savedAmount;
  document.getElementById('wish-total').innerText = totalWishSum;
  const progress = Math.min((savedAmount / totalWishSum) * 100, 100);
  document.getElementById('total-progress').style.width = progress + '%';

  // Обновляем историю транзакций
  const transactionHistoryList = document.getElementById('transaction-history');
  transactionHistoryList.innerHTML = '';
  transactionHistory.forEach(transaction => {
    const li = document.createElement('li');
    li.innerText = `${transaction.type}: ${transaction.amount} (${transaction.date})`;
    transactionHistoryList.appendChild(li);
  });

  // Обновляем настроения
  const moodLog = document.getElementById('mood-log');
  moodLog.innerHTML = '';
  moodLogData.forEach(log => {
    const entry = document.createElement('div');
    entry.innerHTML = `<p>${log.date}: ${log.mood} - ${log.comment}</p>`;
    moodLog.appendChild(entry);
  });
}

// Добавить желание
function addWish(event) {
  event.preventDefault();
  const name = document.getElementById('wish-name').value;
  const description = document.getElementById('wish-description').value;
  const price = parseFloat(document.getElementById('wish-price').value);
  const link = document.getElementById('wish-link').value;
  const priority = document.getElementById('wish-priority').value;

  const newWish = { name, description, price, link, priority, progress: 0, saved: 0 };
  wishListData.push(newWish);
  totalWishSum += price;
  saveData();
  updateUI();
}

// Удалить желание
function deleteWish(index) {
  const wish = wishListData[index];
  savedAmount -= wish.saved; // Уменьшаем накопленную сумму
  totalWishSum -= wish.price;
  wishListData.splice(index, 1);
  saveData();
  updateUI();
}

// Фильтрация желаний
function filterWishes() {
  const filter = document.getElementById('filter-priority').value;
  if (filter === 'Все') {
    updateUI();
  } else {
    const filteredWishes = wishListData.filter(wish => wish.priority === filter);
    const wishList = document.getElementById('wish-list');
    wishList.innerHTML = '';
    filteredWishes.forEach((wish, index) => {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish';
      wishItem.innerHTML = `
        <h4>${wish.name} (${wish.priority})</h4>
        <p>${wish.description}</p>
        <p>Цена: ${wish.price}</p>
        <a href="${wish.link}" target="_blank">Ссылка</a>
        <div class="progress-bar">
          <div class="progress" style="width: ${wish.progress}%;" id="progress-${index}"></div>
        </div>
        <p>Накоплено: ${wish.saved} из ${wish.price}</p>
      `;
      wishList.appendChild(wishItem);
    });
  }
}

// Обновить накопления
function updateSavings() {
  const amount = parseFloat(document.getElementById('input-amount').value);
  if (isNaN(amount) || amount <= 0) return;

  savedAmount += amount;
  transactionHistory.push({ type: 'Внесено', amount, date: new Date().toLocaleString() });
  saveData();
  updateUI();
}

// Изъять накопления
function withdrawSavings() {
  const amount = parseFloat(document.getElementById('withdraw-amount').value);
  if (isNaN(amount) || amount <= 0 || amount > savedAmount) return;

  savedAmount -= amount;
  transactionHistory.push({ type: 'Изъято', amount, date: new Date().toLocaleString() });
  saveData();
  updateUI();
}

// Добавить настроение
function addMood() {
  const mood = document.getElementById('mood-select').value;
  const comment = document.getElementById('mood-comment').value;
  const date = new Date().toLocaleString();

  const newMood = { mood, comment, date };
  moodLogData.push(newMood);
  saveData();
  updateUI();
}
