import type { Simulation } from "./Simulation";
import type { Car } from "./Car";
import { Canvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";

export class Visualiser {
	canvas;
	ctx;
	frameNumber = 0;
	runID = Date.now();

	constructor(public Simulation: Simulation) {
		this.canvas = new Canvas(0, 0);
		this.ctx = this.canvas.getContext("2d");

		this.canvas.width = Simulation.gridSize[0] * Simulation.tileSize;
		this.canvas.height = Simulation.gridSize[1] * Simulation.tileSize;

		mkdirSync(`./images/${this.runID}`);
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

	update = (Car: Car, epoch: number) => {
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

		// ffmpeg -framerate 60 -start_number 0 -i images/%d.png -c:v libx264 -pix_fmt yuv420p output.mp4
		// ffmpeg - y - hwaccel cuvid - framerate 60 - start_number 0 - i images /% d.png - c:v h264_nvenc - pix_fmt yuv420p - preset fast - rc vbr - b:v 10M - maxrate:v 12M - bufsize:v 10M - profile:v high - level 4.2 - g 120 - pass 1 - f mp4 / dev / null; ffmpeg - hwaccel cuvid - framerate 60 - start_number 0 - i images /% d.png - c:v h264_nvenc - pix_fmt yuv420p - preset fast - rc vbr - b:v 10M - maxrate:v 12M - bufsize:v 10M - profile:v high - level 4.2 - g 120 - pass 2 output.mp4
		if (epoch > 10) {
			const buffer = this.canvas.toBuffer("image/png");
			writeFileSync(`./images/${this.runID}/${this.frameNumber}.png`, buffer);
			this.frameNumber++;
		}
	}
}