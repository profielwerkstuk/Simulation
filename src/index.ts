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
const Cars: { CarInstance: _Car, genome: Genome }[] = [];
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
	const bestGenomeDataLoaded = JSON.parse('{"nodes":[{"type":"INPUT","id":"9b2fb558-557820f4","active":true},{"type":"INPUT","id":"cbb0ae59-c3cbbb9d","active":true},{"type":"INPUT","id":"5b83e732-3ea38028","active":true},{"type":"INPUT","id":"41763fda-b5aa0c5c","active":true},{"type":"INPUT","id":"675d79be-fb14a540","active":true},{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},{"type":"OUTPUT","id":"e4e412f5-5c381d81","active":true},{"type":"OUTPUT","id":"c9efc776-0e329276","active":true},{"type":"OUTPUT","id":"8794a36b-538fb9b1","active":true},{"type":"HIDDEN","id":"5bb00fad-cea2bdb4","active":true},{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},{"type":"HIDDEN","id":"37d876a8-af66790f","active":true},{"type":"HIDDEN","id":"c625c4c5-c40db14b","active":true},{"type":"HIDDEN","id":"4155502a-d5ec628c","active":true},{"type":"HIDDEN","id":"6e807aa2-8d313718","active":true},{"type":"HIDDEN","id":"ec1d69ef-ceb48f0a","active":true},{"type":"HIDDEN","id":"123baa57-f72ee74e","active":true},{"type":"HIDDEN","id":"0f581b7b-117095f7","active":true},{"type":"HIDDEN","id":"981a264f-6465bde9","active":true},{"type":"HIDDEN","id":"bef99c4c-d59c0520","active":true},{"type":"HIDDEN","id":"ad9a71ed-3cad0fe1","active":true},{"type":"HIDDEN","id":"fa40fdfb-b831a18f","active":true},{"type":"HIDDEN","id":"4082f0e2-10b9ea37","active":true},{"type":"HIDDEN","id":"b9ce33b7-247fbd97","active":true},{"type":"HIDDEN","id":"cee34bde-ca545c01","active":true}],"connections":[{"inputNode":{"type":"INPUT","id":"675d79be-fb14a540","active":true},"outputNode":{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},"weight":0.47510662454954034,"active":true},{"inputNode":{"type":"INPUT","id":"cbb0ae59-c3cbbb9d","active":true},"outputNode":{"type":"OUTPUT","id":"8794a36b-538fb9b1","active":true},"weight":0.09260465123923511,"active":true},{"inputNode":{"type":"INPUT","id":"cbb0ae59-c3cbbb9d","active":true},"outputNode":{"type":"OUTPUT","id":"c9efc776-0e329276","active":true},"weight":-0.4890201025261005,"active":true},{"inputNode":{"type":"INPUT","id":"9b2fb558-557820f4","active":true},"outputNode":{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},"weight":0.47594834621681903,"active":true},{"inputNode":{"type":"INPUT","id":"675d79be-fb14a540","active":true},"outputNode":{"type":"HIDDEN","id":"5bb00fad-cea2bdb4","active":true},"weight":-0.039006099574494524,"active":true},{"inputNode":{"type":"HIDDEN","id":"5bb00fad-cea2bdb4","active":true},"outputNode":{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},"weight":0.40917862288521123,"active":true},{"inputNode":{"type":"INPUT","id":"9b2fb558-557820f4","active":true},"outputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"weight":0.5072164066464517,"active":true},{"inputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"outputNode":{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},"weight":-0.8953276826290022,"active":true},{"inputNode":{"type":"INPUT","id":"41763fda-b5aa0c5c","active":true},"outputNode":{"type":"OUTPUT","id":"c9efc776-0e329276","active":true},"weight":0.10846697334163613,"active":true},{"inputNode":{"type":"HIDDEN","id":"5bb00fad-cea2bdb4","active":true},"outputNode":{"type":"HIDDEN","id":"37d876a8-af66790f","active":true},"weight":-0.6746741355364203,"active":true},{"inputNode":{"type":"HIDDEN","id":"37d876a8-af66790f","active":true},"outputNode":{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},"weight":-0.5897940637021595,"active":true},{"inputNode":{"type":"INPUT","id":"9b2fb558-557820f4","active":true},"outputNode":{"type":"HIDDEN","id":"c625c4c5-c40db14b","active":true},"weight":-0.5764521722075768,"active":true},{"inputNode":{"type":"HIDDEN","id":"c625c4c5-c40db14b","active":true},"outputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"weight":0.5300996822813753,"active":true},{"inputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"outputNode":{"type":"HIDDEN","id":"4155502a-d5ec628c","active":true},"weight":-0.21593537841343702,"active":true},{"inputNode":{"type":"HIDDEN","id":"4155502a-d5ec628c","active":true},"outputNode":{"type":"OUTPUT","id":"002c300c-ac979b99","active":true},"weight":0.4663548154581725,"active":true},{"inputNode":{"type":"INPUT","id":"41763fda-b5aa0c5c","active":true},"outputNode":{"type":"HIDDEN","id":"6e807aa2-8d313718","active":true},"weight":0.12399202113962993,"active":true},{"inputNode":{"type":"HIDDEN","id":"6e807aa2-8d313718","active":true},"outputNode":{"type":"OUTPUT","id":"c9efc776-0e329276","active":true},"weight":-0.24286866497313708,"active":true},{"inputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"outputNode":{"type":"OUTPUT","id":"e4e412f5-5c381d81","active":true},"weight":-0.688319468403126,"active":true},{"inputNode":{"type":"HIDDEN","id":"c625c4c5-c40db14b","active":true},"outputNode":{"type":"HIDDEN","id":"ec1d69ef-ceb48f0a","active":true},"weight":-0.33413167967471624,"active":true},{"inputNode":{"type":"HIDDEN","id":"ec1d69ef-ceb48f0a","active":true},"outputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"weight":0.49688115358960117,"active":true},{"inputNode":{"type":"INPUT","id":"9b2fb558-557820f4","active":true},"outputNode":{"type":"HIDDEN","id":"123baa57-f72ee74e","active":true},"weight":-0.4813020538780015,"active":true},{"inputNode":{"type":"HIDDEN","id":"123baa57-f72ee74e","active":true},"outputNode":{"type":"HIDDEN","id":"c625c4c5-c40db14b","active":true},"weight":0.6567454663216941,"active":true},{"inputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"outputNode":{"type":"HIDDEN","id":"0f581b7b-117095f7","active":true},"weight":-0.7066094771507401,"active":true},{"inputNode":{"type":"HIDDEN","id":"0f581b7b-117095f7","active":true},"outputNode":{"type":"HIDDEN","id":"4155502a-d5ec628c","active":true},"weight":-0.26903765314434747,"active":true},{"inputNode":{"type":"INPUT","id":"675d79be-fb14a540","active":true},"outputNode":{"type":"HIDDEN","id":"981a264f-6465bde9","active":true},"weight":-0.8160630963996418,"active":true},{"inputNode":{"type":"HIDDEN","id":"981a264f-6465bde9","active":true},"outputNode":{"type":"HIDDEN","id":"5bb00fad-cea2bdb4","active":true},"weight":0.41050117012537557,"active":true},{"inputNode":{"type":"INPUT","id":"cbb0ae59-c3cbbb9d","active":true},"outputNode":{"type":"HIDDEN","id":"bef99c4c-d59c0520","active":true},"weight":0.6554769668958125,"active":true},{"inputNode":{"type":"HIDDEN","id":"bef99c4c-d59c0520","active":true},"outputNode":{"type":"OUTPUT","id":"8794a36b-538fb9b1","active":true},"weight":0.1754831930730978,"active":true},{"inputNode":{"type":"HIDDEN","id":"6e807aa2-8d313718","active":true},"outputNode":{"type":"HIDDEN","id":"ad9a71ed-3cad0fe1","active":true},"weight":-0.536543941858513,"active":true},{"inputNode":{"type":"HIDDEN","id":"ad9a71ed-3cad0fe1","active":true},"outputNode":{"type":"OUTPUT","id":"c9efc776-0e329276","active":true},"weight":0.2925050280962167,"active":true},{"inputNode":{"type":"INPUT","id":"9b2fb558-557820f4","active":true},"outputNode":{"type":"HIDDEN","id":"fa40fdfb-b831a18f","active":true},"weight":-0.5680191801805079,"active":true},{"inputNode":{"type":"HIDDEN","id":"fa40fdfb-b831a18f","active":true},"outputNode":{"type":"HIDDEN","id":"123baa57-f72ee74e","active":true},"weight":-0.8625564370634011,"active":true},{"inputNode":{"type":"HIDDEN","id":"c625c4c5-c40db14b","active":true},"outputNode":{"type":"HIDDEN","id":"37d876a8-af66790f","active":true},"weight":0.1778258420157397,"active":true},{"inputNode":{"type":"HIDDEN","id":"8ab26d5d-10c8cf80","active":true},"outputNode":{"type":"HIDDEN","id":"4082f0e2-10b9ea37","active":true},"weight":-0.42781165249314457,"active":true},{"inputNode":{"type":"HIDDEN","id":"4082f0e2-10b9ea37","active":true},"outputNode":{"type":"OUTPUT","id":"e4e412f5-5c381d81","active":true},"weight":0.43332924005555373,"active":false},{"inputNode":{"type":"INPUT","id":"cbb0ae59-c3cbbb9d","active":true},"outputNode":{"type":"HIDDEN","id":"b9ce33b7-247fbd97","active":true},"weight":0.22329462844644032,"active":true},{"inputNode":{"type":"HIDDEN","id":"b9ce33b7-247fbd97","active":true},"outputNode":{"type":"HIDDEN","id":"bef99c4c-d59c0520","active":true},"weight":-0.2872203016133681,"active":true},{"inputNode":{"type":"HIDDEN","id":"4082f0e2-10b9ea37","active":true},"outputNode":{"type":"HIDDEN","id":"cee34bde-ca545c01","active":true},"weight":0.0032078718193808697,"active":true},{"inputNode":{"type":"HIDDEN","id":"cee34bde-ca545c01","active":true},"outputNode":{"type":"OUTPUT","id":"e4e412f5-5c381d81","active":true},"weight":0.6849027876520215,"active":true}],"fitness":172.31495475513924}');
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

			Car.CarInstance.stats.distanceTravelled += Math.sqrt(Math.pow(Car.CarInstance.velocity.x, 2) + Math.pow(Car.CarInstance.velocity.y, 2));
			Car.CarInstance.stats.survivalTime += 1;

			const response = Car.genome.activate(Car.CarInstance.getDistances(Sim.tiles))

			Car.CarInstance.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);
		});

		if (fancy) FancyVis.update(Cars)
		else Vis.update(Cars)

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