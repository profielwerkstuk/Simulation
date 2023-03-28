import { getIntersect, getLineFormula, validatePosition } from "../Mathamphetamine.js";
import { clamp } from "../utils.js";

import type { Coordinate, Line, Tile } from "../types";


// Manual control code
const keyMap = {
	up: "w",
	down: "s",
	left: "a",
	right: "d"
}

const isKeyDown: { [key: string]: boolean } = {};
Object.values(keyMap).forEach(key => isKeyDown[key] = false);

window.addEventListener("keydown", e => {
	if (Object.values(keyMap).includes(e.key)) isKeyDown[e.key] = true;
});

window.addEventListener("keyup", e => {
	if (Object.values(keyMap).includes(e.key)) isKeyDown[e.key] = false;
});


export class Car {
	private gridCoords = [0, 0];
	private manualDrive = false;

	public angle = Math.PI; // Angle in rad
	private power = 0;
	private reverse = 0;

	private state = {
		isThrottling: false,
		isReversing: false,
		isTurningLeft: false,
		isTurningRight: false
	}
	public velocity = {
		x: 0,
		y: 0,
		angular: 0
	}

	stats = {
		tilesChecked: 0,
		survivalTime: 0,
		distanceTravelled: 0,
	}

	tiles: Tile[] = []

	// Default settings
	private settings = {
		maxPower: 0.030,
		maxReverse: 0.015,
		powerFactor: 0.001,
		reverseFactor: 0.0005,
		drag: 0.9,
		angularDrag: 0.95,
		turnSpeed: 0.0008,
		turnRequirement: 0.0025,
		reverseTurnRequirement: 0.025,
		viewDistance: 100
	}

	constructor(
		public coordinates: Coordinate, // Coordinates of the centre of the car
		public width: number,
		public height: number,
		public tileSize: number,
		carViewingDistance: number
	) {
		this.gridCoords = [Math.floor(this.coordinates[0] / this.tileSize), Math.floor(this.coordinates[1] / this.tileSize)];
		this.settings.viewDistance = carViewingDistance;
		this.settings.maxPower = 1 / 200 * this.width;
		this.settings.maxReverse = 1 / 3 * this.settings.maxPower;
	}

	toggleManual = () => this.manualDrive = !this.manualDrive;

	reset = () => {
		this.coordinates = [Math.floor(1 / 2 * this.tileSize), Math.floor(1 / 2 * this.tileSize)];
		this.angle = Math.PI;
		this.power = 0;
		this.reverse = 0;
		this.velocity = {
			x: 0,
			y: 0,
			angular: 0
		}

		this.stats = {
			tilesChecked: 0,
			survivalTime: 0,
			distanceTravelled: 0,
		}
	}

	update = (tiles: Tile[]) => {
		this.tiles = tiles
		// Keep the angle small
		this.angle = this.angle % (Math.PI * 2);

		// Convenience?
		let xCoord = this.coordinates[0];
		let yCoord = this.coordinates[1];

		if ((this.gridCoords[0] !== Math.floor(xCoord / this.tileSize) || this.gridCoords[1] !== Math.floor(yCoord / this.tileSize))) {
			const event = new CustomEvent("generateTile");
			dispatchEvent(event);
		}

		// Update the grid coordinates (is floor used correctly?)
		this.gridCoords = [Math.floor(xCoord / this.tileSize), Math.floor(yCoord / this.tileSize)];

		// Manual drive for testing
		if (this.manualDrive) this.steer(isKeyDown[keyMap.up], isKeyDown[keyMap.down], isKeyDown[keyMap.left], isKeyDown[keyMap.right]);

		// If driving forward, increase the power, else slow down (decrease power)
		if (this.state.isThrottling) this.power += this.settings.powerFactor;
		else this.power -= this.settings.powerFactor;

		// The same as above, but for reversing
		if (this.state.isReversing) this.reverse += this.settings.reverseFactor;
		else this.reverse -= this.settings.reverseFactor;

		// Keep power between 0 and maxPower
		this.power = clamp(this.power, 0, this.settings.maxPower);
		this.reverse = clamp(this.reverse, 0, this.settings.maxReverse);

		// Get the forward/backwards direction (if equal, forward)
		const direction = this.power >= this.reverse ? 1 : -1;

		// If going left/right, change the angular velocity
		if (this.state.isTurningLeft) this.velocity.angular -= direction * this.settings.turnSpeed;
		if (this.state.isTurningRight) this.velocity.angular += direction * this.settings.turnSpeed;

		this.velocity.x += Math.sin(this.angle) * (this.power - this.reverse);
		this.velocity.y += Math.cos(this.angle) * (this.power - this.reverse);

		// Update all values accordingly
		this.coordinates[0] += this.velocity.x;
		this.coordinates[1] -= this.velocity.y;
		this.velocity.x *= this.settings.drag;
		this.velocity.y *= this.settings.drag;
		this.angle += this.velocity.angular;
		this.velocity.angular *= this.settings.angularDrag;

		// Make sure the car is in a valid position
		const valid = validatePosition(this.coordinates, this.width, this.height, this.angle, tiles);
		if (!valid) {
			const event = new CustomEvent("terminateRun");
			dispatchEvent(event);
		}
	}

