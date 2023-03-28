import { Node } from "./Neuron.js";
import { ConnectionStructure, Genome } from "./Genome";

class Connection {
	weight: number;
	active: boolean;
	input: Node;
	output: Node;
	innovation: number;

	constructor(input: Node, output: Node, innovation: number, weight?: number) {
		this.weight = weight ? weight : (Math.random() * 2) - 1;
		this.active = true;
		this.input = input;
		this.output = output;
		this.innovation = innovation;
	}

	randomizeWeight() {
		this.weight = (Math.random() * 2) - 1;
	}

	feedForward() {
		if (this.active) {
			this.output.setValue(this.output.getValue() + (this.input.getValue() * this.weight));
		}
	}

	getInputNode(): Node {
		return this.input;
	}

	getOutputNode(): Node {
		return this.output;
	}

	activateConnection() {
		this.active = true;
	}

	deactivateConnection() {
		this.active = false;
	}

	static isRecurrent(connection: Connection, genome: Genome): boolean {
		let node = connection.getInputNode();
		let stack = [connection];
		while (stack.length !== 0) {
			let connection = stack.shift();
			if (connection?.getOutputNode().getID() === node.getID()) return true;
			stack.push(
				...genome.connections.filter(gene => gene.getInputNode().getID() === connection?.getOutputNode().getID())
			);
		}
		return false;
	}

	static connectionExists(data: ConnectionStructure, connectionDB: Connection[]): number | undefined {
		for (let i = 0; i < connectionDB.length; i++) {
			if (data.fNode.innovation === connectionDB[i].getInputNode().innovation && data.sNode.innovation === connectionDB[i].getOutputNode().innovation) return connectionDB[i].innovation;
		}
		return undefined;
	}

	static inputConnectionsOfNode(node: Node, connections: Connection[]): Connection[] {
		let result: Connection[] = [];
		connections.forEach(connection => {
			if (connection.getInputNode().getID() === node.getID()) result.push(connection);
		});
		return result;
	}

	static outputConnectionsOfNode(node: Node, connections: Connection[]): Connection[] {
		let result: Connection[] = [];
		connections.forEach(connection => {
			if (connection.getOutputNode().getID() === node.getID()) result.push(connection);
		});
		return result;
	}
}

export { Connection };