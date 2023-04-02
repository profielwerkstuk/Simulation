import type { ActivationFunction } from "./types";

const SIGMOID: ActivationFunction = (input) => 1 / (1 + Math.exp(-input));

const TANH: ActivationFunction = (input) => Math.tanh(input);

const RELU: ActivationFunction = (input) => input > 0 ? input : 0;

const Gaussian: ActivationFunction = (input) => Math.exp(-(input ** 2));

const ELU: ActivationFunction = (input, alpha) => ((input > 0) ? input : (alpha! * Math.expm1(input)));

const SELU: ActivationFunction = (input) => 1.0507 * ELU(input, 1.67326);

const STEP: ActivationFunction = (input) => input > 0 ? 1 : 0;

const ActivationFunctions = { SIGMOID: SIGMOID, TANH: TANH, RELU: RELU, Gaussian: Gaussian, ELU: ELU, SELU: SELU, STEP: STEP };

export { ActivationFunctions };