import { RgbColor } from './launchpads/base/ILaunchpad.js';
export declare const defaultColors: Record<string, RgbColor>;
export declare const colors: Record<string, RgbColor>;
/**
 * How many Palette colors there are
 */
export declare const PALETTE_SIZE = 64;
export declare function scaleBetween(unscaledNum: number, minAllowed: number, maxAllowed: number, min: number, max: number): number;
/**
 * Converts an rgb array to an rgb array that the launchpad can accept
 *
 * @param {number[]} rgb the rgb value to convert (on a range from 0..255)
 * @returns {number[]} a color array that the launchpad can accept
 */
export declare function colorFromRGB(rgb: [number, number, number]): RgbColor;
/**
 * Converts a hex string to an rgb color that the launchpad can accept
 *
 * @param {string} hex the color
 * @returns {number[]} a color array that the launchpad can accept
 */
export declare function colorFromHex(hex: string): RgbColor;
