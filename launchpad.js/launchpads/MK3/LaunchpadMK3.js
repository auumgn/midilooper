import { range } from '../../utils.js';
import { BaseLaunchpad, isRgbColor, validatePaletteColor, validateRgbColor } from '../base/BaseLaunchpad.js';
import { isButton } from '../base/ILaunchpad.js';
import { ButtonColor } from './ButtonColor.js';
import { SysEx } from './SysEx.js';
export class LaunchpadMK3 extends BaseLaunchpad {
    /**
     *
     * @param {LaunchpadMK3Options?} options
     */
    constructor(options) {
        var _a;
        super(options);
        // The LP advertises both MIDI and DAW interfaces, but only
        // the MIDI interface reports button presses.
        this.openMidiDevice(LaunchpadMK3.INPUT_NAME, LaunchpadMK3.OUTPUT_NAME);
        this.setupMessageHandler();
        // Switch to programmer mode mode (full control of all buttons)
        this.sendSysEx(...SysEx.setProgrammerMode(true));
        this.sendSysEx(...SysEx.setBrightness(0));
    }
    /**
     * @inheritDoc
     */
    makeSysEx(payload) {
        return [240, 0, 32, 41, 2, 12, ...payload, 247];
    }
    /**
     * @inheritDoc
     */
    setButtonColor(button, color) {
        /*if (typeof color !== 'number' && (!Array.isArray(color) || color.length !== 3)) {
            throw new Error('Invalid color settings supplied');
        }*/
        this.output.sendMessage([144,button,color]);

        /* OG sysex code
        const buttonMapped = this.mapButtonFromXy(button);
        if (isRgbColor(color)) {
            const [r, g, b] = scaleRgbMk3(color);
            this.sendSysEx(...SysEx.setButtonColors(ButtonColor.rgb(buttonMapped, r, g, b)));
        }
        else {
            this.sendSysEx(...SysEx.setButtonColors(ButtonColor.staticColor(buttonMapped, validatePaletteColor(color))));
        }*/
    }
    /**
     * @inheritDoc
     */
    flash(button, color, colorB = 0) {
        const buttonMapped = this.mapButtonFromXy(button);
        this.sendSysEx(...SysEx.setButtonColors(ButtonColor.flash(buttonMapped, validatePaletteColor(color), validatePaletteColor(colorB))));
    }
    /**
     * @inheritDoc
     */
    pulse(button, color) {
        this.output.sendMessage([146,button,color]);
        /*const buttonMapped = this.mapButtonFromXy(button);
        this.sendSysEx(...SysEx.setButtonColors(ButtonColor.pulse(buttonMapped, validatePaletteColor(color))));*/
    }
    /**
     * @inheritDoc
     */
    setButtons(...buttons) {
        if (buttons.length === 0) {
            return;
        }
        this.sendSysEx(...SysEx.setButtonColors(...buttons.map((b) => {
            var _a;
            const button = this.mapButtonFromXy(b.button);
            switch (b.style.style) {
                case 'palette':
                    return ButtonColor.staticColor(button, validatePaletteColor(b.style.color));
                case 'off':
                    return ButtonColor.staticColor(button, 0);
                case 'rgb':
                    return ButtonColor.rgb(button, ...scaleRgbMk3(b.style.rgb));
                case 'flash':
                    return ButtonColor.flash(button, validatePaletteColor(b.style.color), validatePaletteColor((_a = b.style.colorB) !== null && _a !== void 0 ? _a : 0));
                case 'pulse':
                    return ButtonColor.pulse(button, validatePaletteColor(b.style.color));
                default:
                    throw new Error('Missing style');
            }
        })));
    }
    /**
     * @inheritDoc
     */
    allOff() {
        this.setButtons(...range(9).flatMap(y => range(9).map(x => ({
            button: [x, y],
            // eslint-disable-next-line object-property-newline
            style: { style: 'palette', color: 0 },
        }))));
    }
    /**
     * @inheritDoc
     */
    parseButtonToXy(state, note) {
        const row = Math.floor(note / 10);
        const col = (note - 1) % 10;
        return {
            nr: note,
            xy: [col, 9 - row],
        };
    }
    /**
     * @inheritDoc
     */
    mapButtonFromXy(xy) {
        if (isButton(xy)) {
            return xy.nr;
        }
        if (typeof xy === 'number') {
            return xy;
        }
        const [x, y] = xy;
        return (9 - y) * 10 + x + 1;
    }
}
LaunchpadMK3.DEFAULT_DEVICE_NAME = /^Launchpad.*MK3 MIDI/;
LaunchpadMK3.INPUT_NAME = /LPMAX/; 
LaunchpadMK3.OUTPUT_NAME = /MIDIOUT2 \(LPX MIDI\)/;
function scaleRgbMk3(color) {
    return validateRgbColor(color).map(v => Math.round(v * 127));
}
