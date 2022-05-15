import midi from 'midi';
export declare const NORMAL_NOTE = 144;
export declare const CONTROL_NOTE = 176;
export declare function onExit(fn: () => void): void;
export declare function allDeviceNames(chan: midi.Input): string[];
export declare function findDevice(regex: RegExp, midiInput: midi.Input): number;
/**
 * Return the numbers [0..n-1]
 */
export declare function range(n: number): number[];
/**
 * Return all (x, y) coordinates
 */
export declare function allXy(width: number, height: number): Array<[number, number]>;
