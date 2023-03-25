import type { Simulation } from "./Simulation";
import type { Car } from "./Car";

let logOne = 0;

export class Visualiser {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	constructor(public canvasID: string, public Simulation: Simulation) {
		const canvas = document.getElementById(canvasID);
		if (!canvas) throw new Error("No canvas could be found for the visualiser.");
		else this.canvas = canvas as HTMLCanvasElement;

		const ctx = this.canvas.getContext("2d");
		if (!ctx) throw new Error("No CanvasRenderingContext could be found?");
		else this.ctx = ctx;

		this.canvas.width = Simulation.gridSize[0] * Simulation.tileSize;
		this.canvas.height = Simulation.gridSize[1] * Simulation.tileSize;
	}

	init = () => {
		this.drawSquares();
	}

	drawSquares = () => {
		for (let i = 0; i < this.Simulation.gridSize[0]; i++) {
			for (let j = 0; j < this.Simulation.gridSize[1]; j++) {
				const xCoord = i * this.Simulation.tileSize;
				const yCoord = j * this.Simulation.tileSize;
				this.ctx.fillStyle = (i + j) % 2 === 0 ? "#f0d9b5" : "#b58863";
				this.ctx.fillRect(xCoord, yCoord, this.Simulation.tileSize, this.Simulation.tileSize);
			}
		}
	}

	update = (Car: Car) => {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw the backdrop
		this.drawSquares();

		this.ctx.strokeStyle = "black";
		this.Simulation.tiles.forEach(tile => {
			tile.lines.forEach((line) => {
				this.ctx.beginPath();
				this.ctx.moveTo(...line.startingPoint);
				this.ctx.lineTo(...line.endingPoint);
				this.ctx.stroke();

				this.ctx.fillStyle = "orange";
				this.ctx.fillRect(line.startingPoint[0] - 2, line.startingPoint[1] - 2, 4, 4);
				this.ctx.fillStyle = "green";
				this.ctx.fillRect(line.endingPoint[0] - 2, line.endingPoint[1] - 2, 4, 4);
			})
		});


		// # Render car
		this.ctx.fillStyle = "blue";

		// This rotates and transforms the canvas so the car is properly drawn
		this.ctx.translate(Car.coordinates[0], Car.coordinates[1]);
		this.ctx.rotate(Car.angle);
		this.ctx.translate(-Car.coordinates[0], -Car.coordinates[1]);

		this.ctx.fillRect(Car.coordinates[0] - Car.width / 2, Car.coordinates[1] - Car.height / 2, Car.width, Car.height);

		// Draw a red dot in the centre of the car
		this.ctx.fillStyle = "red"
		this.ctx.fillRect(Car.coordinates[0] - 1, Car.coordinates[1] - 1, 2, 2);

		// Reset all the canvas transformations of the car
		this.ctx.resetTransform();

		const lines = Car.getLines();

		lines.forEach(p => {
			if (!p.startingPoint || !p.endingPoint) return;

			this.ctx.fillRect(p.startingPoint[0], p.startingPoint[1], 1, 1)

			this.ctx.strokeStyle = "red";
			this.ctx.beginPath();
			this.ctx.moveTo(...p.startingPoint);

			this.ctx.lineTo(...p.endingPoint);
			this.ctx.stroke();
		})

		const intersections = Car.getIntersections(this.Simulation.tiles);
		this.ctx.fillStyle = "purple";
		intersections.forEach(point => {
			if (point) this.ctx.fillRect(point[0] - 2, point[1] - 2, 4, 4);
		});
	}
}