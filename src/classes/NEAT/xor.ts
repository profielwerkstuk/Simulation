import { ActivationFunctions } from './ActivationFunctions.js';
import { Genome } from './Genome.js';
import { NEAT } from './NEAT.js';
import { deserialize, serialize } from 'v8';

let best: { score: number, genome: any } = {
	score: 0,
	genome: null,
};

function fitnessFunction(a: any): Promise<[number, number, any]> {
	return new Promise((resolve, reject) => {
		let fitness = 4;
		fitness -= Math.abs(a.activate([1, 1])[0]);
		fitness -= Math.abs(a.activate([1, 0])[0] - 1);
		fitness -= Math.abs(a.activate([0, 1])[0] - 1);
		fitness -= Math.abs(a.activate([0, 0])[0]);
		if (a.connections.length < 2) fitness *= 0.001;

		const score = Math.max(fitness, 0.001)
		if (score > best.score) {
			best.score = score;
			best.genome = a;
		}

		resolve([score, 1, {}]);
	});
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
	inBrowser: false
};

const neat = new NEAT(config);
console.log('Starting...');

await neat.run();

console.log("Testing best genome");
console.log(0, ":", best.genome.activate([1, 1])[0], best.genome.activate([0, 0])[0]);
console.log(1, ":", best.genome.activate([1, 0])[0], best.genome.activate([0, 1])[0]);


const bestGenomeData = JSON.stringify(best.genome.export())

// store bestGenomeData in a file
import * as fs from 'fs';

fs.writeFileSync('./bestGenomeData', bestGenomeData);

// read bestGenomeData from a file

const bestGenomeDataLoaded = JSON.parse(fs.readFileSync('./bestGenomeData').toString());

const x = new Genome(config.structure).import(bestGenomeDataLoaded, config.structure)

console.log("Testing imported genome");
console.log(0, ":", x.activate([1, 1])[0], x.activate([0, 0])[0]);
console.log(1, ":", x.activate([1, 0])[0], x.activate([0, 1])[0]);
