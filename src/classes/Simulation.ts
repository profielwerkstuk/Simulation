import { Road } from "./Road.js";

export class Simulation {
	public tiles = [];
	private roadGen;

	constructor(
		public gridSize: [width: number, height: number],
		public tileSize: number,
		public roadWidth: number,
		public roadResolution: number,
	) {
		this.roadGen = new Road(this.tileSize, this.tileSize, this.roadResolution, this.roadWidth);
		this.roadGen.createTile("straight", [0, 0], "left", "top");
	}



	cycle = () => {

	}
}