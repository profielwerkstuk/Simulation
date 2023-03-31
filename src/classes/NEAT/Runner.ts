import { Genome } from "./Genome.js";
import { Node } from "./Neuron.js";
import type { FrozenConnection, FrozenGenome, FrozenNode, StructureConfig } from "./types.js";
import { ActivationFunctions } from "./ActivationFunctions.js";
import { Connection } from "./Connection.js";

import { plainToInstance } from 'class-transformer';

export class Runner extends Genome {
	constructor(genome: FrozenGenome) {
		super({
			in: genome.nodes.filter(v => v._type === "INPUT").length,
			out: genome.nodes.filter(v => v._type === "OUTPUT").length,
			hidden: genome.nodes.filter(v => v._type === "HIDDEN").length,
			activationFunction: ActivationFunctions[genome.activationFunction]
		});

		const defrostedNodes = genome.nodes.map(node => plainToInstance(Node, node));
		const defrostedConnections = genome.connections.map(connection => plainToInstance(Connection, connection));

		this.connections = defrostedConnections;
		this.nodes = defrostedNodes;
		this.fitness = genome.fitness;
	}
}