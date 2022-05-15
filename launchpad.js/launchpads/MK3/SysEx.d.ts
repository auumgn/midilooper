/**
 * Class to format SysEx messages into an array of numbers
 */
export declare class SysEx {
    static setProgrammerMode(enable: boolean): number[];
    /**
     * Set brightness between 0..1
     */
    static setBrightness(level: number): number[];
    static setButtonColors(...buttons: number[][]): number[];
}
