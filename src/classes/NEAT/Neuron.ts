import { NodeType } from "./types.js"

import type { ActivationFunction } from "./types";
import type { Connection } from "./Connection";


export class Node {
	private _type: NodeType;
	value: number;
	innovation: number;
	id: string;
	replacedConnection: Connection;
	active: boolean = true;
	inputCount: number = 0;
	inputTimes: number = 0;

	constructor(innovation: number, type: NodeType, replacedConnection?: Connection, id?: string, value?: number) {
		this.value = value ? value : 0;
		this.innovation = innovation;
		this._type = type;
		this.id = id ? id : this.newID();
		this.replacedConnection = replacedConnection ?? {} as Connection;
	}

	export() {
		return {
			type: this._type,
			// value: this.value,
			// innovation: this.innovation,
			id: this.id,
			active: true,
			// inputCount: this.inputCount,
			// inputTimes: this.inputTimes,
		};
	}
	
	static import(node: Node) {
		return new Node(node.innovation, node.type, node.replacedConnection, node.id, node.value);
	}

	setValue(value: number) {
		this.value = value;
		if (this._type !== NodeType.INPUT) this.inputTimes++;
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
		this.value = func(this.value);
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