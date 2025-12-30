import { ctx } from "./constants.js";
import { getIntersection, lerp } from "./utils.js";

export default class Sensor {
    constructor({
        bird,
        raycount = 10,
        raylen = 300,
        rayspread = Math.PI / 1.7
    }) {
        this.bird = bird;
        this.raysCount = raycount;
        this.rayLen = raylen;
        this.raySpread = rayspread;

        this.rays = [];
        this.readings = [];
    }

    draw() {
        for (let i = 0; i < this.raysCount; i++) {
            const start = this.rays[i][0];
            let end = this.rays[i][1];

            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();


        }
    }

    update(obstacles) {
        this.#castRays();
        this.readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(this.#getReading(this.rays[i], obstacles));
        }
    }

    #getReading(ray, obstacles) {
        const touches = [];
        for (let i = 0; i < obstacles.length; i++) {
            const vertices = obstacles[i].getVertices();
            for (let j = 0; j < vertices.length; j++) {
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    vertices[j],
                    vertices[(j + 1) % vertices.length]
                )

                if (touch) {
                    touches.push(touch);
                }
            }
        }

        if (touches.length === 0) return null;
        else {
            return touches.toSorted((a, b) => a.offset - b.offset)[0];
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.raysCount; i++) {
            const alpha = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.raysCount === 1 ? 0.5 : i / (this.raysCount - 1)
            ) + this.bird.angle;

            const start = {
                x: this.bird.x,
                y: this.bird.y
            }

            const end = {
                x: this.bird.x + Math.cos(alpha) * this.rayLen,
                y: this.bird.y + Math.sin(alpha) * this.rayLen
            }

            this.rays.push([start, end]);
        }
    }
}