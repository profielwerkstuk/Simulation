import { Visualiser } from "./Visualiser.js";

import type { Car } from "./Car";
import type { Direction } from "../types.js";
import { Genome } from "./NEAT/Genome.js";

const directions: Direction[] = ["top", "left", "bottom", "right"];

const carImage = new Image();
carImage.src = "https://cdn.discordapp.com/attachments/926193286278950993/1089557223878967386/image.png";
// img.src = "https://cdn.discordapp.com/attachments/779080769569947681/1089577714618466354/image.png"; kachigga

const grassImage = new Image();
grassImage.src = "https://media.istockphoto.com/id/474672896/photo/grass-field.jpg?s=612x612&w=0&k=20&c=4DCg7OH6vd9eJYQq1ysujMbgYi2bF-0ff_l8Mx3OOzg=";


export class FancyVisualiser extends Visualiser {
	drawSquares = () => {
		for (let i = 0; i < this.Simulation.gridSize[0]; i++) {
			for (let j = 0; j < this.Simulation.gridSize[1]; j++) {
				const xCoord = i * this.Simulation.tileSize;
				const yCoord = j * this.Simulation.tileSize;
				// this.ctx.fillStyle = (i + j) % 2 === 0 ? "#97C73C" : "#7F8C46";
				// this.ctx.fillRect(xCoord, yCoord, this.Simulation.tileSize, this.Simulation.tileSize);

				this.ctx.drawImage(
					grassImage,
					0,
					0,
					grassImage.width,
					grassImage.height,
					xCoord,
					yCoord,
					this.Simulation.tileSize,
					this.Simulation.tileSize
				);
			}
		}
	}

	update = (Cars: { CarInstance: Car, genome: Genome }[]) => {
		// # Clear the canvas
		// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// # Draw the backdrop
		this.drawSquares();

		// # Fill the roads
		this.ctx.fillStyle = "#4A4D49";
		this.ctx.strokeStyle = "#4A4D49";
		this.Simulation.tiles.forEach(tile => {
			this.ctx.beginPath();
			// Straight tile
			if (directions.indexOf(tile.type.from) % 2 == directions.indexOf(tile.type.to) % 2) {
				this.ctx.moveTo(...tile.lines[0].startingPoint);
				this.ctx.lineTo(...tile.lines[0].endingPoint);
				this.ctx.lineTo(...tile.lines[1].endingPoint);
				this.ctx.lineTo(...tile.lines[1].startingPoint);
				this.ctx.fill();
				this.ctx.stroke();
			}
			// Curved tile
			else {
				this.ctx.moveTo(...tile.lines[1].startingPoint);

				for (let i = 0; i < tile.lines.length; i += 2) {
					this.ctx.lineTo(...tile.lines[i].startingPoint);
					this.ctx.lineTo(...tile.lines[i].endingPoint);
				}

				const secondToLast = tile.lines.at(-2)!;
				this.ctx.lineTo(...secondToLast.endingPoint);

				for (let i = tile.lines.length - 1; i >= 0; i -= 2) {
					this.ctx.lineTo(...tile.lines[i].endingPoint);
					this.ctx.lineTo(...tile.lines[i].startingPoint);
				}

				this.ctx.fill();
			}
		})

		const dashSize = this.Simulation.tileSize / 10;
		for (let i = 0; i < 2; i++) {
			this.ctx.strokeStyle = i === 0 ? "white" : "red";
			this.ctx.lineDashOffset = i === 0 ? dashSize : 0;
			this.ctx.setLineDash([dashSize, dashSize])
			this.Simulation.tiles.forEach(tile => {
				tile.lines.forEach((line) => {
					this.ctx.beginPath();
					this.ctx.moveTo(...line.startingPoint);
					this.ctx.lineTo(...line.endingPoint);
					this.ctx.stroke();
				})
			});
			// reset the line dash
			this.ctx.setLineDash([]);
		}

		for (const _Car of Cars) {
			const Car = _Car.CarInstance;

			// # Render car
			this.ctx.fillStyle = "blue";

			// This rotates and transforms the canvas so the car is properly drawn
			this.ctx.translate(Car.coordinates[0], Car.coordinates[1]);
			this.ctx.rotate(Car.angle);
			this.ctx.translate(-Car.coordinates[0], -Car.coordinates[1]);


			this.ctx.shadowColor = "black";
			this.ctx.shadowBlur = Math.floor(Car.width / 10);
			this.ctx.drawImage(
				carImage,
				0,
				0,
				carImage.width,
				carImage.height,
				Car.coordinates[0] - Car.width / 2,
				Car.coordinates[1] - Car.height / 2,
				Car.width,
				Car.height
			);
			this.ctx.shadowBlur = 0;

			// Draw a red dot in the centre of the car
			this.ctx.fillStyle = "red"
			this.ctx.fillRect(Car.coordinates[0] - 1, Car.coordinates[1] - 1, 2, 2);

			// Reset all the canvas transformations of the car
			this.ctx.resetTransform();
		}
	}
}