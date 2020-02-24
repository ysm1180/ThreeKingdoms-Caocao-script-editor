/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

const loader = require('./jojo/loader');
const bootstrap = require('./bootstrap');

// Bootstrap: Loader
loader.config({
  baseUrl: bootstrap.uriFromPath(__dirname),
  catchError: true,
  nodeRequire: require,
  nodeMain: __filename,
});

loader.define('fs', ['original-fs'], function(originalFS) {
  return originalFS; // replace the patched electron fs with the original node fs for all AMD code
});

exports.load = function(entrypoint, onLoad, onError) {
  if (!entrypoint) {
    return;
  }

  onLoad = onLoad || function() {};
  onError =
    onError ||
    function(err) {
      console.error(err);
    };

  loader([entrypoint], onLoad, onError);
};
