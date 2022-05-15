import EventEmitter from 'eventemitter3';
/**
 * base class for interacting with a launchpad<br>
 *   each sub class must close the port to the launchpad when the application is exited<br>
 *   to have a consistent event system across the project every subclass must implement the following events listed
 *
 * This class can be used to create your own launchpad implementations
 *
 * @event ready The API is ready to be used with the launchpad
 * @event rawMessage Messages from the launchpad are forwarded to this event
 * @event buttonDown A button on the launchpad has been pressed
 * @event buttonUp A button on the launchpad has been released
 *
 * @abstract
 */
// cuz this is an abstract class
/* eslint-disable no-unused-vars */
export default class BaseLaunchpad extends EventEmitter {
}
