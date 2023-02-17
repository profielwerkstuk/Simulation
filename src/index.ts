import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";

const Sim = new Simulation([15, 15], 40, 20);
const Vis = new Visualiser("canvas");
const Car = new _Car([100, 100], 8, 16);
// Car.toggleManual();
Vis.init(Sim);

function render() {
	Car.update();
	Car.steer(true, false, true, false);
	Vis.update(Sim, Car);

	requestAnimationFrame(render);
};
render();
