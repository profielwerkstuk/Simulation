import { Coordinate, Tile, direction, tileType } from "../types.js";
import { Road } from "./Road.js";
import { directions } from "./utils.js";

function generateTile(lastTile: Tile | null = null, tileSize: number, gridSize: [width: number, height: number]): [tileType, Coordinate] {
	if (lastTile === null) {
		return [{from: "top", to: "bottom"}, [0, 0]];
	}

	const from = directions[(directions.indexOf(lastTile.type.to) + 2) % 4];
	const disallowedDirections: direction[] = [from]

	if (lastTile.topLeft[0] <= tileSize) {
		disallowedDirections.push("left");
	} if (lastTile.topLeft[1] <= tileSize) {
		disallowedDirections.push("top");
	} if (lastTile.topLeft[0] >= tileSize*(gridSize[0]-2)) {
		disallowedDirections.push("right");
	} if (lastTile.topLeft[1] >= tileSize*(gridSize[1]-2)) {
		disallowedDirections.push("bottom");
	}

	const possibleDirections = directions.filter((direction) => !disallowedDirections.includes(direction));

	const type: tileType = {from, to: possibleDirections[Math.random() * possibleDirections.length | 0]};
	let cords: Coordinate = [lastTile.topLeft[0], lastTile.topLeft[1]];

	if (from == "left") {
		cords[0] += tileSize;
	} else if (from == "right") {
		cords[0] -= tileSize;
	} else if (from == "bottom") {
		cords[1] -= tileSize;
	} else if (from == "top") {
		cords[1] += tileSize;
	}

	return [type, cords];
}

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
		this.tiles.push(this.roadGen.createTile({from: "top", to: "right"}, [0, 0]))
		// this.tiles.push(this.roadGen.createTile(...generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize)))
		// this.tiles.push(this.roadGen.createTile(...generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize)))

		// setInterval(() => {
		// 	dispatchEvent(new Event("nextTile"))
		// }, 1000)

		addEventListener("nextTile", () => {
			this.tiles.push(this.roadGen.createTile(...generateTile(this.tiles[this.tiles.length - 1], this.tileSize, this.gridSize)))

			if  (this.tiles.length > 4) {
				this.tiles.shift();
			}
		})
	}



	cycle = () => {

	}
}