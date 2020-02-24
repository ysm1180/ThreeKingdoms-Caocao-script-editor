/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

const bootstrapWindow = require('../../../../bootstrap-window');

bootstrapWindow.load(
  ['jojo/workbench/workbench.main'],
  function() {
    // @ts-ignore
    return require('jojo/workbench/electron-browser/main').startup();
  },
  {}
);
