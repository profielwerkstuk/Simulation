import type { Coordinate, Line, Tile } from "./types";

export function getLineFormula(A: Coordinate, B: Coordinate): Line {
	let slope;
	if (A[0] - B[0] === 0) {
		slope = 0; // This is some sketchy hack, dont even worry about it :)
	} else {
		slope = (A[1] - B[1]) / (A[0] - B[0]);
	}
	const constant = A[1] - (slope * A[0]);

	return {
		slope: slope,
		constant: constant,
		startingPoint: A,
		endingPoint: B
	}
}

// Check if the intersection point is within the range of both lines
function isWithinRange(line: Line, x: number, y: number): boolean {
	const [xMin, xMax] = [Math.min(line.startingPoint[0], line.endingPoint[0]), Math.max(line.startingPoint[0], line.endingPoint[0])];
	const [yMin, yMax] = [Math.min(line.startingPoint[1], line.endingPoint[1]), Math.max(line.startingPoint[1], line.endingPoint[1])];
	return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

export function getIntersect(lineA: Line, lineB: Line): Coordinate | null {
	// If a line is vertical
	if (lineA.startingPoint[0] === lineA.endingPoint[0] || lineB.startingPoint[0] === lineB.endingPoint[0]) {
		const line1 = (lineA.startingPoint[0] === lineA.endingPoint[0] ? lineA : lineB)
		const line2 = (line1 === lineA ? lineB : lineA)

		// calculate the x and y of the intersection point
		const x = line1.startingPoint[0];
		const y = line2.slope * x + line2.constant;

		// calculate the range of the line
		if (!isWithinRange(lineA, x, y) || !isWithinRange(lineB, x, y)) return null;

		return [x, y];
	}

	// calculate the x and y of the intersection point
	const x = (lineB.constant - lineA.constant) / (lineA.slope - lineB.slope);
	const y = lineA.slope * x + lineA.constant;

	// calculate the range of the line
	if (!isWithinRange(lineA, x, y) || !isWithinRange(lineB, x, y)) return null;

	return [x, y];
}

// This isn't best practice, but who are you to judge
let walls: Line[] = [];
export function setWalls(borders: Line[]) {
	walls = borders;
}

export function validatePosition(coordinates: Coordinate, w: number, h: number, angle: number, tiles: Tile[], tileCoords: Coordinate, tileSize: number) {
	// Check if the tile of the car has road (there is no escape)
	let validTile = false;
	tiles.forEach(tile => {
		// const [carX, carY] = [coordinates[0] / tileSize, coordinates[1] / tileSize].map(Math.floor);
		const [tileX, tileY] = [tile.topLeft[0] / tileSize, tile.topLeft[1] / tileSize].map(Math.floor);
		// console.log(carX, carY, tileX, tileY)
		if (tileX === tileCoords[0] && tileY === tileCoords[1]) validTile = true;
	});
	if (!validTile) {
		console.log(`Trapped in code and screens,
Car broke free, sought a real world.
Now, its end draws near.`)
		return false
	}

	// Extract the rectangle vertices
	const [cx, cy] = coordinates;
	const cos_alpha = Math.cos(angle);
	const sin_alpha = Math.sin(angle);

	// Coordinates as seen from the back of the car
	const vertices = [
		[cx + w / 2 * cos_alpha - h / 2 * sin_alpha, cy + w / 2 * sin_alpha + h / 2 * cos_alpha], // back right
		[cx + w / 2 * cos_alpha + h / 2 * sin_alpha, cy + w / 2 * sin_alpha - h / 2 * cos_alpha], // front right
		[cx - w / 2 * cos_alpha + h / 2 * sin_alpha, cy - w / 2 * sin_alpha - h / 2 * cos_alpha], // front left
		[cx - w / 2 * cos_alpha - h / 2 * sin_alpha, cy - w / 2 * sin_alpha + h / 2 * cos_alpha] // back left
	] as Coordinate[];

	const edges = [
		getLineFormula(vertices[0], vertices[1]), // right line
		getLineFormula(vertices[1], vertices[2]), // front line
		getLineFormula(vertices[2], vertices[3]), // right line
		getLineFormula(vertices[3], vertices[0]) // back line
	];

	// Add the walls of the map so the AI doesn't drive backwards (it will)
	const tempWallTiles = {
		lines: walls
	} as Tile;
	tiles.push(tempWallTiles);

	for (const tile of tiles) {
		for (const line of tile.lines) {
			for (const edge of edges) {
				if (getIntersect(line, edge)) {
					tiles.pop(); // remove the wall tiles	
					return false
				}
			}
		}
	}

	tiles.pop(); // remove the wall tiles

	return true;
}