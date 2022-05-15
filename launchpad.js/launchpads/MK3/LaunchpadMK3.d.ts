import { BaseLaunchpad, BaseLaunchpadOptions } from '../base/BaseLaunchpad.js';
import { Button, ButtonIn, ButtonStyle, PaletteColor, RgbColor } from '../base/ILaunchpad.js';
export declare type LaunchpadMK3Options = BaseLaunchpadOptions;
export declare class LaunchpadMK3 extends BaseLaunchpad {
    static readonly DEFAULT_DEVICE_NAME: RegExp;
    static readonly INPUT_NAME: RegExp;
    static readonly OUTPUT_NAME: RegExp;
    /**
     *
     * @param {LaunchpadMK3Options?} options
     */
    constructor(options?: LaunchpadMK3Options);
    /**
     * @inheritDoc
     */
    protected makeSysEx(payload: number[]): number[];
    /**
     * @inheritDoc
     */
    setButtonColor(button: ButtonIn, color: RgbColor | PaletteColor): void;
    /**
     * @inheritDoc
     */
    flash(button: ButtonIn, color: number, colorB?: number): void;
    /**
     * @inheritDoc
     */
    pulse(button: ButtonIn, color: number): void;
    /**
     * @inheritDoc
     */
    setButtons(...buttons: ButtonStyle[]): void;
    /**
     * @inheritDoc
     */
    allOff(): void;
    /**
     * @inheritDoc
     */
    parseButtonToXy(state: number, note: number): Button;
    /**
     * @inheritDoc
     */
    mapButtonFromXy(xy: ButtonIn): number;
}
