import { generateTile } from "../utils.js";
import { RoadGenerator } from "./RoadGenerator.js";

import type { Tile } from "../types";

export class Simulation {
	public tiles: Tile[] = [];
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
		this.tiles = [];
		dispatchEvent(new CustomEvent("generateTile"));
		dispatchEvent(new CustomEvent("generateTile"));
	}

	reset = () => {
		this.init();
	}
}