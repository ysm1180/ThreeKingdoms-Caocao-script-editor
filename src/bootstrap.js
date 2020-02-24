/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//#region global bootstrapping

// increase number of stack frames(from 10, https://github.com/v8/v8/wiki/Stack-Trace-API)
Error.stackTraceLimit = 100;

// Workaround for Electron not installing a handler to ignore SIGPIPE
// (https://github.com/electron/electron/issues/13254)
// @ts-ignore
process.on('SIGPIPE', () => {
  console.error(new Error('Unexpected SIGPIPE'));
});

//#endregion

//#region Add support for redirecting the loading of node modules

exports.injectNodeModuleLookupPath = function(injectPath) {
  if (!injectPath) {
    throw new Error('Missing injectPath');
  }

  // @ts-ignore
  const Module = require('module');
  const path = require('path');

  const nodeModulesPath = path.join(__dirname, '../node_modules');

  // @ts-ignore
  const originalResolveLookupPaths = Module._resolveLookupPaths;

  // @ts-ignore
  Module._resolveLookupPaths = function(moduleName, parent) {
    const paths = originalResolveLookupPaths(moduleName, parent);
    if (Array.isArray(paths)) {
      for (let i = 0, len = paths.length; i < len; i++) {
        if (paths[i] === nodeModulesPath) {
          paths.splice(i, 0, injectPath);
          break;
        }
      }
    }

    return paths;
  };
};
//#endregion

//#region Add support for using node_modules.asar
/**
 * @param {string=} nodeModulesPath
 */
exports.enableASARSupport = function(nodeModulesPath) {
  // @ts-ignore
  const Module = require('module');
  const path = require('path');

  let NODE_MODULES_PATH = nodeModulesPath;
  if (!NODE_MODULES_PATH) {
    NODE_MODULES_PATH = path.join(__dirname, '../node_modules');
  }

  const NODE_MODULES_ASAR_PATH = NODE_MODULES_PATH + '.asar';

  // @ts-ignore
  const originalResolveLookupPaths = Module._resolveLookupPaths;

  // @ts-ignore
  Module._resolveLookupPaths = function(request, parent) {
    const paths = originalResolveLookupPaths(request, parent);
    if (Array.isArray(paths)) {
      for (let i = 0, len = paths.length; i < len; i++) {
        if (paths[i] === NODE_MODULES_PATH) {
          paths.splice(i, 0, NODE_MODULES_ASAR_PATH);
          break;
        }
      }
    }

    return paths;
  };
};
//#endregion

//#region URI helpers
/**
 * @param {string} _path
 * @returns {string}
 */
exports.uriFromPath = function(_path) {
  const path = require('path');

  let pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }

  /** @type {string} */
  let uri;
  if (process.platform === 'win32' && pathName.startsWith('//')) {
    // specially handle Windows UNC paths
    uri = encodeURI('file:' + pathName);
  } else {
    uri = encodeURI('file://' + pathName);
  }

  return uri.replace(/#/g, '%23');
};
//#endregion

//#region FS helpers
/**
 * @param {string} file
 * @returns {Promise<string>}
 */
exports.readFile = function(file) {
  const fs = require('fs');

  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

/**
 * @param {string} file
 * @param {string} content
 * @returns {Promise<void>}
 */
exports.writeFile = function(file, content) {
  const fs = require('fs');

  return new Promise(function(resolve, reject) {
    fs.writeFile(file, content, 'utf8', function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

/**
 * @param {string} dir
 * @returns {Promise<string>}
 */
exports.mkdirp = function mkdirp(dir) {
  const fs = require('fs');

  return new Promise((c, e) =>
    fs.mkdir(dir, { recursive: true }, (err) => (err && err.code !== 'EEXIST' ? e(err) : c(dir)))
  );
};
//#endregion
