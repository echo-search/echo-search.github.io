document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');     
  const btn = document.getElementById('search-btn');        
  const historyUL = document.getElement('search-history');
  const clearBtn = document.getElementById('clear-history');   

  function loadHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    historyUL.innerHTML = '';  
    history.forEach(term => {
      const li = document.createElement('li');  
      li.textContent = term;
      li.onclick = () => {
        input.value = term;            
        alert('Search: ' + term);      
      };
      historyUL.appendChild(li);     
    });
  }

  function saveToHistory(term) {
    if (!term) return;  
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = history.filter(t => t.toLowerCase() !== term.toLowerCase());
    history.unshift(term); 
    if (history.length > 20) history = history.slice(0, 20); 
    localStorage.setItem('searchHistory', JSON.stringify(history)); 
    loadHistory()
  } 
  
  btn.onclick = () => {
    const term = input.value.trim();
    if (term) {
      saveToHistory(term);
      alert('Search: ' + term);
    }
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const term = input.value.trim();
      if (term) {
        saveToHistory(term);
        alert('Search: ' + term);
      }
    }
  });

  clearBtn.onclick = () => {
    localStorage.removeItem('searchHistory');
    loadHistory();
  };

  loadHistory();
});
