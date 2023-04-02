import type { Coordinate, Direction, Tile, tileType } from "./types";

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

const directions: Direction[] = ["top", "left", "bottom", "right"];
export function generateTile(lastTile: Tile | null = null, tileSize: number, gridSize: [width: number, height: number], carSpawnPoint: Coordinate): [tileType, Coordinate] {
	// Start with a straight tile by default
	if (lastTile === null) {
		return [{ from: "top", to: "bottom" }, [carSpawnPoint[0] - tileSize / 2, carSpawnPoint[1] - tileSize / 2]];
	}

	// Invert where the tile came from (if lastTile top->bottom, then it came from top)
	const cameFrom = directions[(directions.indexOf(lastTile.type.to) + 2) % 4];
	const disallowedDirections: Direction[] = [cameFrom];

	// validating (but valid)
	// Check if the next tile would bring you out of bounds
	const gridCoords = [lastTile.topLeft[0] / tileSize, lastTile.topLeft[1] / tileSize];
	if (lastTile.type.to === "left") gridCoords[0]--
	if (lastTile.type.to === "right") gridCoords[0]++
	if (lastTile.type.to === "bottom") gridCoords[1]++
	if (lastTile.type.to === "top") gridCoords[1]--

	if (gridCoords[0] - 1 === -1) disallowedDirections.push("left");
	if (gridCoords[0] + 1 === gridSize[0]) disallowedDirections.push("right");
	if (gridCoords[1] - 1 === -1) disallowedDirections.push("top");
	if (gridCoords[1] + 1 === gridSize[1]) disallowedDirections.push("bottom");

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