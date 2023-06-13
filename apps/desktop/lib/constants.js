const {join} = require('path');
const os = require('os');

const isDev = process.env.NODE_ENV !== 'production';

const homePath = os.homedir();

const syncedDir = join(homePath, 'Documents', 'SAGA Sync');
const configDir = join(process.env.APPDATA || process.env.HOME + (process.platform === 'darwin' ? '/Library/Preferences' : '/.local/share'), 'SAGA');
const authFilePath = join(configDir, 'auth.json');
const serverHost = isDev ? 'http://localhost:2020' : '';

module.exports = exports = {
  authFilePath,
  configDir,
  syncedDir,
  serverHost
}