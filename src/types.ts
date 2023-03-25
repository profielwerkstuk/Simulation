export type Coordinate = [number, number];

export type Direction = "top" | "left" | "bottom" | "right";

export type tileType = {
	from: Direction,
	to: Direction,
}

export interface Line {
	startingPoint: Coordinate,
	endingPoint: Coordinate,
	slope: number,
	constant: number
}

export interface Tile {
	lines: Line[],
	topLeft: Coordinate,
	type: tileType
}