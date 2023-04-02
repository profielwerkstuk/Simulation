import { Genome } from "./Genome.js";
import type { NEAT } from "./NEAT.js";
import type { DistanceConfig, StructureConfig } from "./types.js";

class Species {
	_genomes: Genome[] = [];
	populationCap: number = 0;
	adjustedFitness: number = 0;

	get genomes() {
		return this._genomes;
	}

	get specimen() {
		return this._genomes[0];
	}

	addGenome(genome: Genome) {
		this._genomes.push(genome);
	}

	randomGenome(): Genome {
		return this._genomes[Math.floor(Math.random() * this._genomes.length)];
	}

	adjustFitness(): number {
		this.adjustedFitness = 0;
		this._genomes.forEach(genome => {
			this.adjustedFitness += genome.fitness / this._genomes.length;
		});
		return this.adjustedFitness;
	}

	repopulate(config: StructureConfig) {
		this._genomes = this._genomes.sort((a, b) => b.fitness - a.fitness)
		let half_length = Math.ceil(this._genomes.length / 2);
		this._genomes = this._genomes.splice(0, half_length);

		let newGenomes = [];
		while (newGenomes.length < this.populationCap) {
			newGenomes.push(Genome.crossover(this.randomGenome(), this.randomGenome(), config));
		}
		this._genomes = newGenomes;
	}

	mutateConnection(rate: number, neat: NEAT) {
		for (let i = 0; i < this._genomes.length; i++) {
			if (Math.random() < rate) {
				this._genomes[i].mutateConnection(neat);
			}
		}
	}

	mutateDeactivateConnection(rate: number) {
		for (let i = 0; i < this._genomes.length; i++) {
			if (Math.random() < rate) {
				this._genomes[i].mutateDeactivateConnection();
			}
		}
	}

	mutateNode(rate: number, neat: NEAT) {
		for (let i = 0; i < this._genomes.length; i++) {
			if (Math.random() < rate) {
				this._genomes[i].mutateNode(neat);
			}
		}
	}

	mutateDeactivateNode(rate: number) {
		for (let i = 0; i < this._genomes.length; i++) {
			if (Math.random() < rate) {
				this._genomes[i].mutateDeactivateNode();
			}
		}
	}

	mutateWeight(rate: number) {
		for (let i = 0; i < this._genomes.length; i++) {
			this._genomes[i].mutateWeights(rate);
		}
	}

	static speciate(genomes: Genome[], config: DistanceConfig): Species[] {
		let species: Species[] = [];
		let firstSpecies = new Species();
		firstSpecies.addGenome(genomes[0]);
		species.push(firstSpecies);
		for (let i = 1; i < genomes.length; i++) {
			let foundMatch = false;
			for (let o = 0; o < species.length; o++) {
				if (Genome.isCompatible(genomes[i], species[o].specimen, config)) {
					species[o].addGenome(genomes[i]);
					foundMatch = true;
					break;
				}
			}
			if (!foundMatch) {
				let newSpecies = new Species();
				newSpecies.addGenome(genomes[i]);
				species.push(newSpecies);
			}
		}
		return species;
	}
}

export { Species };