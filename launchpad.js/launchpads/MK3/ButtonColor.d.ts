/**
 * Specify the color of a single button
 */
export declare class ButtonColor {
    static staticColor(button: number, color: number): number[];
    static flash(button: number, colorA: number, colorB: number): number[];
    static pulse(button: number, color: number): number[];
    static rgb(button: number, r: number, g: number, b: number): number[];
}
