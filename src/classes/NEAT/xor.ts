import { ActivationFunctions, NEAT } from './index.js';
import { writeFileSync, readFileSync } from "fs";

import type { FitnessFunction } from './types.js';
import type { Genome } from './Genome.js';

const tests: [[number, number], number][] = [
	[[0, 0], 0],
	[[0, 1], 1],
	[[1, 0], 1],
	[[1, 1], 0],
];

let best: { score: number, genome: null | Genome } = {
	score: 0,
	genome: null,
};

const fitnessFunction: FitnessFunction = async (genome) => {
	let fitness = 4;
	tests.forEach(test => {
		fitness -= Math.abs(genome.activate(test[0])[0] - test[1]);
	});

	if (genome.connections.length < 2) fitness *= 0.001;

	const score = Math.max(fitness, 0.001)

	if (score > best.score) {
		best.score = score;
		best.genome = genome;
	}

	return score;
};

let config = {
	populationSize: 9999,
	structure: {
		in: 2,
		hidden: 0,
		out: 1,
		activationFunction: ActivationFunctions.RELU
	},
	mutationRate: {
		addNodeMR: 0.005,
		addConnectionMR: 0.01,
		removeNodeMR: 0.0001,
		removeConnectionMR: 0.01,
		changeWeightMR: 0.1
	},
	distanceConstants: {
		c1: 2,
		c2: 0.5,
		c3: 1,
		compatibilityThreshold: 1.5
	},
	fitnessThreshold: 3.5,
	fitnessFunction: fitnessFunction,
	maxEpoch: Math.round(Math.exp(50)),
};

// while (true) {
const network = new NEAT(config);
console.log("> Network starting");
await network.run();

console.log(`> Best score: ${best.score}`);
console.log("> Testing best genome");

tests.forEach(test => {
	const result = Math.round(best.genome!.activate(test[0])[0]);
	console.log(`${result === test[1] ? "✅" : "❌"} ${test[0].join(" ")} | ${result}`)
})

// const previous = readFileSync(`./genomes/genome-${config.fitnessThreshold}.json`, "utf-8");
// const current = JSON.stringify(best.genome);
// const previousNodesAmount = JSON.parse(previous)._nodes.length;
// const currentNodesAmount = best.genome!.nodes.length;

// if (current.length < previous.length || currentNodesAmount < previousNodesAmount) {
// 	console.log(`> Improved on the genome:`);
// 	console.log(`> ${previousNodesAmount} => ${currentNodesAmount} (Δ${previousNodesAmount - currentNodesAmount})`);
// 	console.log(`> ${previous.length} => ${current.length} (Δ${previous.length - current.length})`);
// 	writeFileSync(`./genomes/genome-${config.fitnessThreshold}.json`, JSON.stringify(best.genome));
// }
// }