let totalWishSum = 0; // Общая сумма всех желаний
let savedAmount = 0;  // Общая накопленная сумма
let wishListData = []; // Список желаний
let transactionHistory = []; // История транзакций
let moodLogData = []; // История настроений

let progressChart = null; // График прогресса накоплений
let distributionChart = null; // График распределения накоплений

// Загрузка данных из LocalStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateUI();
  setupTabs(); // Настройка переключения вкладок
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
        <div class="progress" style="width: ${Math.min((savedAmount / wish.price) * 100, 100)}%;" id="progress-${index}"></div>
      </div>
      <p>Накоплено: ${Math.min(savedAmount, wish.price)} из ${wish.price}</p>
      <button onclick="markWishAsDone(${index})">Выполнено</button>
      <button onclick="deleteWish(${index})">Удалить</button>
    `;
    wishList.appendChild(wishItem);
  });

  // Обновляем финансы
  document.getElementById('saved-amount').innerText = savedAmount;
  document.getElementById('wish-total').innerText = totalWishSum;
  const progress = totalWishSum === 0 ? 0 : Math.min((savedAmount / totalWishSum) * 100, 100);
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
  moodLogData.forEach((log, index) => {
    const entry = document.createElement('div');
    entry.innerHTML = `
      <p>${log.date}: ${log.mood} - ${log.comment}</p>
      <button onclick="deleteMood(${index})">Удалить</button>
    `;
    moodLog.appendChild(entry);
  });

  // Обновляем графики
  updateCharts();
}

// Построение и обновление графиков
function updateCharts() {
  const progressCtx = document.getElementById('progressChart').getContext('2d');
  const distributionCtx = document.getElementById('distributionChart').getContext('2d');

  // Удаляем предыдущий график, если он существует
  if (progressChart && typeof progressChart.destroy === 'function') {
    progressChart.destroy();
  }

  if (distributionChart && typeof distributionChart.destroy === 'function') {
    distributionChart.destroy();
  }

  // График прогресса накоплений
  progressChart = new Chart(progressCtx, {
    type: 'doughnut',
    data: {
      labels: ['Накоплено', 'Осталось'],
      datasets: [{
        data: [savedAmount, Math.max(totalWishSum - savedAmount, 0)],
        backgroundColor: ['#76c7c0', '#e0e0e0'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });

  // График распределения накоплений
  distributionChart = new Chart(distributionCtx, {
    type: 'bar',
    data: {
      labels: wishListData.map(wish => wish.name),
      datasets: [{
        label: 'Накоплено',
        data: wishListData.map(wish => Math.min(savedAmount, wish.price)),
        backgroundColor: '#76c7c0',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Желания'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Сумма'
          },
          beginAtZero: true
        }
      }
    }
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
  wishListData.splice(index, 1);
  transactionHistory.push({ type: 'Выполнено', amount: wish.price, date: new Date().toLocaleString() });
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
