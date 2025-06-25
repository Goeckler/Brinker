const users = [
  'Bahre','Diederichsen','Wunder','Ostkamp','Unglaube','Grosskemm','test'
];
const PASSWORD = 'Start123!';

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (users.includes(username) && password === PASSWORD) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('form-container').style.display = 'block';
    localStorage.setItem('loggedInUser', username);
  } else {
    alert('Zugangsdaten falsch.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
  }

  if (location.pathname.includes('admin.html')) {
    const table = document.getElementById('entries-table');
    const entries = Object.keys(localStorage)
      .filter(k => k !== 'loggedInUser')
      .map(k => JSON.parse(localStorage.getItem(k)));

    entries.forEach(entry => {
      const div = document.createElement('div');
      div.textContent = JSON.stringify(entry);
      table.appendChild(div);
    });
  }
});