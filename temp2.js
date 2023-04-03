import { spawn } from 'child_process';
import { readFileSync, readdirSync, unlinkSync } from "fs";

const files = readdirSync("./data");

const TIMEOUT = 5 * 60 * 1000; // 15 minutes in milliseconds
const MAX_PROCESSES = 25 - files.length;

let startedProcesses = 0;
let completedProcesses = 0;

function startChildProcess() {
	if (startedProcesses < MAX_PROCESSES) {
		const index = startedProcesses + 1;
		const child = spawn('node', ['.']);

		startedProcesses++;

		const timeout = setTimeout(() => {
			console.log(`Process ${index} timed out.`);
			child.kill();
			completedProcesses++;
		}, TIMEOUT);

		child.on('exit', (code) => {
			clearTimeout(timeout);
			console.log(`Process ${index} exited with code ${code}.`);
			completedProcesses++;

			if (completedProcesses === MAX_PROCESSES) {
				console.log('All processes completed.');
				process.exit(0);
			} else if (startedProcesses < MAX_PROCESSES) {
				startChildProcess();
			}
		});
	}
}

for (let i = 0; i < 5; i++) {
	startChildProcess();
}
