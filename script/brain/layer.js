import Matrix from "../helper/matrix.js";

export default class Layer {
    constructor(inputSize, outputSize, activation = 'softmax') {
        this.weights = (new Matrix(outputSize, inputSize)).randomize();
        this.biases = (new Matrix(outputSize, 1)).randomize();
        this.activation = activation;
        this.input = null;
        this.ouput = null;
    }

    forward(input) {
        this.input = input;
        const weightedSum = Matrix.multiply(this.weights, this.input).add(this.biases);
        this.output = Layer.activate(weightedSum, this.activation);
        return this.output;
    }

    static activate(x, activation) {
        switch (activation) {
            case 'sigmoid':
                return Matrix.map(x, val => 1 / (1 + Math.exp(-val)));
            case 'relu':
                return Matrix.map(x, val => Math.max(0, val));
            case 'tanh':
                return Matrix.map(x, val => Math.tanh(val));
            case 'softmax':
                const expValues = Matrix.map(x, val => Math.exp(val));
                const sum = expValues.toArray().reduce((a, b) => a + b, 0);
                return Matrix.map(expValues, val => val / sum);
            case 'linear':
                return x;
            default:
                return Matrix.map(x, val => { if (val > 0) return 1; else return 0 })
        }
    }
}

