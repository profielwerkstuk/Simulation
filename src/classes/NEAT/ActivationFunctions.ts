interface ActivationFunction {
	(input: number, alpha?: number): number;
}

const SIGMOID: ActivationFunction = (input: number): number => {
	return 1 / (1 + Math.exp(-input));
}

const TANH: ActivationFunction = (input: number): number => {
	return Math.tanh(input);
}

const RELU: ActivationFunction = (input: number): number => {
	return input > 0 ? input : 0;
}

const Gaussian: ActivationFunction = (input: number): number => {
	return Math.exp(-(input**2));
}

const ELU: ActivationFunction = (input: number, alpha?: number): number => {
	return ((input > 0) ? input : (alpha!*Math.expm1(input)));
}

const SELU: ActivationFunction = (input: number): number => {
	return 1.0507 * ELU(input, 1.67326);
}


const ActivationFunctions = { SIGMOID: SIGMOID, TANH: TANH, RELU: RELU, Gaussian: Gaussian, ELU: ELU, SELU: SELU };

export { ActivationFunction as IActivationFunction, ActivationFunctions };