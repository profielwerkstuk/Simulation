import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";
import type { Coordinate } from "./types.js";
import { ActivationFunctions, NEAT } from "./classes/NEAT/index.js";
import { FancyVisualiser } from "./classes/FancyVisualiser.js";
import { Genome } from "./classes/NEAT/Genome.js";
import { plainToInstance } from 'class-transformer';

// =============== ⚙ Settings =============== //

// 🧪 Simulation

const simulationSize: [number, number] = [3, 3] // width, height
const tileSize = 200;
const roadWidth = Math.floor(2 / 7 * tileSize); // Flooring because using integers is just faster for calculations and difference is neglegable 
const roadCurveResolution = 5; // Increase this to have smoother curves, results in more calculations

// 🚗 Car
const carWidth = Math.floor(1 / 8 * tileSize);
const carHeight = carWidth * 2; // Car size, multiplying to ensure integer
const carViewingDistance = Math.floor(1 / 5 * tileSize)
const carSpawnPoint: Coordinate = [Math.floor(1 / 2 * tileSize), Math.floor(1 / 2 * tileSize)];


const Sim = new Simulation(simulationSize, tileSize, roadWidth, roadCurveResolution);
const Car = new _Car(carSpawnPoint, carWidth, carHeight, tileSize, carViewingDistance);
const Vis = new Visualiser("canvas", Sim);
const FancyVis = new FancyVisualiser("canvas", Sim);
Sim.init();
Vis.init();
// Car.toggleManual();

let fancy = false;

addEventListener("terminateRun", () => {
	Vis.init();
	Sim.init();
	Car.reset();
});

let AI = {}

function fitnessFunction(a: { activate: (arg0: number[]) => any; }): Promise<number> {
	AI = a;
	return new Promise((resolve) => {
		Car.reset(true);
		Sim.reset();

		const render = () => {
			Car.update(Sim.tiles);
			if (fancy) FancyVis.update(Car);
			else Vis.update(Car);

			Car.stats.distanceTravelled += Math.sqrt(Math.pow(Car.velocity.x, 2) + Math.pow(Car.velocity.y, 2));
			Car.stats.survivalTime += 1;

			const response = a.activate(Car.getDistances(Sim.tiles))

			Car.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);

            const minumumSpeed = 0.001;
            if (Car.stats.timesHit > 0) {
                resolve(Car.stats.distanceTravelled / Car.stats.survivalTime);
            } else if (Car.stats.survivalTime > 50 && !(Car.velocity.x > minumumSpeed || Car.velocity.x < -minumumSpeed || Car.velocity.y > minumumSpeed || Car.velocity.y < -minumumSpeed)) {
                console.log("Died to inactivity");
                resolve(Car.stats.distanceTravelled / Car.stats.survivalTime);
            } else {
                requestAnimationFrame(render);
            }
		}

		render();
	});
}

function runAI(genome: Genome) {
	Car.reset(true);
	Sim.reset();

	const render = () => {
		Car.update(Sim.tiles);
		if (fancy) FancyVis.update(Car);
		else Vis.update(Car);

		Car.stats.distanceTravelled += Math.sqrt(Math.pow(Car.velocity.x, 2) + Math.pow(Car.velocity.y, 2));
		Car.stats.survivalTime += 1;

		const response = genome.activate(Car.getDistances(Sim.tiles))

		Car.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);
	}

	render();
}

let config = {
	populationSize: 25,
	structure: {
		in: 5,
		hidden: 0,
		out: 4,
		activationFunction: ActivationFunctions.RELU
	},
	mutationRate: {
		addNodeMR: 0.7,
		addConnectionMR: 0.4,
		removeNodeMR: 0.00001,
		removeConnectionMR: 0.001,
		changeWeightMR: 0.2
	},
	distanceConstants: {
		c1: 2,
		c2: 0.5,
		c3: 1,
		compatibilityThreshold: 1.5
	},
	fitnessThreshold: 3.5,
	fitnessFunction: fitnessFunction,
	maxEpoch: 9999,
};

