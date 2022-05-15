import { BaseLaunchpad, BaseLaunchpadOptions } from '../base/BaseLaunchpad.js';
import { Button, ButtonIn, ButtonStyle, PaletteColor, RgbColor } from '../base/ILaunchpad.js';
export declare type LaunchpadMK2Options = BaseLaunchpadOptions;
export declare class LaunchpadMK2 extends BaseLaunchpad {
    static readonly DEFAULT_DEVICE_NAME: RegExp;
    /**
     * @param {LaunchpadMK2Options?} options
     */
    constructor(options?: LaunchpadMK2Options);
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
    flash(button: ButtonIn, color: number): void;
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
