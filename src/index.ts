/** SERVER CODE */
import { parentPort, workerData } from "worker_threads";
import * as fs from "fs";

// node . activationFunction=STEP addNodeMR=0.8 addConnectionMR=0.4 removeNodeMR=0.001 removeConnectionMR=0.00001 changeWeightMR=0.1 c1=4 c2=2.5 c3=2 compatibilityThreshold=1.5
// /?activationFunction=STEP&addNodeMR=0.8&addConnectionMR=0.4&removeNodeMR=0.001&removeConnectionMR=0.00001&changeWeightMR=0.1&c1=4&c2=2.5&c3=2&compatibilityThreshold=1.5

interface args {
	activationFunction: keyof typeof ActivationFunctions,

	populationSize: number,
	addNodeMR: number,
	addConnectionMR: number,
	removeNodeMR: number,
	removeConnectionMR: number,
	changeWeightMR: number

	c1: number,
	c2: number,
	c3: number,
	compatibilityThreshold: number

}

const data = workerData || process.argv.slice(2)

// @ts-ignore
const ARGS = Object.fromEntries(data.map(v => v.split("="))) as args;

let config = {
	populationSize: ARGS.populationSize,
	structure: {
		in: 5,
		hidden: 0,
		out: 4,
		activationFunction: ActivationFunctions[ARGS.activationFunction]
	},
	mutationRate: {
		addNodeMR: ARGS.addNodeMR,
		addConnectionMR: ARGS.addConnectionMR,
		removeNodeMR: ARGS.removeNodeMR,
		removeConnectionMR: ARGS.removeConnectionMR,
		changeWeightMR: ARGS.changeWeightMR
	},
	distanceConstants: {
		c1: ARGS.c1,
		c2: ARGS.c2,
		c3: ARGS.c3,
		compatibilityThreshold: ARGS.compatibilityThreshold
	},
	fitnessFunction: fitnessFunction,
	maxEpoch: 25,
};
/**             */


import { Simulation } from "./classes/Simulation.js";
import { Car as _Car } from "./classes/Car.js";
import type { Coordinate } from "./types.js";
import { ActivationFunctions, NEAT } from "./classes/NEAT/index.js";

import { Emitter } from "./classes/Emitter.js";
import { MersenneTwister } from "./utils.js";
import { Genome } from "./classes/NEAT/Genome.js";

// =============== ⚙ Settings =============== //

// 🧪 Simulation

const simulationSize: [number, number] = [3, 3] // width, height
const tileSize = 250;
const roadWidth = Math.floor(2 / 7 * tileSize); // Flooring because using integers is just faster for calculations and difference is neglegable 
const roadCurveResolution = 5; // Increase this to have smoother curves, results in more calculations

// 🚗 Car
const carWidth = Math.floor(1 / 8 * tileSize);
const carHeight = carWidth * 2; // Car size, multiplying to ensure integer
const carViewingDistance = Math.floor(1 / 5 * tileSize)
const carSpawnPoint: Coordinate = [Math.floor(1 / 2 * tileSize), Math.floor(1 / 2 * tileSize)];


const Sim = new Simulation(simulationSize, tileSize, roadWidth, roadCurveResolution);
const Car = new _Car(carSpawnPoint, carWidth, carHeight, tileSize, carViewingDistance);
Sim.init();

const emi = new Emitter().emitter;
emi.on("terminateRun", () => {
	Sim.init();
	Car.reset();
})

const startTime = Date.now();

function fitnessFunction(genome: Genome, epoch: number, seed: number, loaded = false): Promise<[number, number, any]> {
	return new Promise((resolve) => {
		Sim.reset();
		Car.reset(true);
		Sim.mersenneTwister = new MersenneTwister(seed);

		while (true) {
			Car.update(Sim.tiles);

			Car.stats.distanceTravelled += Math.sqrt(Math.pow(Car.velocity.x, 2) + Math.pow(Car.velocity.y, 2));
			Car.stats.survivalTime += 1;

			const response = genome.activate(Car.getDistances(Sim.tiles))

			Car.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);

			const minumumSpeed = 0.001;
			if (Car.stats.timesHit > 0) {
				break;
			} else if (Car.stats.survivalTime > 50 && Car.power < minumumSpeed) {
				break;
			} else if (Car.stats.survivalTime - Car.stats.tileEntryTime > 1000) {
				break;
			} else if (Car.stats.tilesTravelled > 256 || startTime + 1000 * 30 < Date.now()) {
				genome.fitness = Car.stats.distanceTravelled / Car.stats.survivalTime * Car.stats.tilesTravelled;
				global.bestGenomeData = JSON.stringify(genome.export(Car.stats));
				parentPort?.postMessage([true, global.bestGenomeData]);
				process.exit();
			}
		}

		resolve([Car.stats.distanceTravelled / Car.stats.survivalTime * Car.stats.tilesTravelled, 1, Car.stats]);
	});
}

const neat = new NEAT(config);

neat.run();