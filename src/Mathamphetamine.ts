import { Coordinate, Line } from "./types";

export function getLineFormula(A: Coordinate, B: Coordinate): Line {
	let slope;
	if (A[0] - B[0] === 0) {
		slope = 10_000_000_000; // This is some sketchy hack, dont even worry about it :)
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

export function getIntersect(lineA: Line, lineB: Line): Coordinate | null {
	// x = (b - d) / (c - a)

	// Parallel lines
	if (lineB.slope === lineA.slope) return null;

	const xCoord = (lineA.constant - lineB.constant) / (lineB.slope - lineA.slope);
	const yCoord = lineA.slope * xCoord + lineA.constant;
	return [xCoord, yCoord];
}