/**
 * Class to format SysEx messages into an array of numbers
 */
export class SysEx {
    static setProgrammerMode(enable) {
        return [14, enable ? 1 : 0];
    }
    /**
     * Set brightness between 0..1
     */
    static setBrightness(level) {
        return [8, Math.round(level * 127)];
    }
    static setButtonColors(...buttons) {
        return [3, ...Array.prototype.concat([], ...buttons)];
    }
}
