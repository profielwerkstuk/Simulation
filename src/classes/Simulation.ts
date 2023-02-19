import { Coordinate, Tile, direction, tileType } from "../types.js";
import { Road } from "./Road.js";
import { directions } from "./utils.js";

function generateTile(lastTile: Tile | null = null): [tileType, Coordinate] {
	if (lastTile === null) {
		return [{from: "top", to: "bottom"}, [0, 0]];
	}

	const from = directions[(directions.indexOf(lastTile.type.to) + 2) % 4];
	const disallowedDirections: direction[] = [from]

	if (lastTile.topLeft[0] <= 40) {
		disallowedDirections.push("left");
	} if (lastTile.topLeft[1] <= 40) {
		disallowedDirections.push("top");
	} else if (lastTile.topLeft[0] >= 120) {
		disallowedDirections.push("right");
	} else if (lastTile.topLeft[1] >= 120) {
		disallowedDirections.push("bottom");
	}

	const possibleDirections = directions.filter((direction) => !disallowedDirections.includes(direction));

	console.log(possibleDirections)

	const type: tileType = {from, to: possibleDirections[Math.random() * possibleDirections.length | 0]};
	let cords: Coordinate = [lastTile.topLeft[0], lastTile.topLeft[1]];

	if (from == "left") {
		cords[0] += 40;
	} else if (from == "right") {
		cords[0] -= 40;
	} else if (from == "bottom") {
		cords[1] -= 40;
	} else if (from == "top") {
		cords[1] += 40;
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

		setInterval(() => {
			this.tiles.push(this.roadGen.createTile(...generateTile(this.tiles[this.tiles.length - 1])))

			if  (this.tiles.length > 3) {
				this.tiles.shift();
			}
		}, 100)
	}



	cycle = () => {

	}
}