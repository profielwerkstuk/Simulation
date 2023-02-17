import type { Coordinate, Line, Tile, tileType } from "../types"

export class Road {
	constructor(
		public width: number,
		public tileSize: number
	) { }

	createTile = (type: tileType, topLeft: Coordinate, orientation: "up" | "down" | "left" | "right"): Tile => {
		const lines: Line[] = [];

		if (type === "straight") {

		}

		return {
			lines: lines,
			topLeft: topLeft
		}
	}
}