import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";
import type { Coordinate } from "./types.js";
import { ActivationFunctions, NEAT } from "./classes/NEAT/index.js";
import { FancyVisualiser } from "./classes/FancyVisualiser.js";

// =============== ⚙ Settings =============== //

// 🧪 Simulation

const simulationSize: [number, number] = [3, 3] // width, height
const tileSize = 250;
const roadWidth = Math.floor(2 / 7 * tileSize); // Flooring because using integers is just faster for calculations and difference is neglegable 
const roadCurveResolution = 5; // Increase this to have smoother curves, results in more calculations

// 🚗 Car
const carWidth = Math.floor(1 / 8 * tileSize);
const carHeight = carWidth * 2; // Car size, multiplying to ensure integer
const carViewingDistance = Math.floor(1 / 4 * tileSize)
const carSpawnPoint: Coordinate = [Math.floor(1 / 2 * tileSize), Math.floor(1 / 2 * tileSize)];


const Sim = new Simulation(simulationSize, tileSize, roadWidth, roadCurveResolution);
const Car = new _Car(carSpawnPoint, carWidth, carHeight, tileSize, carViewingDistance);
const Vis = new Visualiser("canvas", Sim);
const FancyVis = new FancyVisualiser("canvas", Sim);
Sim.init();
Vis.init();
// Car.toggleManual();

let fancy = false;
let manualTerminate = false;

addEventListener("terminateRun", () => {
	Vis.init();
	Sim.init();
	Car.reset();
});

let AI: any = {}

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
			if (Car.stats.timesHit > 0 || manualTerminate) {
				resolve(Car.stats.distanceTravelled / Car.stats.survivalTime);
				manualTerminate = false;
			} else if (Car.stats.survivalTime > 50 && !(Car.velocity.x > minumumSpeed || Car.velocity.x < -minumumSpeed || Car.velocity.y > minumumSpeed || Car.velocity.y < -minumumSpeed)) {
				console.log("Died to inactivity");
				resolve(Car.stats.distanceTravelled / Car.stats.survivalTime);
			} else {
				requestAnimationFrame(render);
			}
		}

		render();

		// let alive = true;

		// while (alive) {
		//     // Update the stats
		//     Car.stats.distanceTravelled += Math.sqrt(Math.pow(Car.velocity.x, 2) + Math.pow(Car.velocity.y, 2));
		//     Car.stats.survivalTime += 1;

		//     const response = a.activate(Car.getDistances(Sim.tiles));

		//     Car.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);

		//     if (Car.stats.survivalTime > 250 && Car.stats.distanceTravelled < 1) {
		//         fitness = 0;
		//         alive = false;
		//         resolve(fitness / Car.stats.survivalTime);
		//     } else if (Car.stats.survivalTime > 99999 || (Car.stats.survivalTime > 100 && Car.velocity.x + Car.velocity.y < 1)) {
		//         fitness = Car.stats.distanceTravelled / Car.stats.survivalTime;
		//         alive = false;
		//         resolve(fitness);
		//     }
		// }
	});
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

const neat = new NEAT(config);

const eventListeners = {
	"p": () => {
		console.log("Starting...");
		neat.run();
	},
	"g": () => {
		console.log(JSON.stringify(AI))
		console.log(`Node: ${AI?.nodes?.length}`)
	},
	"f": () => fancy = !fancy,
	"t": () => manualTerminate = true,
}

for (const [key, value] of Object.entries(eventListeners)) {
	addEventListener("keypress", (e) => {
		if (e.key === key) value();
	})
}