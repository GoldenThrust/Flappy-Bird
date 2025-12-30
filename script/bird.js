import { ClassificationNetwork } from "./brain/classification.js";
import { assets, ctx, fps, height, width } from "./constants.js";
import Sensor from "./sensor.js";
import SpriteAnimator from "./spritesheet.js";
import { playSound, throtle, vertsIntersect } from "./utils.js";

const playWingSound = throtle(playSound, 100);
export default class Bird {
    constructor({
        x = 0, y = 0, angle = 0, width = 64, height = 48, scale = 0.5
    }) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = width * scale;
        this.height = height * scale;
        this.fly = false;
        this.alive = true;
        // pythagoras theorem
        this.radii = Math.hypot(this.width, this.height) / 2;
        // 0 = Tan(adj/opp)
        this.alpha = Math.atan2(this.height, this.width);
        this.animator = new SpriteAnimator({
            spriteSheet: assets.imgs['bird'],
            width: width,
            height: height,
            columnLen: 3,
            rowLen: 1,
            scale,
            fps
        });
        this.speed = 1;
        this.dy = 3;
        this.lastUpdate = 0;
        this.sensor = new Sensor({ bird: this });
        this.brain = new ClassificationNetwork(this.sensor.raysCount, [12, 6, 8], 1, {});
        console.log(this.brain);

        // this.#addEventListener();
    }

    #addEventListener() {
        addEventListener('keyup', () => {
            this.fly = false;
        });
        addEventListener('keydown', () => {
            this.fly = true;
        });
    }

    getVertices() {
        // x coord: A * cos(0)
        // y coord: B * sin()
        return [
            {
                x: this.x + Math.cos(this.angle + this.alpha) * this.radii,
                y: this.y + Math.sin(this.angle + this.alpha) * this.radii,
            },
            {
                x: this.x + Math.cos(this.angle - this.alpha) * this.radii,
                y: this.y + Math.sin(this.angle - this.alpha) * this.radii,
            },
            {
                x: this.x + Math.cos(Math.PI + this.angle + this.alpha) * this.radii,
                y: this.y + Math.sin(Math.PI + this.angle + this.alpha) * this.radii,
            },
            {
                x: this.x + Math.cos(Math.PI + this.angle - this.alpha) * this.radii,
                y: this.y + Math.sin(Math.PI + this.angle - this.alpha) * this.radii,
            },
        ]
    }

    draw(t) {
        // const vertices = this.getVertices();

        // ctx.beginPath();
        // ctx.moveTo(vertices[0].x, vertices[0].y);
        // for (let i = 1; i < vertices.length; i++) {
        //     ctx.lineTo(vertices[i].x, vertices[i].y);
        // }
        // ctx.closePath();
        // ctx.fill();

        this.sensor.draw();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        this.animator.animate(t);
        ctx.restore();
    }

    update(t) {
        if (t - this.lastUpdate > 10000) {
            this.speed = Math.min(this.speed + 0.5, 20);
            this.lastUpdate = t;
        }
        this.x += this.speed;

        if (this.fly) {
            this.y -= this.dy - 1;
            this.angle = Math.max(this.angle - 0.1, -Math.PI / 12);
            playWingSound('wing', 0.05);
        } else {
            this.y += this.dy;
            this.angle = Math.min(this.angle + 0.01, Math.PI / 4)
        }

        if (!this.fly) {
            this.animator.currentFrame = 0;
        }
    }

    checkColision(obstacles) {
        const bgT = {
            getVertices: () => [
                {
                    x: this.x - width,
                    y: 0 - this.height
                },
                {
                    x: this.x + width,
                    y: 0 - this.height
                }
            ]
        }
        const bgB = {
            getVertices: () => [
                {
                    x: this.x - width,
                    y: height + this.height
                },
                {
                    x: this.x + width,
                    y: height + this.height
                }
            ]
        }

        const objects = [...obstacles, bgT, bgB];

        objects.forEach(vert => {
            if (vertsIntersect(this.getVertices(), vert.getVertices())) {
                this.alive = false;
                return;
            }
        });

        this.sensor.update(objects);
        const offsets = this.sensor.readings.map(
            s => s == null ? 0 : 1 - s.offset
        );


        const ouput = this.brain.predict(offsets);
        if (ouput[0]) this.fly = true;
        else this.fly = false;
    }
}
