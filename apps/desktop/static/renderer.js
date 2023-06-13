function login() {
  
}


async function init() {
  const login = document.getElementById('login');
  const dashboard = document.getElementById('dashboard');

  const isLogged = await utils.isLogged();

  if (isLogged) {
    login.style.display = 'none';
    dashboard.style.display = 'flex';
  } else {
    login.style.display = 'flex';
    dashboard.style.display = 'none';
  }
}

init();
