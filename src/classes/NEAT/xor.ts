import { ActivationFunctions, NEAT, FitnessFunction } from './index.js';
import { writeFileSync, readFileSync } from "fs";

import { Genome } from './Genome.js';
import { classToPlain, instanceToPlain } from 'class-transformer';

const tests: [[number, number], number][] = [
	[[0, 0], 0],
	[[0, 1], 1],
	[[1, 0], 1],
	[[1, 1], 0],
];

let best: { score: number, genome: null | Genome } = {
	score: 0,
	genome: null,
};

const fitnessFunction: FitnessFunction = async (genome) => {
	let fitness = 4;
	tests.forEach(test => {
		fitness -= Math.abs(genome.activate(test[0])[0] - test[1]);
	});

	if (genome.connections.length < 2) fitness *= 0.001;

	const score = Math.max(fitness, 0.001)

	if (score > best.score) {
		best.score = score;
		best.genome = genome;
	}

	return score;
};

let config = {
	populationSize: 9999,
	structure: {
		in: 2,
		hidden: 0,
		out: 1,
		activationFunction: ActivationFunctions.RELU
	},
	mutationRate: {
		addNodeMR: 0.005,
		addConnectionMR: 0.01,
		removeNodeMR: 0.0001,
		removeConnectionMR: 0.01,
		changeWeightMR: 0.1
	},
	distanceConstants: {
		c1: 2,
		c2: 0.5,
		c3: 1,
		compatibilityThreshold: 1.5
	},
	fitnessThreshold: 3.5,
	fitnessFunction: fitnessFunction,
	maxEpoch: Math.round(Math.exp(50)),
};

