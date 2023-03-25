import { generateTile } from "../utils.js";
import { RoadGenerator } from "./RoadGenerator.js";

import type { Tile } from "../types";

export class Simulation {
	readonly tiles: Tile[] = [];
	private roadGenerator: RoadGenerator;

	constructor(
		public gridSize: [number, number],
		public tileSize: number,
		public roadWidth: number,
		public roadCurveResolution: number
	) {
		this.roadGenerator = new RoadGenerator(this.tileSize, this.roadCurveResolution, this.roadWidth);

		addEventListener("generateTile", () => {
			const generatedTile = generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize);
			const nextTile = this.roadGenerator.createTile(...generatedTile);
			this.tiles.push(nextTile);

			// Only keep 3 tiles on the screen at all times
			if (this.tiles.length > 3) this.tiles.shift();
		})
	}

	init = () => {
		const event = new CustomEvent("generateTile");
		dispatchEvent(event);
		dispatchEvent(event);
	}
}