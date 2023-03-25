import { getLineFormula } from "../Mathamphetamine.js";

import type { Coordinate, Line, tileType, Direction } from "../types";
const directions: Direction[] = ["top", "left", "bottom", "right"];

export class RoadGenerator {
	constructor(
		public tileSize: number,
		public resolution: number,
		public roadWidth: number
	) { }

	// Type is top/bottom, left/bottom etc.
	// topLeft is the coordinates of the top of the tile
	createTile = (type: tileType, topLeft: Coordinate) => {
		const lines: Line[] = [];

		// Distance from edge to line (for straight tiles)
		const halfEmptySpace = (this.tileSize - this.roadWidth) * 0.5;

		// Is it a straight tile? (no its queer)
		if (directions.indexOf(type.from) % 2 == directions.indexOf(type.to) % 2) {
			let startingPointA: Coordinate = [0, 0];
			let endingPointA: Coordinate = [0, 0];

			let startingPointB: Coordinate = [0, 0];
			let endingPointB: Coordinate = [0, 0];

			const opposite = this.tileSize - halfEmptySpace;

			// Top to bottom (or vice versa)
			if (["top", "bottom"].includes(type.from) || ["top", "bottom"].includes(type.to)) {
				startingPointA = [halfEmptySpace + topLeft[0], this.tileSize + topLeft[1]]
				endingPointA = [halfEmptySpace + topLeft[0], topLeft[1]]

				startingPointB = [opposite + topLeft[0], this.tileSize + topLeft[1]]
				endingPointB = [opposite + topLeft[0], topLeft[1]]
			}
			// Left to right (or vice versa) 
			else {
				startingPointA = [topLeft[0], halfEmptySpace + topLeft[1]]
				endingPointA = [this.tileSize + topLeft[0], halfEmptySpace + topLeft[1]]

				startingPointB = [topLeft[0], opposite + topLeft[1]]
				endingPointB = [this.tileSize + topLeft[0], opposite + topLeft[1]]
			}

			lines.push(getLineFormula(startingPointA, endingPointA));
			lines.push(getLineFormula(startingPointB, endingPointB));
		}

		// Curved tiles
		else {
			// Amount to turn per step based on resolution
			const angleStep = Math.PI / 2 / this.resolution;

			const points: Coordinate[][] = [[], []];

			for (let i = 0; i < this.resolution + 1; i++) {
				const angle = i * angleStep

				const cos = Math.cos(angle)
				const sin = Math.sin(angle)

				let xA = (halfEmptySpace + this.roadWidth) * cos;
				let yA = (halfEmptySpace + this.roadWidth) * sin;

				let xB = halfEmptySpace * cos;
				let yB = halfEmptySpace * sin;


				if (type.from === "left" && type.to === "top" || type.from === "top" && type.to === "left") {
					points[1].push([xA + topLeft[0], yA + topLeft[1]])
					points[0].push([xB + topLeft[0], yB + topLeft[1]])
				} else if (type.from === "bottom" && type.to === "right" || type.from === "right" && type.to === "bottom") {
					points[1].push([this.tileSize - xA + topLeft[0], this.tileSize - yA + topLeft[1]])
					points[0].push([this.tileSize - xB + topLeft[0], this.tileSize - yB + topLeft[1]])
				} else if (type.from === "top" && type.to === "right" || type.from === "right" && type.to === "top") {
					points[1].push([this.tileSize - xA + topLeft[0], yA + topLeft[1]])
					points[0].push([this.tileSize - xB + topLeft[0], yB + topLeft[1]])
				} else if (type.from === "left" && type.to === "bottom" || type.from === "bottom" && type.to === "left") {
					points[1].push([xA + topLeft[0], this.tileSize - yA + topLeft[1]])
					points[0].push([xB + topLeft[0], this.tileSize - yB + topLeft[1]])
				}
			}

			for (let i = 0; i < points[0].length - 1; i++) {
				const startingPointA = points[0][i]
				const endingPointA = points[0][i + 1]

				const startingPointB = points[1][i]
				const endingPointB = points[1][i + 1]

				lines.push(getLineFormula(startingPointA, endingPointA));
				lines.push(getLineFormula(startingPointB, endingPointB));
			}
		}

		return {
			lines: lines,
			topLeft: topLeft,
			type: type
		}
	}
}