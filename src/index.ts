import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";
import type { Coordinate } from "./types.js";
import { ActivationFunctions, NEAT } from "./classes/NEAT/NEAT.js";
import { FancyVisualiser } from "./classes/FancyVisualiser.js";

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
Car.toggleManual();

let fancy = true;

addEventListener("terminateRun", () => {
	Vis.init();
	Sim.init();
	Car.reset();
});

function fitnessFunction(a: { activate: (arg0: number[]) => any; }): Promise<number> {
    return new Promise((resolve) => {
        Car.reset();
        Sim.reset();

        let fitness = 0.001;


        const render = () => {
            Car.update(Sim.tiles);
            if (fancy) FancyVis.update(Car);
            else Vis.update(Car);

            const response = a.activate(Car.getDistances(Sim.tiles))

            Car.steer(response[0] > 0, response[1] > 0, response[2] > 0, response[3] > 0);


            if (Car.stats.survivalTime > 250 && Car.stats.distanceTravelled < 1) {
                fitness = 0;
                resolve(fitness);
            } else if (Car.stats.survivalTime > 99999 || (Car.stats.survivalTime > 100 && Car.velocity.x + Car.velocity.y < 1)) {
                fitness = Car.stats.distanceTravelled;
                resolve(fitness);
            } else {
                requestAnimationFrame(render);
            }
        }

        render();
    });
}

let config = {
    populationSize: 10,
    structure: {
        in: 5,
        hidden: 0,
        out: 4,
        activationFunction: ActivationFunctions.SIGMOID
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
    maxEpoch: 100,
};

const neat = new NEAT(config);
console.log('Starting...');

// on P pressed
addEventListener("keypress", (e) => {
	if (e.key === "p") {
		neat.run();
	}
});