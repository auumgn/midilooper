import { Style } from '../launchpads/base/ILaunchpad.js';
import { ILayer } from './ILayer.js';
/**
 * Implement one single layer
 *
 * This class is not exported from the library on purpose.
 */
export declare class Layer implements ILayer {
    readonly width: number;
    readonly height: number;
    readonly buffer: Style[];
    constructor(width: number, height: number);
    /**
     * Set a button color
     */
    set(x: number, y: number, style: Style): void;
    set(xy: [number, number], style: Style): void;
    /**
     * Read a button color
     */
    get(x: number, y: number): Style;
    get(xy: [number, number]): Style;
    allOff(): void;
    private index;
}
