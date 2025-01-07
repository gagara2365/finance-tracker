let totalWishSum = 0; // Общая сумма всех желаний
let savedAmount = 0;  // Общая накопленная сумма
let wishListData = []; // Список желаний
let completedWishes = []; // Архив выполненных желаний
let transactionHistory = []; // История транзакций
let moodLogData = []; // История настроений

// Загрузка данных из LocalStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateUI();
  setupTabs(); // Настройка переключения вкладок
  loadTheme(); // Загрузка сохранённой темы
});

// Настройка переключения вкладок
function setupTabs() {
  const tabs = document.querySelectorAll('.tabs li');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
  });
}

// Переключение между светлой и тёмной темой
function toggleTheme() {
  const body = document.body;

  // Переключаем класс "dark-theme"
  body.classList.toggle('dark-theme');

  // Сохраняем выбранную тему в LocalStorage
  const isDark = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  // Обновляем текст кнопки
  document.getElementById('theme-toggle').innerText = isDark ? 'Светлая тема' : 'Тёмная тема';
}

// Загрузка сохранённой темы
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-toggle').innerText = 'Светлая тема';
  } else {
    document.getElementById('theme-toggle').innerText = 'Тёмная тема';
  }
}

// Сохранение данных в LocalStorage
function saveData() {
  localStorage.setItem('wishList', JSON.stringify(wishListData));
  localStorage.setItem('completedWishes', JSON.stringify(completedWishes));
  localStorage.setItem('savedAmount', savedAmount);
  localStorage.setItem('totalWishSum', totalWishSum);
  localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
  localStorage.setItem('moodLog', JSON.stringify(moodLogData));
}

// Загрузка данных из LocalStorage
function loadData() {
  const savedWishList = localStorage.getItem('wishList');
  const savedCompletedWishes = localStorage.getItem('completedWishes');
  const savedAmountData = localStorage.getItem('savedAmount');
  const savedTotalSum = localStorage.getItem('totalWishSum');
  const savedTransactions = localStorage.getItem('transactionHistory');
  const savedMoodLog = localStorage.getItem('moodLog');

  if (savedWishList) wishListData = JSON.parse(savedWishList);
  if (savedCompletedWishes) completedWishes = JSON.parse(savedCompletedWishes);
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
      <p>Требуется: ${wish.price}</p>
      <p>Накоплено: ${Math.min(savedAmount, wish.price)} из ${wish.price}</p>
      <a href="${wish.link}" target="_blank">Ссылка</a>
      <button onclick="markWishAsDone(${index})">Выполнено</button>
      <button onclick="deleteWish(${index})">Удалить</button>
    `;
    wishList.appendChild(wishItem);
  });

  // Обновляем архив выполненных желаний
  const archiveList = document.getElementById('completed-wishes');
  archiveList.innerHTML = '';
  completedWishes.forEach(wish => {
    const archiveItem = document.createElement('div');
    archiveItem.className = 'wish';
    archiveItem.innerHTML = `
      <h4>${wish.name} (${wish.priority})</h4>
      <p>${wish.description}</p>
      <p>Стоимость: ${wish.price}</p>
      <p>Дата выполнения: ${wish.completedDate}</p>
      <a href="${wish.link}" target="_blank">Ссылка</a>
    `;
    archiveList.appendChild(archiveItem);
  });

  // Обновляем финансы
  document.getElementById('saved-amount').innerText = savedAmount;
  document.getElementById('wish-total').innerText = totalWishSum;

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
  moodLogData.forEach((log, index) => {
    const entry = document.createElement('div');
    entry.innerHTML = `
      <p>${log.date}: ${log.mood} - ${log.comment}</p>
      <button onclick="deleteMood(${index})">Удалить</button>
    `;
    moodLog.appendChild(entry);
  });
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

// Удалить желание
function deleteWish(index) {
  const wish = wishListData[index];
  totalWishSum -= wish.price;
  wishListData.splice(index, 1);
  saveData();
  updateUI();
}

// Отметить желание как выполненное
function markWishAsDone(index) {
  const wish = wishListData[index];
  savedAmount -= wish.price;
  totalWishSum -= wish.price;

  // Добавляем желание в архив с датой выполнения
  wish.completedDate = new Date().toLocaleString();
  completedWishes.push(wish);

  wishListData.splice(index, 1);
  transactionHistory.push({ type: 'Выполнено', amount: wish.price, date: wish.completedDate });
  saveData();
  updateUI();
}

// Добавить желание
function addWish(event) {
  event.preventDefault();
  const name = document.getElementById('wish-name').value;
  const description = document.getElementById('wish-description').value;
  const price = parseFloat(document.getElementById('wish-price').value);
  const link = document.getElementById('wish-link').value;
  const priority = document.getElementById('wish-priority').value;

  const newWish = { name, description, price, link, priority };
  wishListData.push(newWish);
  totalWishSum += price;
  saveData();
  updateUI();
}

// Удалить настроение
function deleteMood(index) {
  moodLogData.splice(index, 1);
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
