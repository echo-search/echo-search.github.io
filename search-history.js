const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const historyList = document.getElementById('search-history');
const clearBtn = document.getElementById('clear-history');

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  historyList.innerHTML = '';
  history.forEach(term => {
    const li = document.createElement('li');
    li.textContent = term;
    li.style.cursor = 'pointer';
    li.style.padding = '4px 0';
    li.style.borderBottom = '1px solid #ccc';
    li.addEventListener('click', () => {
      searchInput.value = term;
      searchBtn.click();
    });
    historyList.appendChild(li);
  });
}

function saveToHistory(term) {
  if (!term) return;
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  history = history.filter(t => t.toLowerCase() !== term.toLowerCase());
  history.unshift(term);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem('searchHistory', JSON.stringify(history));
  loadHistory();
}

clearBtn.addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  loadHistory();
});

searchBtn.addEventListener('click', () => {
  const term = searchInput.value.trim();
  if(term) saveToHistory(term);
});

searchInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    const term = searchInput.value.trim();
    if(term) saveToHistory(term);
  }
});

loadHistory();
