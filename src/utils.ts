import type { Coordinate, Direction, Tile, tileType } from "./types";

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export class MersenneTwister {
	N: number;
	M: number;
	MATRIX_A: number;
	UPPER_MASK: number;
	LOWER_MASK: number;
	mt: number[];
	mti: number;

	constructor(seed?: number | number[]) {
		if (seed === undefined) {
			console.warn("No seed provided, using current time as seed");
			seed = new Date().getTime();
		}

		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;
		this.UPPER_MASK = 0x80000000;
		this.LOWER_MASK = 0x7fffffff;

		this.mt = new Array(this.N);
		this.mti = this.N + 1;

		if (Array.isArray(seed)) {
			this.init_by_array(seed, seed.length);
		} else {
			this.init_seed(seed);
		}
	}

	private init_seed(s: number): void {
		this.mt[0] = s >>> 0;
		for (this.mti = 1; this.mti < this.N; this.mti++) {
			const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
			this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + ((s & 0x0000ffff) * 1812433253) + this.mti;
			this.mt[this.mti] >>>= 0;
		}
	}

	private init_by_array(init_key: number[], key_length: number): void {
		let i, j, k;
		this.init_seed(19650218);
		i = 1;
		j = 0;
		k = this.N > key_length ? this.N : key_length;
		for (; k; k--) {
			const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
			this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1664525 << 16) + ((s & 0x0000ffff) * 1664525)) + init_key[j] + j; /* non linear */
			this.mt[i] >>>= 0;
			i++;
			j++;
			if (i >= this.N) {
				this.mt[0] = this.mt[this.N - 1];
				i = 1;
			}
			if (j >= key_length) j = 0;
		}
		for (k = this.N - 1; k; k--) {
			const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
			this.mt[i] = (this.mt[i] ^ (((s & 0xffff0000) >>> 16) * 1566083941 << 16) + (s & 0x0000ffff) * 1566083941) - i; /* non linear */
			this.mt[i] >>>= 0;
			i++;
			if (i >= this.N) {
				this.mt[0] = this.mt[this.N - 1];
				i = 1;
			}
		}
		this.mt[0] = 0x80000000;
	}

	random_int(): number {
		let y;
		const mag01 = [0x0, this.MATRIX_A];

		if (this.mti >= this.N) {
			let kk;

			if (this.mti == this.N + 1) this.init_seed(5489);
			for (kk = 0; kk < this.N - this.M; kk++) {
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (; kk < this.N - 1; kk++) {
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
			this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

			this.mti = 0;
		}

		y = this.mt[this.mti++];

		y ^= y >>> 11;
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= y >>> 18;

		return y >>> 0;
	}

	random_int31(): number {
		return this.random_int() >>> 1;
	}

	random_incl(): number {
		return this.random_int() * (1.0 / 4294967295.0);
	}

	random(): number {
		return this.random_int() * (1.0 / 4294967296.0);
	}

	random_excl(): number {
		return (this.random_int() + 0.5) * (1.0 / 4294967296.0);
	}

	random_long(): number {
		const a = this.random_int() >>> 5, b = this.random_int() >>> 6;
		return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
	}
}


const directions: Direction[] = ["top", "left", "bottom", "right"];
export function generateTile(lastTile: Tile | null = null, tileSize: number, gridSize: [width: number, height: number], mersenneTwister: MersenneTwister): [tileType, Coordinate] {
	// Start with a straight tile by default
	if (lastTile === null) {
		return [{ from: "top", to: "bottom" }, [0, 0]];
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
	const randomInteger = mersenneTwister.random() * possibleDirections.length | 0;
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

export function generateSpecifiedTile(lastTile: Tile, tileTo: Direction, tileSize: number, gridSize: [width: number, height: number]): [tileType, Coordinate] {
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

	const type: tileType = { from: cameFrom, to: tileTo };
	let coords: Coordinate = [lastTile.topLeft[0], lastTile.topLeft[1]];

	// Update coordinates to match the tile
	if (cameFrom == "left") coords[0] += tileSize;
	else if (cameFrom == "right") coords[0] -= tileSize;
	else if (cameFrom == "bottom") coords[1] -= tileSize;
	else if (cameFrom == "top") coords[1] += tileSize;

	return [type, coords];
}