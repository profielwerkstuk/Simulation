import { generateTile } from "../utils.js";
import { RoadGenerator } from "./RoadGenerator.js";

import type { Coordinate, Tile } from "../types";
import { getLineFormula, setWalls } from "../Mathamphetamine.js";
import { Emitter } from "./Emitter.js";

export class Simulation {
	public tiles: Tile[] = [];
	private roadGenerator: RoadGenerator;

	constructor(
		public gridSize: [number, number],
		public tileSize: number,
		public roadWidth: number,
		public roadCurveResolution: number,
		public carSpawnPoint: Coordinate
	) {
		this.roadGenerator = new RoadGenerator(this.tileSize, this.roadCurveResolution, this.roadWidth);

		if (typeof window !== "undefined") {
			addEventListener("generateTile", () => {
				const generatedTile = generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize, this.carSpawnPoint);
				const nextTile = this.roadGenerator.createTile(...generatedTile);
				this.tiles.push(nextTile);

				// Only keep 3 tiles on the screen at all times
				if (this.tiles.length > 3) this.tiles.shift();
			})
		} else {
			const emi = new Emitter().emitter;
			emi.on("generateTile", () => {
				const generatedTile = generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize, this.carSpawnPoint);
				const nextTile = this.roadGenerator.createTile(...generatedTile);
				this.tiles.push(nextTile);

				// Only keep 3 tiles on the screen at all times
				if (this.tiles.length > 3) this.tiles.shift();
			})
		}


	}

	init = () => {
		this.tiles = [];
		// NodeJS env
		if (typeof window === "undefined") {
			const emi = new Emitter().emitter;
			emi.emit("generateTile");
		} else {
			const event = new CustomEvent("generateTile");
			dispatchEvent(event);
			dispatchEvent(event);
		}


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