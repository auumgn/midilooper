import { Style } from '../launchpads/base/ILaunchpad.js';
import { ILayer } from './ILayer.js';
/**
 * Helper routines for drawing on a layer
 */
export declare class Drawing {
    private readonly layer;
    constructor(layer: ILayer);
    /**
     * Draw a bitmap on the layer at the given coordinates
     *
     * The bitmap is specified as a list of strings. Every line is drawn on a new
     * row, starting a given (x, y) coordinate pair.  Characters in the list of
     * strings can be mapped to button styles.
     *
     * @param {number[]} xy The coordinate of the top-left button
     * @param {string[]} lines Sequence of button colors to draw, every string is drawn on a new row with colors from the styleMap parameter
     * @param {Record<string, Style>} styleMap Map of characters to button styles
     */
    bitmap(xy: [number, number], lines: string[], styleMap: Record<string, Style>): void;
    /**
     * Move all buttons on this layer by the given amount
     *
     * @param {number[]} delta Shift all colors by the given (x, y) amount
     */
    shift(delta: [number, number]): void;
    /**
     * Draw a rectangle at the given location
     *
     * @param {number[]} xy The (x, y) coordinates of the top-left corner of the rectangle
     * @param {number[]} wh The width anad height of the rectangle. Cannot be negative.
     * @param {Style} style The button style to paint all buttons in the rectangle
     */
    rect(xy: [number, number], wh: [number, number], style: Style): void;
}
