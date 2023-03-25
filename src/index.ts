import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";

// Settings
const tileSize = 200;
const roadWidth = 60;
const roadCurveResolution = 5;

const Sim = new Simulation([3, 3], tileSize, roadWidth, roadCurveResolution);
const Car = new _Car([100, 100], 32, 64, tileSize);
const Vis = new Visualiser("canvas", Sim);
Sim.init();
Vis.init();
Car.toggleManual();

function render() {
	Car.update();
	Vis.update(Car);

	requestAnimationFrame(render);
}

render();