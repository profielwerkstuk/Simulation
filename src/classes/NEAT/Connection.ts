import type { Node } from "./Neuron";
import type { Genome } from "./Genome";
import type { ConnectionStructure } from "./types";

export class Connection {
	active = true;

	constructor(
		private input: Node,
		private output: Node,
		public innovation: number,
		public weight: number = (Math.random() * 2) - 1,
	) { }

	export() {
		return {
			inputNode: this.input.export(),
			outputNode: this.output.export(),
			weight: this.weight,
			active: this.active,
		};
	}

	static import(connection: Connection, inputNode: Node, outputNode: Node) {
		return new Connection(inputNode, outputNode, connection.innovation, connection.weight);
	}

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
			if (connection?.output.id === node.id) return true;
			stack.push(
				...genome.connections.filter(gene => gene.inputNode.id === connection?.outputNode.id)
			);
		}

		return false;
	}

	static connectionExists(data: ConnectionStructure, connectionDB: Connection[]): number | null {
		for (let i = 0; i < connectionDB.length; i++) {
			if (data.firstNode.innovation === connectionDB[i].inputNode.innovation && data.secondNode.innovation === connectionDB[i].outputNode.innovation) return connectionDB[i].innovation;
		}

		return null;
	}

	static inputConnectionsOfirstNode(node: Node, connections: Connection[]): Connection[] {
		let result: Connection[] = [];
		connections.forEach(connection => {
			if (connection.inputNode.id === node.id) result.push(connection);
		});

		return result;
	}

	static outputConnectionsOfirstNode(node: Node, connections: Connection[]): Connection[] {
		let result: Connection[] = [];
		connections.forEach(connection => {
			if (!connection.outputNode) console.log(connection);
			if (connection.outputNode.id === node.id) result.push(connection);
		});

		return result;
	}
}