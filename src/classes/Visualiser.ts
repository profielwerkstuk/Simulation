import { Coordinate } from "../types.js";
import type { Car } from "./Car.js";
import type { Simulation } from "./Simulation.js";

export class Visualiser {
	private ctx: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;

	constructor(canvasID: string) {
		this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
	}

	init = (Simulation: Simulation) => {
		this.canvas.width = Simulation.gridSize[0] * Simulation.tileSize;
		this.canvas.height = Simulation.gridSize[1] * Simulation.tileSize;

		for (let i = 0; i < Simulation.gridSize[0]; i++) {
			for (let j = 0; j < Simulation.gridSize[1]; j++) {
				const xCoord = i * Simulation.tileSize;
				const yCoord = j * Simulation.tileSize;
				this.ctx.fillStyle = (i + j) % 2 === 0 ? "#f0d9b5" : "#b58863";
				this.ctx.fillRect(xCoord, yCoord, Simulation.tileSize, Simulation.tileSize);
			}
		}
	}

	update = (Simulation: Simulation, Car: Car) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.init(Simulation);

		Simulation.tiles.forEach(tile => {
			tile.lines.forEach((line: { startingPoint?: Coordinate; endingPoint?: Coordinate; }) => {
				this.ctx.beginPath();
				this.ctx.moveTo(...line.startingPoint!);
				this.ctx.lineTo(...line.endingPoint!);
				this.ctx.stroke();

				this.ctx.fillStyle = "orange";
				this.ctx.fillRect(line.startingPoint![0] - 2, line.startingPoint![1] - 2, 4, 4);
				this.ctx.fillStyle = "green";
				this.ctx.fillRect(line.endingPoint![0] - 2, line.endingPoint![1] - 2, 4, 4);
			})
		})

		// Render car
		this.ctx.fillStyle = "blue";
		this.ctx.translate(Car.coordinates[0], Car.coordinates[1]);
		this.ctx.rotate(Car.angle);
		this.ctx.translate(-Car.coordinates[0], -Car.coordinates[1]);

		this.ctx.fillRect(Car.coordinates[0] - Car.width / 2, Car.coordinates[1] - Car.height / 2, Car.width, Car.height);

		this.ctx.fillStyle = "red"
		this.ctx.fillRect(Car.coordinates[0] - 1, Car.coordinates[1] - 1, 2, 2);

		// UNDER NO CIRCUMASTANCES SHOULD YOU REMOVE THIS LINE
		// FAILURE TO COMPLY WILL RESULT IN REMOVAL OF YOUR KNEECAPS
		// this.ctx.resetTransform();

		// const lines = Car.getLines();

		// lines.forEach(p => {
		// 	if (!p.startingPoint) return;

		// 	// this.ctx.fillRect(p.startingPoint[0], p.startingPoint[1], 1, 1)

		// 	const randomMathConstant = 100;

		// 	this.ctx.strokeStyle = "red";
		// 	this.ctx.beginPath();
		// 	this.ctx.moveTo(...p.startingPoint);
		// 	const endingPoint: [number, number] = [(p.startingPoint[1] + randomMathConstant - p.constant) / p.slope, p.startingPoint[1] + randomMathConstant]
		// 	this.ctx.lineTo(...endingPoint);
		// 	this.ctx.stroke();
		// })

		this.ctx.resetTransform();

		const lines = Car.getLines();

		lines.forEach(p => {
			if (!p.startingPoint || !p.endingPoint) return;

			this.ctx.fillRect(p.startingPoint[0], p.startingPoint[1], 1, 1)

			const randomMathConstant = 10;

			this.ctx.strokeStyle = "red";
			this.ctx.beginPath();
			this.ctx.moveTo(...p.startingPoint);

			const endingPoint: [number, number] = [
				(p.startingPoint[1] + randomMathConstant - p.constant) / p.slope,
				p.startingPoint[1] + randomMathConstant
			];

			this.ctx.lineTo(...p.endingPoint);
			this.ctx.stroke();
		})




		// const intersections = Car.getDistances(Simulation.tiles);
		// intersections.forEach(line => {
		// 	line.intersections.forEach(intersect => {
		// 		this.ctx.fillStyle = "purple";
		// 		this.ctx.fillRect(intersect[0], intersect[1], 3, 3);
		// 	})
		// })

		this.ctx.fillRect(10, 10, 3, 3)
	}
}

// // UNDER NO CIRCUMASTANCES SHOULD YOU REMOVE THIS LINE
// // FAILURE TO COMPLY WILL RESULT IN REMOVAL OF YOUR KNEECAPS
// this.ctx.resetTransform();