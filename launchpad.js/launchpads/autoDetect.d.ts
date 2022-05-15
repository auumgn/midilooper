import { ILaunchpad } from './base/ILaunchpad.js';
export interface AutoDetectOptions {
    /**
     * Switch on debug mode
     *
     * Will log more messages to the console.
     *
     * @default false
     */
    readonly debug?: boolean;
}
/**
 * Scan the MIDI devices and return the Launchpad implementation matching the detected devices
 *
 * Throws an error if no supported Launchpad device is detected.
 */
export declare function autoDetect(options?: AutoDetectOptions): ILaunchpad;
