import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";
import type { Coordinate, Tile } from "./types.js";
import { ActivationFunctions, NEAT } from "./classes/NEAT/index.js";
import { FancyVisualiser } from "./classes/FancyVisualiser.js";
import { Genome } from "./classes/NEAT/Genome.js";
import { MersenneTwister, generateSpecifiedTile } from "./utils.js";

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


const Sim = new Simulation(simulationSize, tileSize, roadWidth, roadCurveResolution, true);
const Cars: {CarInstance: _Car, genome: Genome}[] = [];
const Vis = new Visualiser("canvas", Sim);
const FancyVis = new FancyVisualiser("canvas", Sim);
Sim.init();
Vis.init();

let fancy = false;
let manualTerminate = false;

addEventListener("terminateRun", () => {
	Vis.init();
	Sim.init();

	Cars.forEach(Car => {
		Car.CarInstance.reset(true);
	});
});

let config = {
	structure: {
		in: 5,
		hidden: 0,
		out: 4,
		activationFunction: ActivationFunctions.STEP
	}
};

function addCar() {
	const bestGenomeDataLoaded = JSON.parse(localStorage.getItem("bestGenomeData") ?? "");
	const loaded = new Genome(config.structure).import(bestGenomeDataLoaded, config.structure)
	const Car = new _Car(carSpawnPoint, carWidth, carHeight, tileSize, carViewingDistance);

	// Car.reset(true);
	Cars.push({ CarInstance: Car, genome: loaded });

	console.log("Added car", Cars);
}

async function runSim() {
	const render = () => {
		Cars.forEach(Car => {
			Car.CarInstance.update(Sim.tiles);
			if (fancy) FancyVis.update(Car.CarInstance);
			else Vis.update(Car.CarInstance);

			Car.CarInstance.stats.distanceTravelled += Math.sqrt(Math.pow(Car.CarInstance.velocity.x, 2) + Math.pow(Car.CarInstance.velocity.y, 2));
			Car.CarInstance.stats.survivalTime += 1;

			const response = Car.genome.activate(Car.CarInstance.getDistances(Sim.tiles))

			Car.CarInstance.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);
		});

		requestAnimationFrame(render);
	}

	render();
}

const eventListeners = {
	"f": () => fancy = !fancy,
	"t": () => manualTerminate = true,
	"l": () => {
		console.log("Loading...");
		Sim.reset();

		runSim();
	},
	"a": addCar
}

for (const [key, value] of Object.entries(eventListeners)) {
	addEventListener("keypress", (e) => {
		if (e.key === key) value();
	})
}