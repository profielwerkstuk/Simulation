import { Genome, StructureConfig } from "./Genome.js";
import { DistanceConfig, NEAT } from "./NEAT.js";

class Species {
	genomes: Genome[] = [];
	populationCap: number = 0;
	adjustedFitness: number = 0;

	addGenome(genome: Genome) {
		this.genomes.push(genome);
	}

	getGenomes(): Genome[] {
		return this.genomes;
	}

	getSpecimen(): Genome {
		return this.genomes[0];
	}

	randomGenome(): Genome {
		return this.genomes[Math.floor(Math.random() * this.genomes.length)];
	}

	adjustFitness(): number {
		this.adjustedFitness = 0;
		this.genomes.forEach(genome => {
			this.adjustedFitness += genome.fitness / this.genomes.length;
		});
		return this.adjustedFitness;
	}

	repopulate(config: StructureConfig) {
		this.genomes = this.genomes.sort((a, b) => b.fitness - a.fitness)
		let half_length = Math.ceil(this.genomes.length / 2);
		this.genomes = this.genomes.splice(0, half_length);

		let newGenomes = [];
		while (newGenomes.length < this.populationCap) {
			newGenomes.push(Genome.crossover(this.randomGenome(), this.randomGenome(), config));
		}
		this.genomes = newGenomes;
	}

	mutateConnection(rate: number, neat: NEAT) {
		for (let i = 0; i < this.genomes.length; i++) {
			if (Math.random() < rate) {
				this.genomes[i].mutateConnection(neat);
			}
		}
	}

	mutateDeactivateConnection(rate: number) {
		for (let i = 0; i < this.genomes.length; i++) {
			if (Math.random() < rate) {
				this.genomes[i].mutateDeactivateConnection();
			}
		}
	}

	mutateNode(rate: number, neat: NEAT) {
		for (let i = 0; i < this.genomes.length; i++) {
			if (Math.random() < rate) {
				this.genomes[i].mutateNode(neat);
			}
		}
	}

	mutateDeactivateNode(rate: number) {
		for (let i = 0; i < this.genomes.length; i++) {
			if (Math.random() < rate) {
				this.genomes[i].mutateDeactivateNode();
			}
		}
	}

	mutateWeight(rate: number) {
		for (let i = 0; i < this.genomes.length; i++) {
			this.genomes[i].mutateWeights(rate);
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
				if (Genome.isCompatible(genomes[i], species[o].getSpecimen(), config)) {
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