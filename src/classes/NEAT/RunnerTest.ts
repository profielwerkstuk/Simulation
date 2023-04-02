// import { Runner, FrozenGenome } from "./index.js";
// import { readFileSync, writeFileSync } from "fs";

// const genomeFile = readFileSync(`./genomes/genome-3.5.json`, "utf-8");
// const frozenGenome = JSON.parse(genomeFile) as FrozenGenome;

// const defrosted = new Runner(frozenGenome);

// const tests: [[number, number], number][] = [
// 	[[0, 0], 0],
// 	[[0, 1], 1],
// 	[[1, 0], 1],
// 	[[1, 1], 0],
// ];

// tests.forEach(test => {
// 	const result = defrosted.activate(test[0])[0];
// 	console.log(`${result === test[1] ? "✅" : "❌"} ${test[0].join(" ")} | ${result}`)
// })

// tests.forEach(test => {
// 	const result = defrosted.activate(test[0])[0];
// 	console.log(`${result === test[1] ? "✅" : "❌"} ${test[0].join(" ")} | ${result}`)
// })

// console.log(genomeFile === JSON.stringify(defrosted));
// writeFileSync(`./genomes/defrosted.json`, JSON.stringify(defrosted));