import Matrix from "../helper/matrix.js";

export default class NeuralNetwork {
    constructor() {
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
        return this;
    }

    predict(inputArray) {
        let input = Matrix.fromArray(inputArray);
        for (let layer of this.layers) {
            input = layer.forward(input);
        }
        
        return input.toArray();
    }

}