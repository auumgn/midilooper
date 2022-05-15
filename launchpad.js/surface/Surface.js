import { allXy } from '../utils.js';
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
export class Surface {
    constructor(lp) {
        this.lp = lp;
        /**
         * The width of the layer
         */
        this.width = 9;
        /**
         * The height of the layer
         */
        this.height = 9;
        this.currentDisplay = new Layer(this.width, this.height);
        this.layer0 = new Layer(this.width, this.height);
        this.layers = new Map();
        lp.allOff();
        this.layers.set(0, this.layer0);
        // Caching this array saves recalculating it every frame
        this.coords = allXy(this.width, this.height);
    }
    /**
     * Create or return the layer at the given index.
     *
     * Layer number must be a natural number.
     *
     * @param {number} i The layer number to access
     */
    layer(i) {
        if (i < 0 || Math.floor(i) !== i) {
            throw new Error(`Layer number must be a natural number, got: ${i}`);
        }
        let layer = this.layers.get(i);
        if (!layer) {
            layer = new Layer(this.width, this.height);
            this.layers.set(i, layer);
        }
        return layer;
    }
    /**
     * Remove a layer with the given number
     *
     * Layer 0 cannot be removed.
     *
     * @param {number} i The layer number to remove
     */
    removeLayer(i) {
        if (i < 0 || Math.floor(i) !== i) {
            throw new Error(`Layer number must be a natural number, got: ${i}`);
        }
        if (i === 0) {
            throw new Error('Cannot remove layer 0');
        }
        this.layers.delete(i);
    }
    /**
     * Send the current display buffer to the Launchpad
     */
    update() {
        const newDisplay = this.flat();
        const updates = [];
        for (const xy of this.coords) {
            const cur = this.currentDisplay.get(xy);
            const updated = newDisplay.get(xy);
            if (!sameStyle(cur, updated)) {
                updates.push({
                    button: xy,
                    style: updated,
                });
            }
        }
        this.lp.setButtons(...updates);
        this.currentDisplay = newDisplay;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    set(x, y, style) {
        this.layer0.set(x, y, style);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    get(x, y) {
        return this.layer0.get(x, y);
    }
    /**
     * Set all buttons to off (or transparent)
     */
    allOff() {
        this.layer0.allOff();
    }
    /**
     * Return a Layer based off of a flattened representation of all other layers
     */
    flat() {
        const ret = new Layer(this.width, this.height);
        // Get all layers, sort them by number
        const entries = Array.from(this.layers.entries());
        entries.sort((a, b) => a[0] - b[0]);
        for (const [, layer] of entries) {
            for (const xy of this.coords) {
                const style = layer.get(xy);
                // Only copy non-off styles
                if (style.style !== 'off') {
                    ret.set(xy, style);
                }
            }
        }
        return ret;
    }
}
function sameStyle(a, b) {
    switch (a.style) {
        case 'off':
            return b.style === 'off';
        case 'palette':
            return b.style === 'palette' && a.color === b.color;
        case 'rgb':
            return b.style === 'rgb' && a.rgb[0] === b.rgb[0] && a.rgb[1] === b.rgb[1] && a.rgb[2] === b.rgb[2];
        case 'flash':
            return b.style === 'flash' && a.color === b.color && a.colorB === b.colorB;
        case 'pulse':
            return b.style === 'pulse' && a.color === b.color;
        default:
            throw new Error('Unrecognized style');
    }
}
