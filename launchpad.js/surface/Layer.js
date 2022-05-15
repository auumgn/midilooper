import { range } from '../utils.js';
/**
 * Implement one single layer
 *
 * This class is not exported from the library on purpose.
 */
export class Layer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = [];
        this.allOff();
    }
    set(xOrXy, yOrStyle, style) {
        let xy;
        let theStyle;
        if (Array.isArray(xOrXy)) {
            xy = validateXy(xOrXy);
            if (typeof yOrStyle === 'number') {
                throw new Error(`Expected Style object as second argument, got: ${JSON.stringify(yOrStyle)}`);
            }
            theStyle = yOrStyle;
        }
        else {
            if (typeof xOrXy !== 'number' || typeof yOrStyle !== 'number') {
                throw new Error(`Expected only two arguments to be numbers, got: ${xOrXy},${yOrStyle}`);
            }
            if (!style) {
                throw new Error('Expected Style object as third argument');
            }
            xy = [xOrXy, yOrStyle];
            theStyle = style;
        }
        if (xy[0] < 0 || xy[0] >= this.width || xy[1] < 0 || xy[1] >= this.height) {
            return;
        }
        this.buffer[this.index(...xy)] = theStyle;
    }
    get(xOrXy, maybeY) {
        let xy;
        if (Array.isArray(xOrXy)) {
            xy = validateXy(xOrXy);
        }
        else {
            if (typeof xOrXy !== 'number' || typeof maybeY !== 'number') {
                throw new Error(`Expected first two arguments to be numbers, got: ${xOrXy},${maybeY}`);
            }
            xy = [xOrXy, maybeY];
        }
        if (xy[0] < 0 || xy[0] >= this.width || xy[1] < 0 || xy[1] >= this.height) {
            return { style: 'off' };
        }
        return this.buffer[this.index(...xy)];
    }
    allOff() {
        this.buffer.splice(0, this.buffer.length, ...range(this.width * this.height).map(() => ({ style: 'off' })));
    }
    index(x, y) {
        // Buffer is laid out in row-major order
        return y * this.width + x;
    }
}
function validateXy(xOrXy) {
    if (!Array.isArray(xOrXy) || xOrXy.length !== 2) {
        throw new Error(`Expecting [x, y] array, got: ${xOrXy}`);
    }
    return xOrXy;
}
