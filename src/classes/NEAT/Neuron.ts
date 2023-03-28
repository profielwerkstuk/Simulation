import { NodeType } from "./types.js"

import type { ActivationFunction } from "./types";
import type { Connection } from "./Connection";


export class Node {
	_value: number;
	innovation: number;
	_type: NodeType;
	id: string;
	replacedConnection: Connection;
	active: boolean = true;
	inputCount: number = 0;
	inputTimes: number = 0;

	constructor(innovation: number, type: NodeType, replacedConnection?: Connection, id?: string, value?: number) {
		this._value = value ? value : 0;
		this.innovation = innovation;
		this._type = type;
		this.id = id ? id : this.newID();
		this.replacedConnection = replacedConnection ?? {} as Connection;
	}

	setValue(value: number) {
		this._value = value;
		if (this._type !== NodeType.INPUT) this.inputTimes++;
	}

	get value() {
		return this._value;
	}

	get ID() {
		return this.id;
	}

	get type(): NodeType {
		return this._type;
	}

	get state() {
		return this.inputTimes === this.inputCount;
	}

	applyActivation(func: ActivationFunction) {
		this._value = func(this._value);
	}

	set nodeActivation(activation: boolean) {
		this.active = activation;
	}

	newID(): string {
		const S4 = () => {
			return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
		};
		return (`${S4() + S4()}-${S4() + S4()}`);
	}

	static getNodesByType(type: NodeType, nodes: Node[]): Node[] {
		let result: Node[] = [];
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].type === type) result.push(nodes[i]);
		}
		return result;
	}

	static nodeExists(innovation: number, nodeDB: Node[]): number | undefined {
		for (let i = 0; i < nodeDB.length; i++) {
			if (nodeDB[i].replacedConnection.innovation === innovation) return nodeDB[i].innovation;
		}
		return undefined;
	}
}