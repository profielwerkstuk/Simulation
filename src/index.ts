import { Simulation } from "./classes/Simulation.js";
import { Visualiser } from "./classes/Visualiser.js";
import { Car as _Car } from "./classes/Car.js";
import { mulberry32 } from "./classes/utils.js";


const S4 = () => {
	return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
};

function createEnvironment() {
	const id = `${S4()+S4()}-${S4()+S4()}`

	const Sim = new Simulation(id, [15, 15], 40, 20, 5);

	// create a canvas element with id ID
	const canvas = document.createElement("canvas");
	canvas.id = id;
	canvas.width = 800;
	canvas.height = 800;
	document.body.appendChild(canvas);


	const Vis = new Visualiser(id);
	const Car = new _Car(id, [20, 0], 4, 8);
	Car.toggleManual();
	Vis.init(Sim);

	function render() {
		Car.update();
		Vis.update(Sim, Car);

		requestAnimationFrame(render);
	};
	render();

	return { Sim, Vis, Car, id };
}

function deleteEnvironment(id: string) {
	const canvas = document.getElementById(id);
	canvas!.remove();
}

const env = createEnvironment();

const random = mulberry32(5);

console.log(random(), random(), random(), random(), random(), random(), random())

const random2 = mulberry32(5);
console.log(random2(), random2(), random2(), random2(), random2(), random2(), random2())
