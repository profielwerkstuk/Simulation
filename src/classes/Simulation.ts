import { Road } from "./Road.js";

export class Simulation {
	public tiles = [];
	private roadGen;

	constructor(
		public gridSize: [width: number, height: number],
		public tileSize: number,
		public roadWidth: number
	) {
		this.roadGen = new Road(roadWidth, this.tileSize)
	}



	cycle = () => {

	}
}