import { ActivationFunctions, NEAT } from './neat.js';

let best: {score: number, genome: any} = {
    score: 0,
    genome: null,
};

async function fitnessFunction(a: any) {
    let fitness = 4;
    fitness -= Math.abs(a.activate([1, 1])[0]);
    fitness -= Math.abs(a.activate([1, 0])[0] - 1);
    fitness -= Math.abs(a.activate([0, 1])[0] - 1);
    fitness -= Math.abs(a.activate([0, 0])[0]);
    if (a.connections.length < 2) fitness *= 0.001;

    const score = Math.max(fitness, 0.001)

    if (score > best.score) {
        best.score = score;
        best.genome = a;
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

const neat = new NEAT(config);
console.log('Starting...');

neat.run();

console.log('Best score: ' + best.score);
console.log('Best genome: ' + JSON.stringify(best.genome));
console.log("Testing best genome");
console.log(0, ":", Math.round(best.genome.activate([1, 1])[0]), Math.round(best.genome.activate([0, 0])[0]));
console.log(1, ":", Math.round(best.genome.activate([1, 0])[0]), Math.round(best.genome.activate([0, 1])[0]));
