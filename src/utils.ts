import type { Coordinate, Direction, Tile, tileType } from "./types";

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

const directions: Direction[] = ["top", "left", "bottom", "right"];
export function generateTile(lastTile: Tile | null = null, tileSize: number, gridSize: [width: number, height: number]): [tileType, Coordinate] {
	// Start with a straight tile by default
	if (lastTile === null) {
		return [{ from: "top", to: "bottom" }, [0, 0]];
	}

	// Invert where the tile came from (if lastTile top->bottom, then it came from top)
	const cameFrom = directions[(directions.indexOf(lastTile.type.to) + 2) % 4];
	const disallowedDirections: Direction[] = [cameFrom];

	// Just some validating
	if (lastTile.topLeft[0] <= tileSize) disallowedDirections.push("left");
	if (lastTile.topLeft[1] <= tileSize) disallowedDirections.push("top");
	if (lastTile.topLeft[0] >= tileSize * (gridSize[0] - 2)) disallowedDirections.push("right");
	if (lastTile.topLeft[1] >= tileSize * (gridSize[1] - 2)) disallowedDirections.push("bottom");

	// Randominteger uses some scuffed way of truncating the number
	const possibleDirections = directions.filter((direction) => !disallowedDirections.includes(direction));
	const randomInteger = Math.random() * possibleDirections.length | 0;
	const goesTo = possibleDirections[randomInteger];

	const type: tileType = { from: cameFrom, to: goesTo };
	let coords: Coordinate = [lastTile.topLeft[0], lastTile.topLeft[1]];

	// Update coordinates to match the tile 
	if (cameFrom == "left") coords[0] += tileSize;
	else if (cameFrom == "right") coords[0] -= tileSize;
	else if (cameFrom == "bottom") coords[1] -= tileSize;
	else if (cameFrom == "top") coords[1] += tileSize;

	return [type, coords];
}