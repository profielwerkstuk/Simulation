import type { Coordinate } from "../types.js";
import { round } from "./utils.js";

const maxPower = 0.025;
const maxReverse = 0.015;
const powerFactor = 0.001;
const reverseFactor = 0.0005;

const drag = 0.9;
const angularDrag = 0.95;
const turnSpeed = 0.0008;
const turnRequirement = 0.0025;
const reverseTurnRequirement = 0.025;

const wasdKeys: {
	[key: string]: string;
} = {
	up: "w",
	down: "s",
	left: "a",
	right: "d"
};

const keysDown: {
	[key: string]: boolean;
} = {};

window.addEventListener('keydown', e => {
	keysDown[e.key] = true;
});

window.addEventListener('keyup', e => {
	keysDown[e.key] = false;
});


const keyActive = (key: string) => {
	return keysDown[wasdKeys[key]];
};

export class Car {
	public angle = 3; // Angle in rad
	private xVelocity = 0;
	private yVelocity = 0;
	private angularVelocity = 0;
	private isThrottling = false;
	private isReversing = false;
	private isTurningLeft = false;
	private isTurningRight = false;
	private power = 0;
	private reverse = 0;
	private manualDrive = false;
	private gridCords = [0, 0];
	private spawned = false;

	constructor(
		public id: string,
		public coordinates: Coordinate, // Coordinates of the centre of the car
		public width: number,
		public height: number,
		public tileSize: number,
	) { }

	update = () => {

		this.angle = round(this.angle % (Math.PI * 2), 3);

		let x = this.coordinates[0];
		let y = this.coordinates[1];

		if (this.angle < 0) {
			x += (this.width / 2) * -this.angle / Math.PI;
			y += (this.height / 2) * -this.angle / Math.PI;
		} else if (this.angle > 0) {
			x -= (this.width / 2) * this.angle / Math.PI;
			y -= (this.height / 2) * this.angle / Math.PI;
		}

		if (this.coordinates[1] != 0 && !this.spawned) {
			dispatchEvent(new CustomEvent('nextTile', {detail: {speed: this.power - this.reverse, id: this.id}}))
			dispatchEvent(new CustomEvent('nextTile', {detail: {speed: this.power - this.reverse, id: this.id}}))
		}

		if((this.gridCords[0] !== Math.floor(x / this.tileSize) || this.gridCords[1] !== Math.floor(y / this.tileSize))) {
			dispatchEvent(new CustomEvent('nextTile', {detail: {speed: this.power - this.reverse, id: this.id}}))
		}

		this.spawned = true;

		this.gridCords = [Math.floor(x / this.tileSize), Math.floor(y / this.tileSize)]

		if (this.manualDrive) {
			const canTurn = this.power > turnRequirement || this.reverse && reverseTurnRequirement;

			const controls = {
				up: keyActive('up'),
				down: keyActive('down'),
				left: keyActive('left'),
				right: keyActive('right')
			}

			if (this.isThrottling !== controls.up || this.isReversing !== controls.down) {
				this.isThrottling = controls.up;
				this.isReversing = controls.down;
			}

			this.isTurningLeft = !!canTurn && controls.left;
			this.isTurningRight = !!canTurn && controls.right;
		}


		if (this.isThrottling) this.power += powerFactor * (this.isThrottling ? 1 : 0);
		else this.power -= powerFactor;

		if (this.isReversing) this.reverse += reverseFactor;
		else this.reverse -= reverseFactor;

		this.power = Math.max(0, Math.min(maxPower, this.power));
		this.reverse = Math.max(0, Math.min(maxReverse, this.reverse));

		const direction = this.power > this.reverse ? 1 : -1;

		if (this.isTurningLeft) this.angularVelocity -= direction * turnSpeed * (this.isTurningLeft ? 1 : 0);
		if (this.isTurningRight) this.angularVelocity += direction * turnSpeed * (this.isTurningRight ? 1 : 0);

		this.xVelocity += Math.sin(this.angle) * (this.power - this.reverse);
		this.yVelocity += Math.cos(this.angle) * (this.power - this.reverse);

		this.coordinates[0] += this.xVelocity;
		this.coordinates[1] -= this.yVelocity;
		this.xVelocity *= drag;
		this.yVelocity *= drag;
		this.angle += this.angularVelocity;
		this.angularVelocity *= angularDrag;
	}

	steer = (forward: boolean, backwards: boolean, left: boolean, right: boolean) => {
		const canTurn = this.power > turnRequirement || this.reverse;

		if (this.isThrottling !== forward || this.isReversing !== backwards) {
			this.isThrottling = forward;
			this.isReversing = backwards;
		}

		this.isTurningLeft = !!canTurn && left;
		this.isTurningRight = !!canTurn && right;

	}

	toggleManual = () => this.manualDrive = !this.manualDrive;
}