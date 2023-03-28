import { Node, NodeType } from "./Neuron.js";
import { Connection } from "./Connection.js";
import { IActivationFunction } from "./ActivationFunctions.js";
import { NEAT, DistanceConfig } from "./NEAT.js";

interface StructureConfig {
	in: number;
	hidden: number;
	out: number;
	activationFunction: IActivationFunction;
}

interface ConnectionStructure {
	fNode: Node,
	sNode: Node,
}

class Genome {
	nodes: Node[] = [];
	connections: Connection[] = [];
	fitness: number = 0;
	config: StructureConfig;
	activationFunction: IActivationFunction;

	constructor(config: StructureConfig) {
		this.activationFunction = config.activationFunction;
		this.config = config;
		for (let i = 0; i < config.in; i++) {
			this.nodes.push(new Node(i, NodeType.INPUT));
		}

		for (let i = config.in; i < config.in + config.hidden; i++) {
			this.nodes.push(new Node(i, NodeType.HIDDEN));
		}

		for (let i = config.in + config.hidden; i < config.in + config.hidden + config.out; i++) {
			this.nodes.push(new Node(i, NodeType.OUTPUT));
		}
	}

	activate(input: number[]): number[] {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].inputCount = Connection.outputConnectionsOfNode(this.nodes[i], this.connections).length;
			this.nodes[i].inputTimes = 0;
			this.nodes[i].value = 0;
		}

		let stack = Node.getNodesByType(NodeType.INPUT, this.nodes);
		stack = stack.sort((a, b) => a.innovation < b.innovation ? -1 : 1);
		for (let i = 0; i < stack.length; i++) {
			stack[i].setValue(input[i]);
		}

		while (stack.length) {
			let node = stack.splice(stack.indexOf(stack.filter(n => n.getState())[0]), 1)[0];
			let connections = Connection.inputConnectionsOfNode(node, this.connections);
			connections.forEach(connection => {
				connection.feedForward();
				if (connection.getOutputNode().getState()) {
					connection.getOutputNode().inputTimes = 0;
					connection.getOutputNode().applyActivation(this.activationFunction);
					stack.push(connection.getOutputNode());
				}
			});
		}

		return this.getOutputValues();
	}

	getNodes() {
		return this.nodes;
	}

	getOutputValues(): number[] {
		let oNodes = Node.getNodesByType(NodeType.OUTPUT, this.nodes);
		oNodes = oNodes.sort((a, b) => a.innovation < b.innovation ? -1 : 1);
		let result: number[] = [];
		oNodes.forEach(node => {
			result.push(node.getValue());
		});
		return result;
	}

	hasConnection(innovation: number): Connection | boolean {
		for (let i = 0; i < this.connections.length; i++) {
			if (this.connections[i].innovation === innovation) return this.connections[i];
		}
		return false;
	}

	hasNode(innovation: number): Node | boolean {
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].innovation === innovation) return this.nodes[i];
		}
		return false;
	}

	randomConnectionStructure(): ConnectionStructure | void {
		let tries = 0;
		let fNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
		let sNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
		while (fNode.id === sNode.id || (fNode.getType() === NodeType.INPUT && sNode.getType() === NodeType.INPUT) || (fNode.getType() === NodeType.OUTPUT && sNode.getType() === NodeType.OUTPUT)) {
			sNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
			tries++;
		}
		if (!(tries > 20 || fNode.getType() === NodeType.OUTPUT || sNode.getType() === NodeType.INPUT)) return { fNode: fNode, sNode: sNode };
		else return;
	}

	addNode(rConnection: Connection, neat: NEAT): Node {
		let nInnovation = Node.nodeExists(rConnection.innovation, neat.nodeDB);

		if (nInnovation) {
			let existing = this.hasNode(nInnovation);
			if (!existing) {
				let newNode = new Node(nInnovation, NodeType.HIDDEN, rConnection);
				this.nodes.push(newNode);
				return newNode;
			} else {
				// @ts-ignore
				existing.setNodeActivation(true);
				// @ts-ignore
				return existing;
			}
		} else {
			neat.nodeInnovation++;
			let newNode = new Node(neat.nodeInnovation, NodeType.HIDDEN, rConnection);
			this.nodes.push(newNode);
			neat.nodeDB.push(newNode);
			// @ts-ignore
			return newNode;
		}
	}

	addConnection(tNodes: ConnectionStructure, neat: NEAT): Connection | void {
		let innovation = Connection.connectionExists(tNodes, neat.connectionDB);
		if (innovation) {
			let existing = this.hasConnection(innovation);
			if (!existing) {
				let newConnection = new Connection(tNodes.fNode, tNodes.sNode, innovation);
				if (Connection.isRecurrent(newConnection, this)) {
					return;
				} else {
					this.connections.push(newConnection);
					return newConnection;
				}
			}
		} else {
			neat.connectionInnovation++;
			let newConnection = new Connection(tNodes.fNode, tNodes.sNode, neat.connectionInnovation);
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

	getGenesByInnovation(): Connection[] {
		let result = [];
		for (let i = 0; i < this.connections.length; i++) {
			result[this.connections[i].innovation] = this.connections[i];
		}
		return result;
	}

	mutateWeights(rate: number) {
		for (let i = 0; i < this.connections.length; i++) {
			if (Math.random() < rate) {
				this.connections[i].randomizeWeight();
			}
		}
	}

	mutateConnection(neat: NEAT) {
		let tNodes = this.randomConnectionStructure();
		if (tNodes) this.addConnection(tNodes, neat);
	}

	mutateDeactivateConnection() {
		let rConnection = this.connections[Math.floor(Math.random() * this.connections.length)];
		if (rConnection) rConnection.deactivateConnection();
	}

	mutateNode(neat: NEAT) {
		let rConnection = this.connections[Math.floor(Math.random() * this.connections.length)];

		if (rConnection) {
			if (!rConnection.active) return;
			rConnection.deactivateConnection();
			let iNode = rConnection.getInputNode();
			let oNode = rConnection.getOutputNode();

			let node = this.addNode(rConnection, neat);
			let fConnection = { fNode: iNode, sNode: node };
			let sConnection = { fNode: node, sNode: oNode };
			this.addConnection(fConnection, neat);
			this.addConnection(sConnection, neat);
		}
	}

	mutateDeactivateNode() {
		let node = this.nodes[Math.floor(Math.random() * this.nodes.length)];
		if (node.replacedConnection) {
			node.setNodeActivation(false);
			for (let i = 0; i < this.connections.length; i++) {
				if (this.connections[i].getInputNode().getID() === node.getID() || this.connections[i].getOutputNode().getID() === node.getID()) this.connections[i].deactivateConnection();
			}
		}
	}

	addGene(gene: Connection) {
		let iNode = gene.getInputNode();
		let oNode = gene.getOutputNode();

		let childiNode = this.hasNode(iNode.innovation);
		let childoNode = this.hasNode(oNode.innovation);

		let iNodeConnection;
		let oNodeConnection;
		if (!childiNode) {
			iNodeConnection = new Node(iNode.innovation, iNode.getType(), iNode.replacedConnection);
			this.nodes.push(iNodeConnection);
		} else {
			iNodeConnection = childiNode;
			// @ts-ignore
			childiNode.setNodeActivation(true);
		}

		if (!childoNode) {
			oNodeConnection = new Node(oNode.innovation, oNode.getType(), oNode.replacedConnection);
			this.nodes.push(oNodeConnection);
		} else {
			oNodeConnection = childoNode;
			// @ts-ignore
			childoNode.setNodeActivation(true);
		}

		let childConnection = this.hasConnection(gene.innovation);
		if (!childConnection && iNodeConnection != true && oNodeConnection != true) {
			let connection = new Connection(iNodeConnection, oNodeConnection, gene.innovation, gene.weight);
			if (!Connection.isRecurrent(connection, this)) this.connections.push(new Connection(iNodeConnection, oNodeConnection, gene.innovation, gene.weight));
		} else {
			// @ts-ignore
			childConnection.activateConnection();
		}
	}

	static crossover(genome1: Genome, genome2: Genome, config: StructureConfig): Genome {
		let child = new Genome(config);
		const [hFit, lFit] = [genome1, genome2].sort((a, b) => b.fitness - a.fitness);
		const hFitGenes = hFit.getGenesByInnovation();
		const lFitGenes = lFit.getGenesByInnovation();

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
		let genes1 = genome1.getGenesByInnovation();
		let genes2 = genome2.getGenesByInnovation();
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

export { Genome, StructureConfig, ConnectionStructure };