import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";

const Sim = new Simulation([15, 15], 40, 20, 5);
const Vis = new Visualiser("canvas");
const Car = new _Car([20, 0], 4, 8);
Car.toggleManual();
Vis.init(Sim);

function render() {
	Car.update();
	Car.steer(true, false, true, false);
	Vis.update(Sim, Car);

	requestAnimationFrame(render);
};
render();
