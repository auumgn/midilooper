import { autoDetect, colorHelpers } from './launchpad.js/index.js';
import { findDevice, onExit } from './launchpad.js/utils.js';
import { MidiLooper } from './launchpad.js/launchpads/MK3/MidiLooper.js';
import midi from 'midi';
const myArgs = process.argv.slice(2);
export let debug = false;

if (myArgs.includes("debug")) {
  console.log("DEBUGGING");
  debug = true;
}
const { colorFromHex, colors } = colorHelpers;
let midiTracks = [];
export let result = [];
// upon connect the launchpad will be put into "Session" mode
let settingToggles = {};


export const lp = autoDetect();

const midiTrack1 = new MidiLooper({
  init: 81,
  color: colors.teal,
  name: "e352",
  enabled: true
});
midiTracks.push(midiTrack1);
midiTrack1.setup();

export const miniOutput = new midi.Output();
const outputPort = findDevice(/Focusrite USB MIDI/, miniOutput);
onExit(() => { miniOutput.closePort() });
miniOutput.openPort(outputPort);

const midiKeyboard = new midi.Input();
const inputPort = findDevice(/MINIMAX/, midiKeyboard);
onExit(() => { midiKeyboard.closePort() });
midiKeyboard.openPort(inputPort);
midiKeyboard.ignoreTypes(false, false, false);
console.log(midiKeyboard);
let keyboardIndex = 0;
midiKeyboard.on('message', (delta, note) => {
  miniOutput.sendMessage(note);
  for (var i = 0; i < midiTracks.length; i++) {
    if (midiTracks[i].armed && midiTracks[i].enabled) {
      keyboardIndex = 0;
      midiTracks[i].record(note);
    }
    if (midiTracks[i].recording) {
      let obj = {};
      obj.note = note;
      obj.delta = delta * 1000;
      midiTracks[i].loop[keyboardIndex] = obj;
      keyboardIndex += 1;
    }
  }
  /*if (lp.armedMidiLooperTracks) {
    lp.activeMidiLooperTracks.forEach(track => {
      if (lp.armedMidiLooperTracks[track]) {
        // MidiLooper.record()

        lp.armedMidiLooperTracks[track](note);        
      };
    })
  }*/
})

lp.input.on('message', (delta, note) => {
  // console.log('Raw message', note, delta);
  if (note[0] == 144 && note[2] == 0)
    if (lp.map[note[1]]) 
      lp.map[note[1]]();

  if (note[0] == 176 && note[2] == 0) 
    lp.map[note[1]]()
});

lp.once('ready', (name) => {
  console.log(`Connected to ${name}`);

});

lp.on('buttonDown', (note, value) => {

  if (note.nr % 10 == 9) {
    console.log(settingToggles);
    if (settingToggles[note.nr]) {
      console.log(settingToggles);
    } else {
      settingToggles[note.nr] = false;
      console.log(settingToggles);
    }
  }
  setTimeout(() => {
    if (note.nr in settingToggles) {
      settingToggles[note.nr] = true;
    }
  }, 200);
  // generate a random color on each button press
  const randHex = Math.floor(Math.random() * 16777215).toString(16);
  // we have the parse the colors to a special RGB value as
  // the launchpad does not go from 0-255 but from 0-63 for each color
  const color = colorFromHex(randHex);
  /* console.log(color);

  console.log(`Button pressed: ${note.nr}`);
  */
  //lp.setButtonColor(note, color);
});

lp.on('buttonUp', (note, value) => {
  if (note.nr in settingToggles) {
    delete settingToggles[note.nr];
  }
  //lp.setButtonColor(note, colors.off);
});