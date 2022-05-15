import { ILaunchpad } from './launchpads/base/ILaunchpad.js';
/**
 * Return a promise waiting for the given Launchpad to become ready
 */
export declare function waitForReady<A extends ILaunchpad>(lp: A): Promise<A>;
