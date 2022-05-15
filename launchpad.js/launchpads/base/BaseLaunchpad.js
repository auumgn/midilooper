import EventEmitter from 'eventemitter3';
import midi from 'midi';
import { findDevice, onExit } from '../../utils.js';
/**
 * Shared implementation between multiple Launchpad types
 *
 * This class can be used to create your own launchpad implementations.
 *
 * Each sub class must close the port to the launchpad when the application is exited
 * to have a consistent event system across the project every subclass must implement the following events listed.
 */
export class BaseLaunchpad extends EventEmitter {
    constructor(options = {}) {
        super();
        this.options = options;
        this.input = new midi.Input();
        this.output = new midi.Output();
        this.open = false;
        this.map = {};
        this.activeMidiLooperTracks = [];
        this.armedMidiLooperTracks = {};
        this.recordingMidiLooperTracks = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send(...message) {
        this.logDebug('Sending midi message', message);
        this.output.sendMessage(Array.isArray(message[0]) ? message[0] : message);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendSysEx(...message) {
        const arrayParsed = Array.isArray(message[0]) ? message[0] : message;
        const sysExMessage = this.makeSysEx(arrayParsed);
        this.logDebug('Sending sysExMessage', sysExMessage);
        this.output.sendMessage(sysExMessage);
    }
    /**
     * Find and initialite the MIDI device matching the given regex
     *
     * Call this from the subclass constructors.
     */
    openMidiDevice(input, output) {
        const [inputPort, outputPort] = [
            findDevice(input, this.input),
            findDevice(output, this.output),
        ];
        onExit(() => this.close());
        this.output.openPort(outputPort);
        this.input.openPort(inputPort);
        this.open = true;
        process.nextTick(() => {
            this.emit('ready', this.input.getPortName(inputPort));
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logDebug(...message) {
        if (this.options.debug) {
            console.log('[Launchpad Debug]', ...message);
        }
    }
    setupMessageHandler() {
        this.input.on('message', (deltaTime, message) => {
            this.logDebug(`m: ${message} d: ${deltaTime}`);
            this.internalMessageHandler(message);
        });
    }
    internalMessageHandler(message) {
        this.emit('rawMessage', message);
        const [state, note, value] = message;
        const button = this.parseButtonToXy(state, note);
        const event = Boolean(value) ? 'buttonDown' : 'buttonUp';
        this.emit(event, button);
    }
    /**
     * Closes the connection with the launchpad
     */
    close() {
        if (!this.open) {
            return;
        }
        this.logDebug('Closing ports');
        this.allOff();
        this.input.closePort();
        this.output.closePort();
        this.input.removeAllListeners('message');
        this.open = false;
    }
    /**
     * @inheritDoc
     */
    eventNames() {
        return [
            'ready',
            'rawMessage',
            'buttonDown',
            'buttonUp',
        ];
    }
}
/**
 * Make sure a color is a valid color in the palette
 */
export function validatePaletteColor(color) {
    if (color < 0 || color > 127 || Math.floor(color) !== color) {
        throw new Error(`Not a valid palette color: ${color} (must be an int between 0..127)`);
    }
    return color;
}
/**
 * Make sure a color is a valid RGB color
 */
export function validateRgbColor(color) {
    if (color.some(value => value > 1 || value < 0)) {
        throw new Error(`RGB color is invalid: ${color}, values must be between 0..1. (use colors.colorFromRGB as a helper)`);
    }
    return color;
}
export function isRgbColor(color) {
    return Array.isArray(color);
}
export function groupByStyle(styles) {
    const ret = {
        flash: [],
        palette: [],
        pulse: [],
        rgb: [],
        off: [],
    };
    for (const obj of styles) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-extra-parens
        ret[obj.style.style].push(obj);
    }
    return ret;
}
