import Layer from "./layer.js";
import NeuralNetwork from "./neural.js";

export class ClassificationNetwork extends NeuralNetwork {
    constructor(inputSize, hiddenLayersSize, outputSize, { activation = 'default', outputactivation = 'default' } ) {
        super();

        this.addLayer(new Layer(inputSize, hiddenLayersSize[0], activation));

        for (let i = 1; i < hiddenLayersSize.length; i++) {
            this.addLayer(new Layer(hiddenLayersSize[i - 1], hiddenLayersSize[i], activation));
        }

        this.addLayer(new Layer(hiddenLayersSize[hiddenLayersSize.length - 1], outputSize, outputactivation));
    }
}