import { Genome } from "./Genome.js";
import { Species } from "./Species.js";

import type { Connection } from "./Connection.js";
import type { Node } from "./Neuron.js";
import type { DistanceConfig, NEATConfig } from "./types.js";

import { writeFileSync } from "fs";

export class NEAT {
	config: NEATConfig;
	species: Species[] = [];
	nodeInnovation: number;
	connectionInnovation: number;
	connectionDB: Connection[] = [];
	nodeDB: Node[] = [];
	epoch: number = 0;
	best = {
		genome: new Genome({ in: 0, hidden: 0, out: 0, activationFunction: () => 0 }),
		fitness: 0,
		stats: {}
	}

	constructor(config: NEATConfig) {
		this.config = config;

		config.structure.hidden = (config.structure.hidden !== undefined) ? config.structure.hidden : 0;
		this.nodeInnovation = config.structure.in + config.structure.hidden + config.structure.out - 1;
		this.connectionInnovation = 0;

		if (config.mutationRate) {
			config.mutationRate.addNodeMR = (config.mutationRate.addNodeMR !== undefined) ? config.mutationRate.addNodeMR : 0.01;
			config.mutationRate.addConnectionMR = (config.mutationRate.addConnectionMR !== undefined) ? config.mutationRate.addConnectionMR : 0.02;
			config.mutationRate.removeNodeMR = (config.mutationRate.removeNodeMR !== undefined) ? config.mutationRate.removeNodeMR : 0.005;
			config.mutationRate.removeConnectionMR = (config.mutationRate.removeConnectionMR !== undefined) ? config.mutationRate.removeConnectionMR : 0.005;
			config.mutationRate.changeWeightMR = (config.mutationRate.changeWeightMR !== undefined) ? config.mutationRate.changeWeightMR : 0.01;
		} else {
			config.mutationRate = { addNodeMR: 0.01, addConnectionMR: 0.02, removeNodeMR: 0.005, removeConnectionMR: 0.005, changeWeightMR: 0.01 };
		}

		this.species.push(new Species());
		for (let i = 0; i < config.populationSize; i++) {
			this.species[0].addGenome(new Genome({ in: config.structure.in, hidden: config.structure.hidden, out: config.structure.out, activationFunction: config.structure.activationFunction }));
		}
	}

	mutate() {
		this.species.forEach(specie => {
			specie.mutateNode(this.config.mutationRate?.addNodeMR!, this);
			specie.mutateConnection(this.config.mutationRate?.addConnectionMR!, this);
			specie.mutateDeactivateNode(this.config.mutationRate?.removeNodeMR!);
			specie.mutateDeactivateConnection(this.config.mutationRate?.removeConnectionMR!);
			specie.mutateWeight(this.config.mutationRate?.changeWeightMR!);
		});
	}

	speciate() {
		let genomes: Genome[] = [];
		for (let i = 0; i < this.species.length; i++) {
			genomes = genomes.concat(this.species[i].genomes);
		}

		this.species = Species.speciate(genomes, this.config.distanceConstants ?? {} as DistanceConfig);
	}

	assignPopulationLimit() {
		let total = 0;
		this.species.forEach(specie => {
			total += specie.adjustFitness();
		});

		this.species.forEach(specie => {
			let normalized = specie.adjustedFitness / total;
			specie.populationCap = Math.floor(normalized * this.config.populationSize);
			if (isNaN(specie.populationCap) || specie.populationCap < 0) {
				specie.populationCap = 0;
			}
		});

		for (let i = this.species.length - 1; i >= 0; i--) {
			if (this.species[i].populationCap === 0 || this.species[i]._genomes.length < 1) this.species.splice(i, 1);
		}
	}

	repopulate() {
		this.species.forEach(specie => {
			specie.repopulate(this.config.structure);
		});
	}

	async run(): Promise<Genome[] | undefined> {
		let fitness: Genome[] = [];
		while (this.config.maxEpoch > this.epoch) {
			console.log(`[${new Date().toLocaleTimeString().slice(0, 8)}] Epoch: ` + this.epoch);
			fitness = [];
			let amountPassed = 0;
			let genomes: Genome[] = [];
			for (let i = 0; i < this.species.length; i++) {
				genomes = genomes.concat(this.species[i].genomes);
			}

			for (let i = 0; i < genomes.length; i++) {

				const [genomeFitness, didPass, stats] = await this.config.fitnessFunction(genomes[i], this.epoch, Math.random() * 100_000);
				genomes[i].fitness = Math.max(genomeFitness, 0.00001);
				amountPassed += didPass;
				fitness.push(genomes[i]);

				if (genomes[i].fitness > this.best.fitness) {
					this.best.genome = genomes[i];
					this.best.fitness = genomes[i].fitness;

					const genomeExport = this.best.genome.export();
					genomeExport.stats = stats;

					global.bestGenomeData = JSON.stringify(genomeExport);
				}

				if (isNaN(genomes[i].fitness) || genomes[i].fitness === undefined) genomes[i].fitness = 0.00001;
			}

			if (this.config.fitnessThreshold && fitness.filter(genome => genome.fitness > this.config.fitnessThreshold!).length > 0) return fitness.filter(genome => genome.fitness > this.config.fitnessThreshold!);

			this.speciate();
			this.assignPopulationLimit();
			this.repopulate();
			this.mutate();
			this.epoch++;

			const averageFitness = fitness.reduce((a, b) => a + b.fitness, 0) / fitness.length;
			console.log(`Average fitness: ${averageFitness}`);
		}

		return
	}
}