const xorString = '{"nodes":[{"_type":"INPUT","value":1,"innovation":0,"id":"7f1dd6b9-3b64c1b7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},{"_type":"INPUT","value":1,"innovation":1,"id":"b4798b96-9bc5cc41","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},{"_type":"HIDDEN","value":0.7286635258358151,"innovation":3,"id":"342d05cd-7ed9d0d1","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":3,"inputTimes":0},{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},{"_type":"HIDDEN","value":0.49392289012901813,"innovation":5,"id":"64ac209d-19ccb649","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":0},{"_type":"HIDDEN","value":0.10912278832999078,"innovation":6,"id":"17a136b6-a8f411c7","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7bcceb96-bb718d36","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.012296251174650923,"innovation":3,"id":"8e1971b2-a5b6ab54","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":2,"inputTimes":1},"innovation":3,"weight":-0.848203077929452,"active":false},"active":true,"inputCount":1,"inputTimes":0},{"_type":"HIDDEN","value":0.04089967385076235,"innovation":7,"id":"2f75f43f-4bd02019","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":4,"id":"1920b394-4db0503a","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.05176787654776671,"innovation":2,"id":"d8ab7b44-6a5d9194","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":6,"weight":0.6180880966789615,"active":false},"active":true,"inputCount":1,"inputTimes":0},{"_type":"HIDDEN","value":0.9428844821881213,"innovation":8,"id":"22aa61b2-d48b9722","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"f14383d2-bd5ab824","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.15737552619976822,"innovation":4,"id":"9f7026e5-776e6f59","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":5,"weight":-0.7645812317719618,"active":false},"active":true,"inputCount":1,"inputTimes":0},{"_type":"HIDDEN","value":0,"innovation":19,"id":"6871e769-5e619d17","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"128f9d3e-e2942ed7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.3091354637401472,"innovation":5,"id":"adb14ffa-7788c287","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":17,"weight":0.8725741977373991,"active":false},"active":true,"inputCount":1,"inputTimes":0}],"connections":[{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7f1dd6b9-3b64c1b7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},"innovation":1,"weight":0.3096519679104759,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"b4798b96-9bc5cc41","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},"innovation":2,"weight":-0.9017113650473387,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7f1dd6b9-3b64c1b7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.7286635258358151,"innovation":3,"id":"342d05cd-7ed9d0d1","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":3,"inputTimes":0},"innovation":3,"weight":0.8903549996857172,"active":true},{"input":{"_type":"HIDDEN","value":0.7286635258358151,"innovation":3,"id":"342d05cd-7ed9d0d1","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},"innovation":4,"weight":0.8040178389733699,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"b4798b96-9bc5cc41","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},"innovation":5,"weight":0.9042092468504315,"active":true},{"input":{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},"innovation":6,"weight":0.6180880966789615,"active":true},{"input":{"_type":"HIDDEN","value":0.7286635258358151,"innovation":3,"id":"342d05cd-7ed9d0d1","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.49392289012901813,"innovation":5,"id":"64ac209d-19ccb649","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":0},"innovation":7,"weight":-0.6107770735985087,"active":true},{"input":{"_type":"HIDDEN","value":0.49392289012901813,"innovation":5,"id":"64ac209d-19ccb649","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},"innovation":8,"weight":0.40348737485788133,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7f1dd6b9-3b64c1b7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.10912278832999078,"innovation":6,"id":"17a136b6-a8f411c7","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7bcceb96-bb718d36","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.012296251174650923,"innovation":3,"id":"8e1971b2-a5b6ab54","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":2,"inputTimes":1},"innovation":3,"weight":-0.848203077929452,"active":false},"active":true,"inputCount":1,"inputTimes":0},"innovation":9,"weight":0.10912278832999078,"active":true},{"input":{"_type":"HIDDEN","value":0.10912278832999078,"innovation":6,"id":"17a136b6-a8f411c7","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7bcceb96-bb718d36","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.012296251174650923,"innovation":3,"id":"8e1971b2-a5b6ab54","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":2,"inputTimes":1},"innovation":3,"weight":-0.848203077929452,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.7286635258358151,"innovation":3,"id":"342d05cd-7ed9d0d1","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":3,"inputTimes":0},"innovation":10,"weight":-0.11268270691055537,"active":true},{"input":{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.04089967385076235,"innovation":7,"id":"2f75f43f-4bd02019","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":4,"id":"1920b394-4db0503a","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.05176787654776671,"innovation":2,"id":"d8ab7b44-6a5d9194","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":6,"weight":0.6180880966789615,"active":false},"active":true,"inputCount":1,"inputTimes":0},"innovation":12,"weight":0.9458419003046865,"active":true},{"input":{"_type":"HIDDEN","value":0.04089967385076235,"innovation":7,"id":"2f75f43f-4bd02019","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":4,"id":"1920b394-4db0503a","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.05176787654776671,"innovation":2,"id":"d8ab7b44-6a5d9194","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":6,"weight":0.6180880966789615,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.2568310228295227,"innovation":2,"id":"7189f0ec-d193b9ac","replacedConnection":{},"active":true,"inputCount":6,"inputTimes":0},"innovation":13,"weight":0.9049755856626853,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"b4798b96-9bc5cc41","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.9428844821881213,"innovation":8,"id":"22aa61b2-d48b9722","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"f14383d2-bd5ab824","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.15737552619976822,"innovation":4,"id":"9f7026e5-776e6f59","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":5,"weight":-0.7645812317719618,"active":false},"active":true,"inputCount":1,"inputTimes":0},"innovation":14,"weight":0.9428844821881213,"active":true},{"input":{"_type":"HIDDEN","value":0.9428844821881213,"innovation":8,"id":"22aa61b2-d48b9722","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"f14383d2-bd5ab824","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.15737552619976822,"innovation":4,"id":"9f7026e5-776e6f59","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":5,"weight":-0.7645812317719618,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},"innovation":15,"weight":-0.43245282834743826,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"7f1dd6b9-3b64c1b7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},"innovation":16,"weight":-0.8042879776186971,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"b4798b96-9bc5cc41","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.49392289012901813,"innovation":5,"id":"64ac209d-19ccb649","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":0},"innovation":17,"weight":0.9389738660769886,"active":true},{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"b4798b96-9bc5cc41","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":0,"innovation":19,"id":"6871e769-5e619d17","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"128f9d3e-e2942ed7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.3091354637401472,"innovation":5,"id":"adb14ffa-7788c287","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":17,"weight":0.8725741977373991,"active":false},"active":true,"inputCount":1,"inputTimes":0},"innovation":47,"weight":-0.36473103770556836,"active":true},{"input":{"_type":"HIDDEN","value":0,"innovation":19,"id":"6871e769-5e619d17","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"128f9d3e-e2942ed7","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.3091354637401472,"innovation":5,"id":"adb14ffa-7788c287","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":17,"weight":0.8725741977373991,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.49392289012901813,"innovation":5,"id":"64ac209d-19ccb649","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":0},"innovation":48,"weight":-0.9236085929522844,"active":true},{"input":{"_type":"HIDDEN","value":0.9428844821881213,"innovation":8,"id":"22aa61b2-d48b9722","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"f14383d2-bd5ab824","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"HIDDEN","value":-0.15737552619976822,"innovation":4,"id":"9f7026e5-776e6f59","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"02320414-ff64eecc","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"473b302f-b9f8bd6d","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":0.05176787654776671,"active":false},"active":true,"inputCount":3,"inputTimes":2},"innovation":5,"weight":-0.7645812317719618,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.7286635258358151,"innovation":3,"id":"342d05cd-7ed9d0d1","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"8a4ac854-791fd423","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"1bfdb485-e7749031","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":-0.00789921542519556,"active":false},"active":true,"inputCount":3,"inputTimes":0},"innovation":49,"weight":-0.15844488428588255,"active":true},{"input":{"_type":"HIDDEN","value":0.49392289012901813,"innovation":5,"id":"64ac209d-19ccb649","replacedConnection":{"input":{"_type":"HIDDEN","value":0,"innovation":3,"id":"786627ba-c04a85b0","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":0,"id":"9673efb9-562c58eb","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0,"innovation":2,"id":"b0d2ac09-b096afa3","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":1,"weight":0.5793280603464592,"active":false},"active":true,"inputCount":1,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5793280603464592,"innovation":2,"id":"17746bb4-3e0f5aeb","replacedConnection":{},"active":true,"inputCount":3,"inputTimes":2},"innovation":4,"weight":-0.13034614026137348,"active":false},"active":true,"inputCount":3,"inputTimes":0},"output":{"_type":"HIDDEN","value":0.04324155425720433,"innovation":4,"id":"66431813-df494070","replacedConnection":{"input":{"_type":"INPUT","value":1,"innovation":1,"id":"50180571-1c6143ca","replacedConnection":{},"active":true,"inputCount":0,"inputTimes":0},"output":{"_type":"OUTPUT","value":0.5588809723853004,"innovation":2,"id":"e52b6f6d-4088084a","replacedConnection":{},"active":true,"inputCount":2,"inputTimes":1},"innovation":2,"weight":-0.2605456998609088,"active":false},"active":true,"inputCount":4,"inputTimes":0},"innovation":60,"weight":0.7107857383587315,"active":true}],"fitness":3.534791316842614,"activationFunction":"RELU"}'

