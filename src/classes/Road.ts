import type { Coordinate, Line, Tile, tileType } from "../types"
import { round, directions } from "./utils.js";

export class Road {
	constructor(
		public tileSize: number,
		public resolution: number,
		public roadWidth: number
	) { }

	createTile = (type: tileType, topLeft: Coordinate): Tile => {
		const lines: Line[] = [];

		const halfEmptySpace = (this.tileSize - this.roadWidth) * 0.5

		const { from, to } = type

		if (directions.indexOf(type.from) % 2 == directions.indexOf(type.to) % 2) {
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
		} else {
			const angleStep = Math.PI / 2 / this.resolution

			const points: Coordinate[][] = [[], []]

			for (let i = 0; i < this.resolution + 1; i++) {
				const angle = i * angleStep

				const cos = Math.cos(angle)
				const sin = Math.sin(angle)

				let xA = round(halfEmptySpace * 3 * cos, this.resolution)
				let yA = round(halfEmptySpace * 3 * sin, this.resolution)

				let xB = round(halfEmptySpace * cos, this.resolution)
				let yB = round(halfEmptySpace * sin, this.resolution)

				if (from === "left" && to === "top" || from === "top" && to === "left") {
					points[0].push([xA + topLeft[0], yA + topLeft[1]])
					points[1].push([xB + topLeft[0], yB + topLeft[1]])
				} else if (from === "bottom" && to === "right" || from === "right" && to === "bottom") {
					points[1].push([this.tileSize - xA + topLeft[0], this.tileSize - yA + topLeft[1]])
					points[0].push([this.tileSize - xB + topLeft[0], this.tileSize - yB + topLeft[1]])
				} else if (from === "top" && to === "right" || from === "right" && to === "top") {
					points[1].push([this.tileSize - xA + topLeft[0], yA + topLeft[1]])
					points[0].push([this.tileSize - xB + topLeft[0], yB + topLeft[1]])
				} else if (from === "left" && to === "bottom" || from === "bottom" && to === "left") {
					points[1].push([xA + topLeft[0], this.tileSize - yA + topLeft[1]])
					points[0].push([xB + topLeft[0], this.tileSize - yB + topLeft[1]])
				}
			}

			for (let i = 0; i < points[0].length - 1; i++) {
				const startingPointA = points[0][i]
				const endingPointA = points[0][i + 1]

				const slopeA = round((endingPointA[1] - startingPointA[1]) / (endingPointA[0] - startingPointA[0]), this.resolution)
				const constantA = round(startingPointA[1] - slopeA * startingPointA[0], this.resolution)

				const startingPointB = points[1][i]
				const endingPointB = points[1][i + 1]

				const slopeB = round((endingPointB[1] - startingPointB[1]) / (endingPointB[0] - startingPointB[0]), this.resolution)
				const constantB = round(startingPointB[1] - slopeB * startingPointB[0], this.resolution)

				lines.push(...[{
					startingPoint: startingPointB,
					endingPoint: endingPointB,
					slope: slopeB,
					constant: constantB
				}, {
					startingPoint: startingPointA,
					endingPoint: endingPointA,
					slope: slopeA,
					constant: constantA
				}])
			}
		}

		return {
			lines: lines,
			topLeft: topLeft,
			type: type
		}
	}
}