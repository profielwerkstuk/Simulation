// * Nifty commands to use
// Runs 25 times for you and calculates the averages so you can grab a drink
// 1..25 | % { node . } ; node temp.js

import { writeFileSync, readdirSync, readFileSync } from "fs";

// number[][]
let epochData = [];

const dataFiles = readdirSync("./data").filter(v => v.endsWith("mw"));
if (dataFiles.length !== 25) throw new Error("❌ There aren't exactly 25 runs!");

for (const fileName of dataFiles) {
	const file = readFileSync(`./data/${fileName}`, "utf-8");
	const data = file.split("\r\n").slice(1, -1); // Remove headers and empty bottom line
	if (data.length !== 25) throw new Error("❌ Run doesn't have 25 epochs");

	data.forEach(line => {
		const [epoch, fitness] = line.split("\t").map(Number);
		epochData[epoch] ??= [];
		epochData[epoch].push(fitness);
	})
};

const averages = [];
epochData.forEach(collection => {
	const sum = collection.reduce((a, b) => a + b);
	const average = sum / collection.length;
	averages.push(average);
});

writeFileSync("./result.mw", averages.join("\r\n"));