import type { Coordinate, Line, Tile, tileType } from "../types"
import { round } from "./utils.js";

export class Road {
	constructor(
		public tileSize: number,
		public resolution: number,
		public roadWidth: number
	) { }

	createTile = (type: tileType, topLeft: Coordinate, from: "top" | "bottom" | "left" | "right", to: "top" | "bottom" | "left" | "right"): Tile => {
		const lines: Line[] = [];

		const halfEmptySpace = (this.tileSize - this.roadWidth) * 0.5

		if (type === "straight") {
			let startingPointA: Coordinate = [0, 0];
			let endingPointA: Coordinate = [0, 0];

			let startingPointB: Coordinate = [0, 0];
			let endingPointB: Coordinate = [0, 0];

			const opposite = this.tileSize - halfEmptySpace

			if (from === "top" || to === "top" || from === "bottom" || to === "bottom") {
				startingPointA = [halfEmptySpace + topLeft[0], this.tileSize + topLeft[1]]
				endingPointA = [halfEmptySpace + topLeft[0], topLeft[1]]

				startingPointB = [opposite + topLeft[0], this.tileSize + topLeft[1]]
				endingPointB = [opposite + topLeft[0], topLeft[1]]
			} else {
				startingPointA = [topLeft[0], halfEmptySpace + topLeft[1]]
				endingPointA = [this.tileSize + topLeft[0], halfEmptySpace + topLeft[1]]

				startingPointB = [topLeft[0], opposite + topLeft[1]]
				endingPointB = [this.tileSize + topLeft[0], opposite + topLeft[1]]
			}

			lines.push(...[{
				startingPoint: startingPointA,
				endingPoint: endingPointA,
				slope: 0,
				constant: 0
			}, {
				startingPoint: startingPointB,
				endingPoint: endingPointB,
				slope: 0,
				constant: 0
			}])
		} else { // TODO: Simplify (Group pointsA and pointsB into one array and combine the last two for loops)
			const angleStep = Math.PI / 2 / this.resolution

			const pointsA: Coordinate[] = []
			const pointsB: Coordinate[] = []

			for (let i = 0; i < this.resolution + 1; i++) {
				const angle = i * angleStep
				let x = round(halfEmptySpace * 3 * Math.cos(angle), this.resolution)
				let y = round(halfEmptySpace * 3 * Math.sin(angle), this.resolution)

				if (from === "left" && to === "top" || from === "top" && to === "left") {
					pointsA.push([x + topLeft[0], y + topLeft[1]])
				} else if (from === "bottom" && to === "right" || from === "right" && to === "bottom") {
					pointsB.push([this.tileSize - x + topLeft[0], this.tileSize - y + topLeft[1]])
				} else if (from === "top" && to === "right" || from === "right" && to === "top") {
					pointsB.push([this.tileSize - x + topLeft[0], y + topLeft[1]])
				} else if (from === "left" && to === "bottom" || from === "bottom" && to === "left") {
					pointsA.push([x + topLeft[0], this.tileSize - y + topLeft[1]])
				}

				x = round(halfEmptySpace * Math.cos(angle), this.resolution)
				y = round(halfEmptySpace * Math.sin(angle), this.resolution)

				if (from === "left" && to === "top" || from === "top" && to === "left") {
					pointsB.push([x + topLeft[0], y + topLeft[1]])
				} else if (from === "bottom" && to === "right" || from === "right" && to === "bottom") {
					pointsA.push([this.tileSize - x + topLeft[0], this.tileSize - y + topLeft[1]])
				} else if (from === "top" && to === "right" || from === "right" && to === "top") {
					pointsA.push([this.tileSize - x + topLeft[0], y + topLeft[1]])
				} else if (from === "left" && to === "bottom" || from === "bottom" && to === "left") {
					pointsB.push([x + topLeft[0], this.tileSize - y + topLeft[1]])
				}
			}

			for (let i = 0; i < pointsA.length - 1; i++) {
				const startingPoint = pointsA[i]
				const endingPoint = pointsA[i + 1]

				const slope = round((endingPoint[1] - startingPoint[1]) / (endingPoint[0] - startingPoint[0]), this.resolution)
				const constant = round(startingPoint[1] - slope * startingPoint[0], this.resolution)

				lines.push({
					startingPoint: startingPoint,
					endingPoint: endingPoint,
					slope: slope,
					constant: constant
				})
			}

			for (let i = 0; i < pointsB.length - 1; i++) {
				const startingPoint = pointsB[i]
				const endingPoint = pointsB[i + 1]

				const slope = round((endingPoint[1] - startingPoint[1]) / (endingPoint[0] - startingPoint[0]), this.resolution)
				const constant = round(startingPoint[1] - slope * startingPoint[0], this.resolution)

				lines.push({
					startingPoint: startingPoint,
					endingPoint: endingPoint,
					slope: slope,
					constant: constant
				})
			}
		}

		console.log(lines)

		return {
			lines: lines,
			topLeft: topLeft
		}
	}
}