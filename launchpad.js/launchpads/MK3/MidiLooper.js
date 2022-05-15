import { colorHelpers } from '../../index.js';
import { lp, debug, miniOutput } from '../../../looper.js';

const { red, off } = colorHelpers.colors;

export class MidiLooper {
  constructor(options = { enabled: false }) {
    this.init = options.init;
    this.recBtn = this.init;
    this.playBtn = this.init + 1;
    this.enableBtn = this.init + 8
    this.color = options.color;
    this.enabled = options.enabled;
    this.recording = false;
    this.armed = false;
    this.playback = false;
    this.loop = {};
    this.loopIndex = 0;
    this.previousDelta = 0;
    this.loopLength;
  }

  setup() {
    for (let a = this.init; a < this.init + 4; a++) {
      lp.setButtonColor(a, this.color);
    }
    if (this.enabled) {
      lp.setButtonColor(this.enableBtn, this.color);
    }
    lp.map[this.recBtn] = () => { return this.record() };
    lp.map[this.playBtn] = () => { return this.stop() };
    lp.map[this.enableBtn] = () => { return this.enable() };
  }

  record(note = false) {
    if (this.recording || (this.armed && !note)) {
      // stop recording
      if (debug) console.log(`${this.init}: stopping recording`);
      this.armed = false;
      this.playback = true;
      this.loopIndex = 0;
      if (this.recording) {
        this.recording = false;
        console.log(this.loop);
        this.loopLength = new Date() - this.loopLength;
        let newDeltas = Object.keys(this.loop).map(e => this.loop[e].delta);
        newDeltas.push(newDeltas.shift());
        let i = 0, agg = 0;
        for (const key in this.loop) {
          this.loop[key].delta = newDeltas[i];
          if (i == newDeltas.length-1) {
            this.loop[key].delta = this.loopLength - agg;
          } else {
            agg += newDeltas[i];
          }
          i += 1;
        }
        console.log(this.loop);
        this.playLoop();
        lp.setButtonColor(this.recBtn, this.color);
      }
    } else {
      if (this.armed && note) {
        // record
        this.loop = {};
        this.loopLength = new Date();
        if (debug) console.log(`${this.init}: recording`);
        this.recording = true;
        lp.pulse(this.recBtn, red);
      } else {
        // pre-record
        if (debug) console.log(`${this.init}: armed for recording`);
        lp.setButtonColor(this.recBtn, red);
      }
      this.armed = !this.armed;
    }
  }

  playLoop() {
    //if (debug) console.log(`${this.init}: play()`);
    if (this.playback) {
      let {note, delta} = this.loop[this.loopIndex];
      miniOutput.sendMessage(note)
      lp.pulse(this.playBtn, this.color);
      let length = Object.keys(this.loop).length;
      console.log(note, delta);

      this.loopIndex += 1;

      if (this.loopIndex == length) {
        this.loopIndex = 0;
        console.log("last one");
      }
      setTimeout(() => {
            this.playLoop();
      }, delta)
    }
  }

  stop() {
    if (debug) console.log(`${this.init}: stop()`);
    this.playback = false;
    lp.setButtonColor(this.playBtn, this.color);
  }

  toggleSettings() {
    if (debug) console.log(`${this.init}: toggleSettings()`);
  }

  enable() {
    if (debug) console.log(`${this.init}: enable()`);
    this.enabled = !this.enabled;
    this.enabled ? lp.setButtonColor(this.enableBtn, this.color) : lp.setButtonColor(this.enableBtn, off);
  }
}
