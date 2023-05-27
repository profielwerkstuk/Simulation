import { Worker } from 'worker_threads';
import express from "express";
import { uploadNewGenome } from './firebaseControl.js';

const app = express();

const PORT = 3000;
const TIMEOUT = 1.5 * 60 * 1000;

async function runWorker(workerData: any) {
	if (workerData.length !== 11) {
		return "Invalid number of arguments!";
	}

	console.log(workerData);

	return new Promise((resolve, reject) => {
		const worker = new Worker("./dist/index.js", {
			workerData: workerData
		});

		const timeout = setTimeout(async () => {
			console.log("process timed out :/");
			worker.terminate();
			resolve(await runWorker(workerData));
		}, TIMEOUT)

		worker.on("online", () => console.log("New worker started!"));
		worker.on("message", (v) => {
			if (v?.[0]) {
				clearTimeout(timeout);
				uploadNewGenome(v[1]);
				resolve(v[1]);
			}
		});
		worker.on("exit", () => console.log("Worker stopped!"))
	})
}

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // Change later
	next();
});

app.get("/", async (req, res) => {
	const params = [];
	for (const entry in req.query) params.push(`${entry}=${req.query[entry]}`);

	const response = await runWorker(params);
	res.send(response);
})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})