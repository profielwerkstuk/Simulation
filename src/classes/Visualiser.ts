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

        this.ctx.fillStyle = "red";
        Simulation.tiles.forEach(tile => {
            tile.lines.forEach((line: { startingPoint: Coordinate; endingPoint: Coordinate; }) => {
                this.ctx.beginPath();
                this.ctx.moveTo(...line.startingPoint);
                this.ctx.lineTo(...line.endingPoint);
                this.ctx.stroke();
            })
        })

        // Render car
        this.ctx.fillStyle = "blue";
        this.ctx.translate((Car.coordinates[0] + Car.width / 2), (Car.coordinates[1] + Car.height / 2));
        this.ctx.rotate(Car.angle);
        this.ctx.translate(-(Car.coordinates[0] + Car.width / 2), -(Car.coordinates[1] + Car.height / 2));

        this.ctx.fillRect(Car.coordinates[0] - Car.width / 2, Car.coordinates[1] - Car.height / 2, Car.width, Car.height);
    }
}