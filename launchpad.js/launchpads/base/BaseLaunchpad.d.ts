import EventEmitter from 'eventemitter3';
import midi from 'midi';
import { Button, ButtonIn, ButtonStyle, EventTypes, ILaunchpad, PaletteColor, RgbColor, Style } from './ILaunchpad.js';
export interface BaseLaunchpadOptions {
    /**
     * Regexp to use to find the Launchpad MIDI device
     *
     * By default, will use a regexp that is appropriate
     * for the Launchpad version you selected.
     */
    readonly deviceName?: RegExp;
    /**
     * Switch on debug mode
     *
     * Will log more messages to the console.
     *
     * @default false
     */
    readonly debug?: boolean;
}
/**
 * Shared implementation between multiple Launchpad types
 *
 * This class can be used to create your own launchpad implementations.
 *
 * Each sub class must close the port to the launchpad when the application is exited
 * to have a consistent event system across the project every subclass must implement the following events listed.
 */
export declare abstract class BaseLaunchpad extends EventEmitter<EventTypes> implements ILaunchpad {
    protected readonly options: BaseLaunchpadOptions;
    protected readonly input: midi.Input;
    protected readonly output: midi.Output;
    protected open: boolean;
    constructor(options?: BaseLaunchpadOptions);
    /**
     * @inheritDoc
     */
    abstract setButtonColor(button: ButtonIn, color: RgbColor | PaletteColor): void;
    /**
     * @inheritDoc
     */
    abstract flash(button: ButtonIn, color: number, color2?: number): void;
    /**
     * @inheritDoc
     */
    abstract pulse(button: ButtonIn, color: number): void;
    /**
     * @inheritDoc
     */
    abstract allOff(): void;
    /**
     * @inheritDoc
     */
    abstract setButtons(...buttons: ButtonStyle[]): void;
    /**
     * Make a SysEx message from the given payload
     *
     * (Wrap the payload with the necessary bytes)
     */
    protected abstract makeSysEx(payload: number[]): number[];
    /**
     * Send a midi message to the launchpad
     *
     * @param {number} message the message to send to the launchpad
     */
    protected send(message: number[]): void;
    protected send(...message: number[]): void;
    /**
     * Send a System Exclusive message to the launchpad.
     *
     * The method will add the necessary header and footer.
     *
     * @param {number} message The 6th byte + 4 values for the SysEx message
     */
    protected sendSysEx(message: number[]): void;
    protected sendSysEx(...message: number[]): void;
    /**
     * Find and initialite the MIDI device matching the given regex
     *
     * Call this from the subclass constructors.
     */
    protected openMidiDevice(input: RegExp, output: RegExp): void;
    protected logDebug(...message: any[]): void;
    protected setupMessageHandler(): void;
    private internalMessageHandler;
    /**
     * Closes the connection with the launchpad
     */
    close(): void;
    /**
     * @inheritDoc
     */
    eventNames(): Array<EventEmitter.EventNames<EventTypes>>;
    /**
     * Map the Launchpad output to a Button structure
     */
    abstract parseButtonToXy(state: number, note: number): Button;
    /**
     * Determine the button number from any of the possible ways to specify a button
     */
    abstract mapButtonFromXy(xy: ButtonIn): number;
}
/**
 * Make sure a color is a valid color in the palette
 */
export declare function validatePaletteColor(color: PaletteColor): PaletteColor;
/**
 * Make sure a color is a valid RGB color
 */
export declare function validateRgbColor(color: RgbColor): RgbColor;
export declare function isRgbColor(color: PaletteColor | RgbColor): color is RgbColor;
export declare function groupByStyle(styles: ButtonStyle[]): GroupedStyles;
export declare type ButtonWithStyle<K extends string> = {
    readonly button: ButtonIn;
    readonly style: Extract<Style, {
        style: K;
    }>;
};
export interface GroupedStyles {
    readonly palette: Array<ButtonWithStyle<'palette'>>;
    readonly rgb: Array<ButtonWithStyle<'rgb'>>;
    readonly flash: Array<ButtonWithStyle<'flash'>>;
    readonly pulse: Array<ButtonWithStyle<'pulse'>>;
    readonly off: Array<ButtonWithStyle<'off'>>;
}
