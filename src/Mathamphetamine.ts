import { Coordinate, Line } from "./types";

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