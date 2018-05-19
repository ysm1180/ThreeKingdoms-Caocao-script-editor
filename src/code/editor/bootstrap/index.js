'use strict';

let path = require('path');
let requirejs = require('requirejs');

requirejs.config({
    baseUrl: path.resolve(),
    nodeRequire: require
});

function main() {
    requirejs('code/editor/workbench/main').startup();
}

main();