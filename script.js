let totalWishSum = 0;
let savedAmount = 0;
let wishListData = [];
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
  localStorage.setItem('moodLog', JSON.stringify(moodLogData));
}

// Загрузка данных из LocalStorage
function loadData() {
  const savedWishList = localStorage.getItem('wishList');
  const savedAmountData = localStorage.getItem('savedAmount');
  const savedTotalSum = localStorage.getItem('totalWishSum');
  const savedMoodLog = localStorage.getItem('moodLog');

  if (savedWishList) {
    wishListData = JSON.parse(savedWishList);
  }
  if (savedAmountData) {
    savedAmount = parseFloat(savedAmountData);
  }
  if (savedTotalSum) {
    totalWishSum = parseFloat(savedTotalSum);
  }
  if (savedMoodLog) {
    moodLogData = JSON.parse(savedMoodLog);
  }
}

// Обновление пользовательского интерфейса
function updateUI() {
  // Обновляем список желаний
  const wishList = document.getElementById('wish-list');
  wishList.innerHTML = '';
  wishListData.forEach((wish, index) => {
    const wishItem = document.createElement('div');
    wishItem.className = 'wish';
    wishItem.innerHTML = `
      <h4>${wish.name}</h4>
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

  // Обновляем финансы
  document.getElementById('saved-amount').innerText = savedAmount;
  document.getElementById('wish-total').innerText = totalWishSum;
  const progress = Math.min((savedAmount / totalWishSum) * 100, 100);
  document.getElementById('total-progress').style.width = progress + '%';

  // Обновляем настроения
  const moodLog = document.getElementById('mood-log');
  moodLog.innerHTML = '';
  moodLogData.forEach(log => {
    const entry = document.createElement('div');
    entry.innerHTML = `<p>${log.date}: ${log.mood} - ${log.comment}</p>`;
    moodLog.appendChild(entry);
  });
}

// Добавить пункт в список желаний
function addWish(event) {
  event.preventDefault();
  const name = document.getElementById('wish-name').value;
  const description = document.getElementById('wish-description').value;
  const price = parseFloat(document.getElementById('wish-price').value);
  const link = document.getElementById('wish-link').value;

  const newWish = {
    name,
    description,
    price,
    link,
    progress: 0,
    saved: 0
  };

  wishListData.push(newWish);
  totalWishSum += price;
  saveData();
  updateUI();
}

// Обновить сумму накоплений
function updateSavings() {
  const amount = parseFloat(document.getElementById('input-amount').value);
  if (isNaN(amount) || amount <= 0) return;

  savedAmount += amount;

  // Обновляем прогресс для каждого желания
  wishListData.forEach(wish => {
    if (wish.saved < wish.price) {
      const remaining = wish.price - wish.saved;
      if (amount >= remaining) {
        wish.saved = wish.price;
        wish.progress = 100;
        amount -= remaining;
      } else {
        wish.saved += amount;
        wish.progress = Math.min((wish.saved / wish.price) * 100, 100);
        amount = 0;
      }
    }
  });

  saveData();
  updateUI();
}

// Добавить настроение
function addMood() {
  const mood = document.getElementById('mood-select').value;
  const comment = document.getElementById('mood-comment').value;
  const date = new Date().toLocaleString();

  const newMood = {
    mood,
    comment,
    date
  };

  moodLogData.push(newMood);
  saveData();
  updateUI();
}
