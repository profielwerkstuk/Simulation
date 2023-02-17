import type { Coordinate, Line, Tile, tileType } from "../types"
import { round } from "./utils.js";

export class Road {
	constructor(
		public width: number,
		public tileSize: number,
		public resolution: number,
		public roadWidth: number
	) { }

	createTile = (type: tileType, topLeft: Coordinate, from: "top" | "bottom" | "left" | "right", to: "top" | "bottom" | "left" | "right"): Tile => {
		const lines: Line[] = [];

		if (type === "straight") {
			let startingPoint: Coordinate = [this.roadWidth - this.tileSize / 4, 0]
			let endingPoint: Coordinate = [this.roadWidth - this.tileSize / 4, this.tileSize]

			let slope = (endingPoint[1] - startingPoint[1]) / (endingPoint[0] - startingPoint[0])
			let constant = startingPoint[1] - slope * startingPoint[0]

			lines.push({
				startingPoint: startingPoint,
				endingPoint: endingPoint,
				slope: 0,
				constant: 0
			})

			startingPoint = [this.tileSize - this.roadWidth / 2, 0]
			endingPoint = [this.tileSize - this.roadWidth / 2, this.tileSize]

			slope = (endingPoint[1] - startingPoint[1]) / (endingPoint[0] - startingPoint[0])
			constant = startingPoint[1] - slope * startingPoint[0]

			lines.push({
				startingPoint: startingPoint,
				endingPoint: endingPoint,
				slope: 0,
				constant: 0
			})
		} else { // TODO: Simplify (Group pointsA and pointsB into one array and combine the last two for loops)
			const angleStep = Math.PI / 2 / this.resolution

			const pointsA: Coordinate[] = []
			const pointsB: Coordinate[] = []

			const halfEmptySpace = (this.tileSize - this.roadWidth) * 0.5

			for (let i = 0; i < this.resolution + 1; i++) {
				const angle = i * angleStep
				let x = round(halfEmptySpace * 3 * Math.cos(angle), this.resolution)
				let y = round(halfEmptySpace * 3 * Math.sin(angle), this.resolution)

				if (from === "left" && to === "bottom") {
					pointsA.push([x, y])
				} else if (from === "top" && to === "right") {
					pointsB.push([40 - x, 40 - y])
				} else if (from === "bottom" && to === "right") {
					pointsB.push([x, 40 - y])
				} else if (from === "left" && to === "top") {
					pointsA.push([x, 40 - y])
				}

				x = round(halfEmptySpace * Math.cos(angle), this.resolution)
				y = round(halfEmptySpace * Math.sin(angle), this.resolution)

				if (from === "left" && to === "bottom") {
					pointsB.push([x, y])
				} else if (from === "top" && to === "right") {
					pointsA.push([40 - x, 40 - y])
				} else if (from === "bottom" && to === "right") {
					pointsA.push([x, 40 - y])
				} else if (from === "left" && to === "top") {
					pointsB.push([x, 40 - y])
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