	steer = (forwards: boolean, backwards: boolean, left: boolean, right: boolean) => {
		// console.log(forwards, backwards, left, right);
		// Key up/down here can be interchanged with the AI input values;

		// If there is enough power, you can steer + the same for reverse
		const canTurn = this.power > this.settings.turnRequirement || this.reverse && this.settings.reverseTurnRequirement;

		// Throttling if holding forward key, reversing if holding backward key
		this.state.isThrottling = forwards;
		this.state.isReversing = backwards;

		// Update the steering states based on the control input
		this.state.isTurningLeft = !!canTurn && left;
		this.state.isTurningRight = !!canTurn && right;
	}

	getLines = () => {
		const pointA = [this.coordinates[0] - this.width / 2, this.coordinates[1] - this.height / 4];
		const pointB = [this.coordinates[0] - this.width / 2, this.coordinates[1] - this.height / 2];
		const pointC = [this.coordinates[0], this.coordinates[1] - this.height / 2];
		const pointD = [this.coordinates[0] + this.width / 2, this.coordinates[1] - this.height / 2];
		const pointE = [this.coordinates[0] + this.width / 2, this.coordinates[1] - this.height / 4];

		const points = [pointA, pointB, pointC, pointD, pointE] as Coordinate[];

		// Take into account the angle of the car
		points.forEach((point) => {
			const s = Math.sin(this.angle);
			const c = Math.cos(this.angle);

			point[0] -= this.coordinates[0];
			point[1] -= this.coordinates[1];

			const xnew = point[0] * c - point[1] * s;
			const ynew = point[0] * s + point[1] * c;

			point[0] = xnew + this.coordinates[0];
			point[1] = ynew + this.coordinates[1];
		});

		let lines = points.map((v) => getLineFormula(v, this.coordinates));

		lines = lines.map((v, i) => {
			v.startingPoint = points[i];
			v.endingPoint = [0, 0];

			const dx = v.startingPoint[0] - this.coordinates[0];
			const dy = v.startingPoint[1] - this.coordinates[1];
			const segmentLength = Math.sqrt(dx * dx + dy * dy);
			const scalingFactor = this.settings.viewDistance / segmentLength;

			const delta_x = scalingFactor * dx;
			const delta_y = scalingFactor * dy;

			v.endingPoint[0] = v.startingPoint[0] + delta_x;
			v.endingPoint[1] = v.startingPoint[1] + delta_y;

			return v;
		});

		return lines;
	};

	getIntersections = (tiles: Tile[]) => {
		interface tempLineType extends Line {
			intersections: Coordinate[]
		};

		let lines = this.getLines() as tempLineType[];
		lines.forEach(line => line.intersections ??= []);

		lines.forEach(line => {
			tiles.forEach(tile => {
				tile.lines.forEach(tileLine => {
					const intersect = getIntersect(line, tileLine);
					if (intersect) line.intersections.push(intersect);
				})
			})
		})

		// In rare cases, lines might have two intersections, so we pick the closest one
		lines.forEach(line => {
			if (line.intersections.length > 1) {

				let lowest = Infinity;
				let closest: Coordinate;

				line.intersections.forEach(intersection => {
					const dist = Math.hypot(this.coordinates[0] - intersection[0], this.coordinates[1] - intersection[1])
					if (dist < lowest) {
						lowest = dist;
						closest = intersection;
					}
				});

				// Closest will always be defined, but TypeScript disagrees (valid)
				line.intersections = [closest!]
			}
		})

		const intersections: Coordinate[] = [];
		lines.forEach(line => {
			intersections.push(line.intersections[0] ?? null)
		});

		return intersections;
	}

	getDistances = (tiles: Tile[]) => {
		return this.getIntersections(tiles).map(v => {
			if (v) return Math.hypot(this.coordinates[0] - v[0], this.coordinates[1] - v[1])
			else return -1;
		});
	}
}