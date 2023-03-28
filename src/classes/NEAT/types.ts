import type { Genome } from "./Genome";
import type { Node } from "./Neuron"

export type ActivationFunction = (input: number, alpha?: number) => number;
export type FitnessFunction = (input: Genome) => Promise<number>;

export interface StructureConfig {
	in: number;
	hidden: number;
	out: number;
	activationFunction: ActivationFunction;
}

export interface ConnectionStructure {
	firstNode: Node,
	secondNode: Node,
}

export interface NEATConfig {
	populationSize: number;
	structure: StructureConfig;
	fitnessThreshold: number;
	maxEpoch: number;
	mutationRate?: MutationRateConfig;
	distanceConstants?: DistanceConfig;
	fitnessFunction: FitnessFunction;
}

export interface MutationRateConfig {
	addNodeMR: number;
	addConnectionMR: number;
	removeNodeMR: number;
	removeConnectionMR: number;
	changeWeightMR: number;
}

export interface DistanceConfig {
	c1: number;
	c2: number;
	c3: number;
	compatibilityThreshold: number;
}

export enum NodeType {
	INPUT = "INPUT",
	HIDDEN = "HIDDEN",
	OUTPUT = "OUTPUT"
}