const frozenGenome = { 'nodes': [ { '_type': 'INPUT', 'value': 23.792883555030507, 'innovation': 0, 'id': '5d5435a0-117564cf', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, { '_type': 'INPUT', 'value': -1, 'innovation': 1, 'id': 'fe0a9574-b449bf08', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, { '_type': 'INPUT', 'value': -1, 'innovation': 2, 'id': '5595a8a7-59fba0c5', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, { '_type': 'INPUT', 'value': 67.91214836769169, 'innovation': 3, 'id': '47e47d9e-e16b47b0', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, { '_type': 'INPUT', 'value': 52.0646380649691, 'innovation': 4, 'id': '68d62110-5b021fce', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, { '_type': 'OUTPUT', 'value': 17.12418173045974, 'innovation': 5, 'id': '2497e715-2320f7dc', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 0 }, { '_type': 'OUTPUT', 'value': 0, 'innovation': 6, 'id': 'a100d8eb-9091b80d', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, { '_type': 'OUTPUT', 'value': 0.3489788254640058, 'innovation': 7, 'id': '32d43b23-7b6287ac', 'replacedConnection': {}, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, { '_type': 'OUTPUT', 'value': 0, 'innovation': 8, 'id': 'c95ef357-bd15d03f', 'replacedConnection': {}, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, { '_type': 'HIDDEN', 'value': 34.77301965810289, 'innovation': 10, 'id': 'c8a36968-4166b96c', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, { '_type': 'HIDDEN', 'value': 3.3667979963612273, 'innovation': 18, 'id': 'f79dcbff-d227482c', 'replacedConnection': { 'input': { '_type': 'HIDDEN', 'value': 21.03452782779328, 'innovation': 10, 'id': '01b86e41-14684942', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 31.77773259515308, 'innovation': 5, 'id': '23ae572e-4cfbd383', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 3 }, 'innovation': 10, 'weight': 0.778772431219231, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 } ], 'connections': [ { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 1, 'id': 'fe0a9574-b449bf08', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0.3489788254640058, 'innovation': 7, 'id': '32d43b23-7b6287ac', 'replacedConnection': {}, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'innovation': 2, 'weight': -0.3489788254640058, 'active': true }, { 'input': { '_type': 'INPUT', 'value': 67.91214836769169, 'innovation': 3, 'id': '47e47d9e-e16b47b0', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 17.12418173045974, 'innovation': 5, 'id': '2497e715-2320f7dc', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 0 }, 'innovation': 4, 'weight': 0.09235389467104005, 'active': true }, { 'input': { '_type': 'INPUT', 'value': 67.91214836769169, 'innovation': 3, 'id': '47e47d9e-e16b47b0', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'HIDDEN', 'value': 34.77301965810289, 'innovation': 10, 'id': 'c8a36968-4166b96c', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'innovation': 9, 'weight': 0.5120294453038641, 'active': true }, { 'input': { '_type': 'HIDDEN', 'value': 34.77301965810289, 'innovation': 10, 'id': 'c8a36968-4166b96c', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 17.12418173045974, 'innovation': 5, 'id': '2497e715-2320f7dc', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 0 }, 'innovation': 10, 'weight': -0.06641364477388656, 'active': true }, { 'input': { '_type': 'HIDDEN', 'value': 34.77301965810289, 'innovation': 10, 'id': 'c8a36968-4166b96c', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'output': { '_type': 'HIDDEN', 'value': 3.3667979963612273, 'innovation': 18, 'id': 'f79dcbff-d227482c', 'replacedConnection': { 'input': { '_type': 'HIDDEN', 'value': 21.03452782779328, 'innovation': 10, 'id': '01b86e41-14684942', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 31.77773259515308, 'innovation': 5, 'id': '23ae572e-4cfbd383', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 3 }, 'innovation': 10, 'weight': 0.778772431219231, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'innovation': 30, 'weight': 0.0968221347891105, 'active': true }, { 'input': { '_type': 'HIDDEN', 'value': 3.3667979963612273, 'innovation': 18, 'id': 'f79dcbff-d227482c', 'replacedConnection': { 'input': { '_type': 'HIDDEN', 'value': 21.03452782779328, 'innovation': 10, 'id': '01b86e41-14684942', 'replacedConnection': { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 3, 'id': 'e626a6ea-cf1fa220', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 5, 'id': '57ec7376-890a5f2d', 'replacedConnection': {}, 'active': true, 'inputCount': 2, 'inputTimes': 1 }, 'innovation': 4, 'weight': 0.8400433718890503, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 31.77773259515308, 'innovation': 5, 'id': '23ae572e-4cfbd383', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 3 }, 'innovation': 10, 'weight': 0.778772431219231, 'active': false }, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 17.12418173045974, 'innovation': 5, 'id': '2497e715-2320f7dc', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 0 }, 'innovation': 31, 'weight': -0.9808263125215371, 'active': true }, { 'input': { '_type': 'INPUT', 'value': -1, 'innovation': 1, 'id': 'fe0a9574-b449bf08', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 0, 'innovation': 8, 'id': 'c95ef357-bd15d03f', 'replacedConnection': {}, 'active': true, 'inputCount': 1, 'inputTimes': 0 }, 'innovation': 36, 'weight': 0.6566074261774553, 'active': true }, { 'input': { '_type': 'INPUT', 'value': 23.792883555030507, 'innovation': 0, 'id': '5d5435a0-117564cf', 'replacedConnection': {}, 'active': true, 'inputCount': 0, 'inputTimes': 0 }, 'output': { '_type': 'OUTPUT', 'value': 17.12418173045974, 'innovation': 5, 'id': '2497e715-2320f7dc', 'replacedConnection': {}, 'active': true, 'inputCount': 4, 'inputTimes': 0 }, 'innovation': 64, 'weight': 0.6919664585509837, 'active': true } ], 'fitness': 0, 'activationFunction': 'RELU' }

// on P pressed
addEventListener("keypress", (e) => {
	if (e.key === "t") {
		console.log("Starting...");
		const neat = new NEAT(config);
		neat.run();
	} else if (e.key === "f") {
		fancy = !fancy;
	} else if (e.key === "s") {
		console.log(AI);
	} else if (e.key === "p") {
		runAI(plainToInstance(Genome, frozenGenome))
	}
});