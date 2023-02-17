export type tileType = "straight" | "left" | "right";
export type Coordinate = [number, number];

export interface Line {
	startingPoint: Coordinate,
	endingPoint: Coordinate,
	slope: number,
	constant: number
}

export interface Tile {
	lines: Line[],
	topLeft: Coordinate
}
