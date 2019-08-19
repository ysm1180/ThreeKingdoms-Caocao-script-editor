let app = require('electron').app;

if (process.env['NODE_ENV'] === 'development') {
    process.chdir(__dirname);
}

app.on('ready', () => {
    require('./code/electron-main/main');
});
