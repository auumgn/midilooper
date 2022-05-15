/**
 * Specify the color of a single button
 */
export class ButtonColor {
    static staticColor(button, color) {
        return [0, button, color];
    }
    static flash(button, colorA, colorB) {
        return [1, button, colorB, colorA];
    }
    static pulse(button, color) {
        return [2, button, color];
    }
    static rgb(button, r, g, b) {
        // r, g, b in 0..127
        return [3, button, r, g, b];
    }
}
