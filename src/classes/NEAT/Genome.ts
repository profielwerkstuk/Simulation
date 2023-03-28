import { Node } from "./Neuron.js";
import { Connection } from "./Connection.js";

import type { NEAT } from "./NEAT.js";
import { ActivationFunction, ConnectionStructure, DistanceConfig, NodeType, StructureConfig } from "./types.js";

export class Genome {
	private _nodes: Node[] = [];
	connections: Connection[] = [];
	fitness: number = 0;
	activationFunction: ActivationFunction;

	constructor(config: StructureConfig) {
		this.activationFunction = config.activationFunction;

		for (let i = 0; i < config.in; i++) {
			this._nodes.push(new Node(i, NodeType.INPUT));
		}

		for (let i = config.in; i < config.in + config.hidden; i++) {
			this._nodes.push(new Node(i, NodeType.HIDDEN));
		}

		for (let i = config.in + config.hidden; i < config.in + config.hidden + config.out; i++) {
			this._nodes.push(new Node(i, NodeType.OUTPUT));
		}
	}

	get nodes() {
		return this._nodes;
	}

	get outputValues(): number[] {
		let outNodes = Node.getNodesByType(NodeType.OUTPUT, this._nodes);
		outNodes = outNodes.sort((a, b) => a.innovation < b.innovation ? -1 : 1);

		let result: number[] = [];
		outNodes.forEach(node => result.push(node.value));

		return result;
	}

	get genesByInnovation(): Connection[] {
		let result = [];
		for (let i = 0; i < this.connections.length; i++) {
			result[this.connections[i].innovation] = this.connections[i];
		}

		return result;
	}

	activate(input: number[]): number[] {
		for (let i = 0; i < this._nodes.length; i++) {
			this._nodes[i].inputCount = Connection.outputConnectionsOfirstNode(this._nodes[i], this.connections).length;
			this._nodes[i].inputTimes = 0;
			this._nodes[i]._value = 0;
		}

		let stack = Node.getNodesByType(NodeType.INPUT, this._nodes);
		stack = stack.sort((a, b) => a.innovation < b.innovation ? -1 : 1);
		for (let i = 0; i < stack.length; i++) {
			stack[i].setValue(input[i]);
		}

		while (stack.length) {
			let node = stack.splice(stack.indexOf(stack.filter(n => n.state)[0]), 1)[0];
			let connections = Connection.inputConnectionsOfirstNode(node, this.connections);

			connections.forEach(connection => {
				connection.feedForward();
				if (connection.outputNode.state) {
					connection.outputNode.inputTimes = 0;
					connection.outputNode.applyActivation(this.activationFunction);
					stack.push(connection.outputNode);
				}
			});
		}

		return this.outputValues;
	}

	hasConnection(innovation: number): Connection | null {
		for (let i = 0; i < this.connections.length; i++) {
			if (this.connections[i].innovation === innovation) return this.connections[i];
		}

		return null;
	}

	hasecondNode(innovation: number): Node | null {
		for (let i = 0; i < this._nodes.length; i++) {
			if (this._nodes[i].innovation === innovation) return this._nodes[i];
		}

		return null;
	}

	randomConnectionStructure(): ConnectionStructure | void {
		let tries = 0;
		let firstNode = this._nodes[Math.floor(Math.random() * this._nodes.length)];
		let secondNode = this._nodes[Math.floor(Math.random() * this._nodes.length)];

		while (firstNode.id === secondNode.id || (firstNode.type === NodeType.INPUT && secondNode.type === NodeType.INPUT) || (firstNode.type === NodeType.OUTPUT && secondNode.type === NodeType.OUTPUT)) {
			secondNode = this._nodes[Math.floor(Math.random() * this._nodes.length)];
			tries++;
		}

		if (!(tries > 20 || firstNode.type === NodeType.OUTPUT || secondNode.type === NodeType.INPUT)) return { firstNode: firstNode, secondNode: secondNode };
		else return;
	}

	addNode(rConnection: Connection, neat: NEAT): Node {
		let nInnovation = Node.nodeExists(rConnection.innovation, neat.nodeDB);

		if (nInnovation) {
			let existing = this.hasecondNode(nInnovation);
			if (!existing) {
				let newNode = new Node(nInnovation, NodeType.HIDDEN, rConnection);
				this._nodes.push(newNode);
				return newNode;
			}

			existing.nodeActivation = true;
			return existing;
		}

		neat.nodeInnovation++;
		let newNode = new Node(neat.nodeInnovation, NodeType.HIDDEN, rConnection);
		this._nodes.push(newNode);
		neat.nodeDB.push(newNode);
		return newNode;
	}

	addConnection(tNodes: ConnectionStructure, neat: NEAT): Connection | void {
		let innovation = Connection.connectionExists(tNodes, neat.connectionDB);
		if (innovation) {
			let existing = this.hasConnection(innovation);
			if (!existing) {
				let newConnection = new Connection(tNodes.firstNode, tNodes.secondNode, innovation);
				if (Connection.isRecurrent(newConnection, this)) {
					return;
				} else {
					this.connections.push(newConnection);
					return newConnection;
				}
			}
		} else {
			neat.connectionInnovation++;
			let newConnection = new Connection(tNodes.firstNode, tNodes.secondNode, neat.connectionInnovation);
			if (!Connection.isRecurrent(newConnection, this)) {
				neat.connectionDB.push(newConnection);
				this.connections.push(newConnection);
				return newConnection;
			} else {
				neat.connectionInnovation--;
				return;
			}
		}
	}

