let app = require('electron').app;

if (process.env['NODE_ENV'] === 'development') {
  process.chdir(__dirname);
}

app.on('ready', () => {
  require('./bootstrap-amd').load('jojo/code/electron-main/main', () => {});
});
