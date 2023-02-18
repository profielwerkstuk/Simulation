import { Tile } from "../types.js";
import { Road } from "./Road.js";

export class Simulation {
	public tiles: Tile[] = [];
	private roadGen;

	constructor(
		public gridSize: [width: number, height: number],
		public tileSize: number,
		public roadWidth: number,
		public roadResolution: number,
	) {
		this.roadGen = new Road(this.tileSize, this.roadResolution, this.roadWidth);
		this.tiles.push(this.roadGen.createTile("curve", [0, 0], "right", "bottom"));
	}



	cycle = () => {

	}
}