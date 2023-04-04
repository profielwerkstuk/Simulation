import { readFileSync, readdirSync, unlinkSync } from "fs";

const files = readdirSync("./data");

for (const fileName of files) {
	const file = readFileSync(`./data/${fileName}`, "utf-8");
	if (file.split("\n").length !== 32) {
		unlinkSync(`./data/${fileName}`)
	}
}

console.log(files.length);