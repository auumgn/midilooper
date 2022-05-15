import { ILaunchpad, Style } from '../launchpads/base/ILaunchpad.js';
import { ILayer } from './ILayer.js';
import { Layer } from './Layer.js';
/**
 * Represents the visible Surface of a Launchpad
 *
 * Allows read/write access to the currently displayed buttons
 * on the Launchpad. At any point, the in-memory display buffer can
 * be written to the Launchpad. Commands will only be sent to
 * render the difference.
 *
 * Supports multiple layers, so that it is easy to show temporary colors
 * (for example, while a button is being held down) and return to the
 * original color unchanged afterwards. Setting colors on the Surface
 * directly is the same as setting them on layer 0.
 *
 * Note that on higher layers, palette color 0 and 'off' are not the same: 'off'
 * will make the underlying button show through, while palette color 0 will make
 * the button actively turn off.
 *
 * There should only be one surface in use for any Launchpad
 * at a given time.
 */
export declare class Surface implements ILayer {
    private readonly lp;
    /**
     * The width of the layer
     */
    readonly width = 9;
    /**
     * The height of the layer
     */
    readonly height = 9;
    private currentDisplay;
    private readonly layer0;
    private readonly layers;
    private readonly coords;
    constructor(lp: ILaunchpad);
    /**
     * Create or return the layer at the given index.
     *
     * Layer number must be a natural number.
     *
     * @param {number} i The layer number to access
     */
    layer(i: number): Layer;
    /**
     * Remove a layer with the given number
     *
     * Layer 0 cannot be removed.
     *
     * @param {number} i The layer number to remove
     */
    removeLayer(i: number): void;
    /**
     * Send the current display buffer to the Launchpad
     */
    update(): void;
    /**
     * Set the style (color) of a single button
     *
     * @param {number} x The x coordinate
     * @param {number} y The y coordinate
     * @param {number[]} xy The x and y coordinates
     * @param {Style} style The style of the button
     */
    set(x: number, y: number, style: Style): void;
    set(xy: [number, number], style: Style): void;
    /**
     * Return the style (color) of a single button
     *
     * @param {number} x The x coordinate
     * @param {number} y The y coordinate
     * @param {number[]} xy The x and y coordinates
     * @returns {Style} The style of the button
     */
    get(x: number, y: number): Style;
    get(xy: [number, number]): Style;
    /**
     * Set all buttons to off (or transparent)
     */
    allOff(): void;
    /**
     * Return a Layer based off of a flattened representation of all other layers
     */
    private flat;
}
