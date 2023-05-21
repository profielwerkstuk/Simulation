import { MersenneTwister, generateTile } from "../utils.js";
import { RoadGenerator } from "./RoadGenerator.js";

import type { Coordinate, Tile } from "../types";
import { getLineFormula, setWalls } from "../Mathamphetamine.js";

export class Simulation {
	public tiles: Tile[] = [];
	private roadGenerator: RoadGenerator;
	public mersenneTwister = new MersenneTwister(0);

	constructor(
		public gridSize: [number, number],
		public tileSize: number,
		public roadWidth: number,
		public roadCurveResolution: number
	) {
		this.roadGenerator = new RoadGenerator(this.tileSize, this.roadCurveResolution, this.roadWidth);

		addEventListener("generateTile", () => {
			const generatedTile = generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize, this.mersenneTwister);
			const nextTile = this.roadGenerator.createTile(...generatedTile);
			this.tiles.push(nextTile);

			// Only keep 3 tiles on the screen at all times
			if (this.tiles.length > 3) this.tiles.shift();
		})
	}

	init = () => {
		this.tiles = [];
		const event = new CustomEvent("generateTile");
		dispatchEvent(event);
		dispatchEvent(event);

		const TL = [0, 0] as Coordinate;
		const BL = [0, this.gridSize[0] * this.tileSize] as Coordinate;
		const TR = [this.gridSize[1] * this.tileSize, 0] as Coordinate;
		const BR = [this.gridSize[1] * this.tileSize, this.gridSize[0] * this.tileSize] as Coordinate;

		setWalls([
			getLineFormula(TL, TR),
			getLineFormula(TR, BR),
			getLineFormula(BL, BR),
			getLineFormula(TL, BL)
		])
	}

	reset = () => {
		this.init();
	}
}