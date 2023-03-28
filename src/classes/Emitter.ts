import { EventEmitter } from 'node:events';
const globalEmitter = new EventEmitter();

export class Emitter {
	get emitter() {
		return globalEmitter;
	}
}