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
      <button onclick="markWishAsDone(${index})">Выполнено</button>
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

// Функции добавления желания, удаления, обновления прогресса и фильтрации.

function markWishAsDone(index) {
  const wish = wishListData[index];
  savedAmount -= wish.saved;
  totalWishSum -= wish.price;
  wishListData.splice(index, 1);
  saveData();
  updateUI();
}
