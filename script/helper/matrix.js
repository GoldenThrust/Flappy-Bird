export default class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
    }

    static multiply(a, b) {
        if (a.cols !== b.rows) throw Error('Columns of A must be equal to rows of B');

        return new Matrix(a.rows, b.cols).map((_, i, j) => {
            let sum = 0;
            for (let k = 0; k < a.cols; k++) {
                sum += a.matrix[i][k] * b.matrix[k][j];
            }

            return sum;
        })
    }

    add(matrix) {
        if (matrix.rows !== this.rows || matrix.cols !== this.cols) throw Error('Matrix dimension must match');

        return this.map((v, i, j) => v + matrix.matrix[i][j]);
    }

    randomize() {
        this.map(() => Math.random() * 2 - 1);

        return this;
    }

    map(func) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = func(this.matrix[i][j], i, j);
            }
        }

        return this;
    }

    static map(matrix, func) {
        return new Matrix(matrix.rows, matrix.cols)
            .map((_, i, j) => func(matrix.matrix[i][j], i, j));
    }

    static fromArray(arr) {
        return new Matrix(arr.length, 1).map((_, i) => arr[i]);
    }

    toArray() {
        let arr = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr.push(this.matrix[i][j]);
            }
        }
        return arr;
    }

}