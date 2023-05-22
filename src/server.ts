import { Worker } from 'worker_threads';
import express from "express";
const app = express();

const PORT = 3000;
const TIMEOUT = 1.5 * 60 * 1000;

async function runWorker(workerData: any) {
	return new Promise((resolve, reject) => {
		const worker = new Worker("./dist/index.js", {
			workerData: workerData
		});

		const timeout = setTimeout(() => {
			console.log("process timed out :/");
			worker.terminate();
			resolve(`Something went wrong :/`)
		}, TIMEOUT)

		worker.on("online", () => console.log("New worker started!"));
		worker.on("message", (v) => {
			if (v?.[0]) resolve(v[1]);
		});
		worker.on("exit", () => console.log("Worker stopped!"))
	})
}

app.get("/", async (req, res) => {
	const params = [];
	for (const entry in req.query) params.push(`${entry}=${req.query[entry]}`);

	const response = await runWorker(params);
	res.send(response);
})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})