const xor = instanceToPlain(Genome, JSON.parse(xorString))





// const network = new NEAT(config);
// console.log("> Network starting");
// await network.run();

// console.log(JSON.stringify(best.genome))

// console.log(`> Best score: ${best.score}`);
// console.log("> Testing best genome");

tests.forEach(test => {
	const result = Math.round(xor.activate(test[0])[0]);
	console.log(`${result === test[1] ? "✅" : "❌"} ${test[0].join(" ")} | ${result}`)
})






// const previous = readFileSync(`./genomes/genome-${config.fitnessThreshold}.json`, "utf-8");
// const current = JSON.stringify(best.genome);
// const previousNodesAmount = JSON.parse(previous)._nodes.length;
// const currentNodesAmount = best.genome!.nodes.length;

// if (current.length < previous.length || currentNodesAmount < previousNodesAmount) {
// 	console.log(`> Improved on the genome:`);
// 	console.log(`> ${previousNodesAmount} => ${currentNodesAmount} (Δ${previousNodesAmount - currentNodesAmount})`);
// 	console.log(`> ${previous.length} => ${current.length} (Δ${previous.length - current.length})`);
// 	writeFileSync(`./genomes/genome-${config.fitnessThreshold}.json`, JSON.stringify(best.genome));
// }
// }