let app = require('electron').app;
let path = require('path');
let requirejs = require('requirejs');

if (process.env['NODE_ENV'] === 'development') {
  process.chdir(path.join(path.resolve(), 'dist'));
} else {
  process.chdir(path.join(path.resolve(), 'resources/app/dist'));
}

app.on('ready', () => {
  requirejs(['code/electron-main/main'], function() {});
});

