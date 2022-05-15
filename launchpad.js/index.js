import SegfaultHandler from 'segfault-handler';
export * from './launchpads/MK2/LaunchpadMK2.js';
export * from './launchpads/MK3/LaunchpadMK3.js';
export * from './launchpads/base/ILaunchpad.js';
export * from './launchpads/autoDetect.js';
export * from './launchpadHelpers.js';
import * as colors_1 from './colorHelpers.js';
export { colors_1 as colorHelpers };
import * as utils_1 from './utils.js';
export { utils_1 as utils };
export * from './surface/ILayer.js';
export * from './surface/Surface.js';
export * from './surface/Drawing.js';
// Midi uses native code, so just in case
SegfaultHandler.registerHandler('launchpad-js-crash.log');
