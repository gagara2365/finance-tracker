let totalWishSum = 0;
let savedAmount = 0;

// Переключение вкладок
document.querySelectorAll('.tabs li').forEach(tab => {
  tab.addEventListener('click', () => {
    const activeTab = tab.getAttribute('data-tab');

    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Показать текущую вкладку
    document.getElementById(activeTab).classList.add('active');
  });
});

function addWish(event) {
  event.preventDefault();
  const name = document.getElementById('wish-name').value;
  const description = document.getElementById('wish-description').value;
  const price = parseFloat(document.getElementById('wish-price').value);
  const link = document.getElementById('wish-link').value;

  totalWishSum += price;
  document.getElementById('wish-total').innerText = totalWishSum;

  const wishList = document.getElementById('wish-list');
  const wishItem = document.createElement('div');
  wishItem.className = 'wish';
  wishItem.innerHTML = `
    <h4>${name}</h4>
    <p>${description}</p>
    <p>Цена: ${price}</p>
    <a href="${link}" target="_blank">Ссылка</a>
    <div class="progress-bar">
      <div class="progress" style="width: 0%;" id="progress-${name}"></div>
    </div>
    <p>Накоплено: 0 из ${price}</p>
  `;
  wishList.appendChild(wishItem);
}

function updateSavings() {
  const amount = parseFloat(document.getElementById('input-amount').value);
  if (isNaN(amount) || amount <= 0) return;

  savedAmount += amount;
  document.getElementById('saved-amount').innerText = savedAmount;

  const progress = Math.min((savedAmount / totalWishSum) * 100, 100);
  document.getElementById('total-progress').style.width = progress + '%';
}

function addMood() {
  const mood = document.getElementById('mood-select').value;
  const comment = document.getElementById('mood-comment').value;
  const date = new Date().toLocaleString();

  const log = document.getElementById('mood-log');
  const entry = document.createElement('div');
  entry.innerHTML = `<p>${date}: ${mood} - ${comment}</p>`;
  log.appendChild(entry);
}
