export type Coordinate = [number, number];

export type direction = "top" | "left" | "bottom" | "right";

export type tileType = {
	from: direction,
	to: direction,
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
