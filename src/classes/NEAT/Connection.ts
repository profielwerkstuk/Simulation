import type { Node } from "./Neuron";
import type { Genome } from "./Genome";
import type { ConnectionStructure } from "./types";

export class Connection {
	active = true;

	constructor(
		private input: Node,
		private output: Node,
		public innovation: number,
		public weight: number = (Math.random() * 2) - 1
	) { }

	randomiseWeight = () => this.weight = (Math.random() * 2) - 1;

	feedForward = () => {
		if (this.active) this.output.setValue(this.output.value + (this.input.value * this.weight));
	}

	get inputNode() {
		return this.input;
	}

	get outputNode() {
		return this.output;
	}

	static isRecurrent(connection: Connection, genome: Genome): boolean {
		let node = connection.inputNode;
		let stack = [connection];

		while (stack.length !== 0) {
			let connection = stack.shift();
			if (connection?.output.ID === node.ID) return true;
			stack.push(
				...genome.connections.filter(gene => gene.inputNode.ID === connection?.outputNode.ID)
			);
		}

		return false;
	}

	static connectionExists(data: ConnectionStructure, connectionDB: Connection[]): number | null {
		for (let i = 0; i < connectionDB.length; i++) {
			if (data.fNode.innovation === connectionDB[i].inputNode.innovation && data.sNode.innovation === connectionDB[i].outputNode.innovation) return connectionDB[i].innovation;
		}

		return null;
	}

	static inputConnectionsOfNode(node: Node, connections: Connection[]): Connection[] {
		let result: Connection[] = [];
		connections.forEach(connection => {
			if (connection.inputNode.ID === node.ID) result.push(connection);
		});

		return result;
	}

	static outputConnectionsOfNode(node: Node, connections: Connection[]): Connection[] {
		let result: Connection[] = [];
		connections.forEach(connection => {
			if (connection.outputNode.ID === node.ID) result.push(connection);
		});

		return result;
	}
}