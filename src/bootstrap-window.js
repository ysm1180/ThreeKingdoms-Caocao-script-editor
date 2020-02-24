/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

const bootstrap = require('./bootstrap');

/**
 * @param {object} destination
 * @param {object} source
 * @returns {object}
 */
exports.assign = function assign(destination, source) {
  return Object.keys(source).reduce(function(r, key) {
    r[key] = source[key];
    return r;
  }, destination);
};

/**
 *
 * @param {string[]} modulePaths
 * @param {(result) => any} resultCallback
 * @param {{ forceEnableDeveloperKeybindings?: boolean, disallowReloadKeybinding?: boolean, removeDeveloperKeybindingsAfterLoad?: boolean, canModifyDOM?: (config: object) => void, beforeLoaderConfig?: (config: object, loaderConfig: object) => void, beforeRequire?: () => void }=} options
 */
exports.load = function(modulePaths, resultCallback, options) {
  // @ts-ignore
  const path = require('path');

  // Error handler
  // @ts-ignore
  process.on('uncaughtException', function(error) {
    onUnexpectedError(error);
  });

  // Enable ASAR support
  bootstrap.enableASARSupport(path.join('..', 'node_modules'));

  // Load the loader
  const amdLoader = require(path.join('..', '/dist/jojo/loader.js'));
  const amdRequire = amdLoader.require;
  const amdDefine = amdLoader.require.define;
  const nodeRequire = amdLoader.require.nodeRequire;

  window['nodeRequire'] = nodeRequire;
  window['require'] = amdRequire;

  // replace the patched electron fs with the original node fs for all AMD code
  amdDefine('fs', ['original-fs'], function(originalFS) {
    return originalFS;
  });

  const loaderConfig = {
    baseUrl: bootstrap.uriFromPath(path.dirname('..')),
    nodeModules: [
      /*BUILD->INSERT_NODE_MODULES*/
    ],
  };

  amdRequire.config(loaderConfig);

  if (options && typeof options.beforeRequire === 'function') {
    options.beforeRequire();
  }

  amdRequire(
    modulePaths,
    (result) => {
      try {
        const callbackResult = resultCallback(result);
        if (callbackResult && typeof callbackResult.then === 'function') {
          callbackResult.then(
            () => {},
            (error) => {
              onUnexpectedError(error);
            }
          );
        }
      } catch (error) {
        onUnexpectedError(error);
      }
    },
    onUnexpectedError
  );
};

function onUnexpectedError(error) {
  // @ts-ignore
  console.error('[uncaught exception]: ' + error);

  if (error && error.stack) {
    console.error(error.stack);
  }
}
