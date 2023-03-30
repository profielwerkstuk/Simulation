import { Genome } from "./Genome.js";
import { Node } from "./Neuron.js";
import type { FrozenConnection, FrozenGenome, FrozenNode, StructureConfig } from "./types.js";
import { ActivationFunctions } from "./ActivationFunctions.js";
import { Connection } from "./Connection.js";

export class Runner extends Genome {
	constructor(genome: FrozenGenome) {
		super({
			in: genome.nodes.filter(v => v._type === "INPUT").length,
			out: genome.nodes.filter(v => v._type === "OUTPUT").length,
			hidden: genome.nodes.filter(v => v._type === "HIDDEN").length,
			activationFunction: ActivationFunctions[genome.activationFunction]
		});

		const defrostedNodes = genome.nodes.map(node => defrostNode(node));
		const defrostedConnections = genome.connections.map(connection => defrostConnection(connection));

		this.connections = defrostedConnections;
		this.nodes = defrostedNodes;
		this.fitness = genome.fitness;
	}
}

function defrostNode(node: FrozenNode): Node {
	const defrostedConnection = Object.keys(node.replacedConnection).length === 0 ? {} as Connection : defrostConnection(node.replacedConnection as any);

	const defrosted = new Node(
		node.innovation,
		node._type,
		defrostedConnection,
		node.id,
		node.value
	);

	defrosted.active = node.active;
	defrosted.inputCount = node.inputCount;
	defrosted.inputTimes = node.inputTimes;
	defrosted.value = node.value;

	return defrosted
}

function defrostConnection(connection: FrozenConnection): Connection {
	const defrostedInput = defrostNode(connection.input);
	const defrostedOutput = defrostNode(connection.output);

	const defrosted = new Connection(
		defrostedInput,
		defrostedOutput,
		connection.innovation,
		connection.weight
	);

	defrosted.active = connection.active;

	return defrosted
}