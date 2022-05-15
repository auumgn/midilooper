import midi from 'midi';
import { allDeviceNames } from '../utils.js';
import { LaunchpadMK2 } from './MK2/LaunchpadMK2.js';
import { LaunchpadMK3 } from './MK3/LaunchpadMK3.js';
/**
 * Scan the MIDI devices and return the Launchpad implementation matching the detected devices
 *
 * Throws an error if no supported Launchpad device is detected.
 */
export function autoDetect(options) {
    const inputNames = allDeviceNames(new midi.Input());
    const outputNames = allDeviceNames(new midi.Output());
    if (canFindBoth(LaunchpadMK2.DEFAULT_DEVICE_NAME, LaunchpadMK2.DEFAULT_DEVICE_NAME)) {
        return new LaunchpadMK2(options);
    }
    if (canFindBoth(LaunchpadMK3.INPUT_NAME, LaunchpadMK3.OUTPUT_NAME)) {
        return new LaunchpadMK3(options);
    }
        //return new LaunchpadMK3(options);

    throw new Error(`Did not find supported Launchpads among MIDI devices: ${inputNames.join(', ') || '(none)'}`);
    function canFindBoth(input, output) {
        return inputNames.some(n => n.match(input)) && outputNames.some(n => n.match(output));
    }
}