	mutateWeights(rate: number) {
		for (let i = 0; i < this.connections.length; i++) {
			if (Math.random() < rate) {
				this.connections[i].randomiseWeight();
			}
		}
	}

	mutateConnection(neat: NEAT) {
		let tNodes = this.randomConnectionStructure();
		if (tNodes) this.addConnection(tNodes, neat);
	}

	mutateDeactivateConnection() {
		let rConnection = this.connections[Math.floor(Math.random() * this.connections.length)];
		if (rConnection) rConnection.active = false;
	}

	mutateNode(neat: NEAT) {
		let rConnection = this.connections[Math.floor(Math.random() * this.connections.length)];

		if (rConnection) {
			if (!rConnection.active) return;
			rConnection.active = false;
			let inNode = rConnection.inputNode;
			let outNode = rConnection.outputNode;

			let node = this.addNode(rConnection, neat);
			let fConnection = { firstNode: inNode, secondNode: node };
			let sConnection = { firstNode: node, secondNode: outNode };
			this.addConnection(fConnection, neat);
			this.addConnection(sConnection, neat);
		}
	}

	mutateDeactivateNode() {
		let node = this._nodes[Math.floor(Math.random() * this._nodes.length)];
		if (node.replacedConnection) {
			node.nodeActivation = false;
			for (let i = 0; i < this.connections.length; i++) {
				if (this.connections[i].inputNode.ID === node.ID || this.connections[i].outputNode.ID === node.ID) this.connections[i].active = false;
			}
		}
	}

	addGene(gene: Connection) {
		let inNode = gene.inputNode;
		let outNode = gene.outputNode;

		let childInNode = this.hasecondNode(inNode.innovation);
		let childOutNode = this.hasecondNode(outNode.innovation);

		let inNodeConnection;
		let outNodeConnection;
		if (!childInNode) {
			inNodeConnection = new Node(inNode.innovation, inNode.type, inNode.replacedConnection);
			this._nodes.push(inNodeConnection);
		} else {
			inNodeConnection = childInNode;
			childInNode.nodeActivation = true;
		}

		if (!childOutNode) {
			outNodeConnection = new Node(outNode.innovation, outNode.type, outNode.replacedConnection);
			this._nodes.push(outNodeConnection);
		} else {
			outNodeConnection = childOutNode;
			childOutNode.nodeActivation = true;
		}

		let childConnection = this.hasConnection(gene.innovation);
		if (!childConnection) {
			let connection = new Connection(inNodeConnection, outNodeConnection, gene.innovation, gene.weight);
			if (!Connection.isRecurrent(connection, this)) this.connections.push(new Connection(inNodeConnection, outNodeConnection, gene.innovation, gene.weight));
		} else {
			childConnection.active = true;
		}
	}

	static crossover(genome1: Genome, genome2: Genome, config: StructureConfig): Genome {
		let child = new Genome(config);
		const [hFit, lFit] = [genome1, genome2].sort((a, b) => b.fitness - a.fitness);
		const hFitGenes = hFit.genesByInnovation;
		const lFitGenes = lFit.genesByInnovation;

		for (let i = 0; i < Math.max(hFitGenes.length, lFitGenes.length); i++) {
			if (hFitGenes[i] !== undefined && lFitGenes[i] !== undefined) {
				if (Math.random() < 0.5) {
					child.addGene(hFitGenes[i]);
				} else {
					child.addGene(lFitGenes[i]);
				}
			} else if (hFitGenes[i] !== undefined) {
				child.addGene(hFitGenes[i]);
			} else if (lFitGenes[i] !== undefined) {
				child.addGene(lFitGenes[i]);
			}
		}
		return child;
	}

	// Using variable names used in the original paper.
	static isCompatible(genome1: Genome, genome2: Genome, config: DistanceConfig): boolean {
		let genes1 = genome1.genesByInnovation;
		let genes2 = genome2.genesByInnovation;
		let E = Math.abs(genes1.length - genes2.length);
		let N = (Math.max(genes1.length, genes2.length) < 20) ? 1 : Math.max(genes1.length, genes2.length);
		let D = 0;

		for (let i = 0; i < Math.min(genes1.length, genes2.length); i++) {
			if ((genes1[i] === undefined && genes2[i] !== undefined) || (genes1[i] !== undefined && genes2[i] === undefined)) D++;
		}

		let W = 0;
		let count = 0;
		for (let i = 0; i < Math.min(genes1.length, genes2.length); i++) {
			if (genes1[i] !== undefined && genes2[i] !== undefined) {
				W += Math.abs(genes1[i].weight - genes2[i].weight);
				count++;
			}
		}
		W /= count;
		W = isNaN(W) ? 0 : W;
		return (((config.c1 * E) / N) + ((config.c2 * D) / N) + config.c3 * W) < config.compatibilityThreshold;
	}
}