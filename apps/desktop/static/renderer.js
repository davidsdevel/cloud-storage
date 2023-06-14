window._fetcher = null;

const loginElement = document.getElementById('login');
const dashboard = document.getElementById('dashboard');
const storage = document.getElementById('storage');

class Fetcher {
  constructor(token) {
    this.token = token;
    this.endpoint = 'http://localhost:2020';
  }
  async _fetch(path, method = 'GET', data = {}) {
    const res = await  fetch(`${this.endpoint}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      ...data
    });

    return res.json();
  }
  getDevices() {
    return this._fetch('/device', 'GET');
  }

  async getStorage() {
    const {storageSize} = await this._fetch('/bucket', 'GET');

    return storageSize;
  }
}

function toggleLogin(isLogged) {
  if (isLogged) {
    loginElement.style.display = 'none';
    dashboard.style.display = 'flex';
  } else {
    loginElement.style.display = 'flex';
    dashboard.style.display = 'none';
  }
}

function updateStorage(size) {
  console.log(size);

  const measurement = ['B', 'Kb', 'Mb', 'Gb', 'Tb'];
    
  let finalSize = size;
  let i = 0;

  while(finalSize >= 1024) {
    finalSize = finalSize / 1024;
    i++;
  }
    
  storage.innerText = `${finalSize.toFixed(1)}${measurement[i]}`
}

async function login() {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  const token = await utils.login(email.value, password.value);

  if (!token) //Add message on UI
    return alert('Credenciales invalidas');

  toggleLogin(true);

  window._fetcher = new Fetcher(token);
}

async function init() {
  const token = await utils.isLogged();

  window._fetcher = new Fetcher(token);

  toggleLogin(token);

  utils.onUpdateStorage((e, size) => updateStorage(size));

  const storageSize = await window._fetcher.getStorage();
  updateStorage(storageSize);
}

init();
