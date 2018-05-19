let app = require('electron').app;
let fs = require('fs');
let path = require('path');
let requirejs = require('requirejs');


process.chdir(path.join(path.resolve(), 'dist'));

app.on('ready', () => {
  requirejs(['code/electron-main/main'], function() {});
});

