import { IActivationFunction } from "./ActivationFunctions";
import { Connection } from "./Connection";

enum NodeType {
	INPUT = "INPUT",
	HIDDEN = "HIDDEN",
	OUTPUT = "OUTPUT"
}

class Node {

	value: number;
	innovation: number;
	type: NodeType;
	id: string;
	replacedConnection: Connection;
	active: boolean = true;
	inputCount: number = 0;
	inputTimes: number = 0;

	constructor(innovation: number, type: NodeType, replacedConnection?: Connection, id?: string, value?: number) {
		this.value = value ? value : 0;
		this.innovation = innovation;
		this.type = type;
		this.id = id ? id : this.newID();
		this.replacedConnection = replacedConnection ?? {} as Connection;
	}

	setValue(value: number) {
		this.value = value;
		if (this.type !== NodeType.INPUT) this.inputTimes++;
	}

	getValue(): number {
		return this.value;
	}

	getID(): string {
		return this.id;
	}

	getType(): NodeType {
		return this.type;
	}

	applyActivation(func: IActivationFunction) {
		this.value = func(this.value);
	}

	setNodeActivation(activation: boolean) {
		this.active = activation;
	}

	getState(): boolean {
		return this.inputTimes === this.inputCount;
	}

	newID(): string {
		const S4 = () => {
			return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
		};
		return (`${S4()+S4()}-${S4()+S4()}`);
	}

	static getNodesByType(type: NodeType, nodes: Node[]): Node[] {
		let result: Node[] = [];
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].getType() === type) result.push(nodes[i]);
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

export { Node, NodeType };