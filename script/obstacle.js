import { assets, ctx, fps } from "./constants.js";
import SpriteAnimator from "./spritesheet.js";

export default class Obstacle {
    constructor({
        x,
        y,
        width = 32,
        height = 64,
        scaleW = 1,
        scaleH = 2,
        incBoundingBoxWidth = 0,
        incBoundingBoxHeight = 0,
    }) {
        this.x = x;
        this.y = y;
        this.width = (width * scaleW) * incBoundingBoxWidth;
        this.height = (height * scaleH) * incBoundingBoxHeight;
        this.animator = new SpriteAnimator({
            spriteSheet: assets.imgs['pole'],
            width: width,
            height: height,
            columnLen: 3,
            rowLen: 1,
            scale: {
                w: scaleW,
                h: scaleH
            },
            fps
        });
    }

    getVertices() {
        const left = this.x + this.width;
        const bottom = this.y + this.height;
        return [
            {
                x: this.x,
                y: this.y,
            },
            {
                x: left,
                y: this.y,
            },
            {
                x: left,
                y: bottom,
            },
            {
                x: this.x,
                y: bottom,
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

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        this.animator.animate(t);
        ctx.restore();
    }
}