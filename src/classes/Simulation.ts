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
		this.tiles.push(this.roadGen.createTile({from: "right", to: "bottom"}, [0, 0]));
		this.tiles.push(this.roadGen.createTile({from: "right", to: "left"}, [40, 0]));
		this.tiles.push(this.roadGen.createTile({from: "left", to: "bottom"}, [80, 0]));
		this.tiles.push(this.roadGen.createTile({from: "top", to: "bottom"}, [80, 40]));
		this.tiles.push(this.roadGen.createTile({from: "top", to: "left"}, [80, 80]));
		this.tiles.push(this.roadGen.createTile({from: "left", to: "right"}, [40, 80]));
		this.tiles.push(this.roadGen.createTile({from: "right", to: "top"}, [0, 80]));
		this.tiles.push(this.roadGen.createTile({from: "bottom", to: "top"}, [0, 40]));
	}



	cycle = () => {

	}
}