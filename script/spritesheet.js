import { ctx } from "./constants.js";

export default class SpriteAnimator {
    constructor({ type, spriteSheet, width, height, scale = 2, fps = 24, columnLen, rowLen }) {
        this.type = type;
        this.spriteSheet = spriteSheet;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.fps = fps;
        this.columnLen = columnLen;
        this.rowLen = rowLen;
        this.totalFrames = columnLen * rowLen;
        this.currentFrame = 0;
        this.lastUpdate = 0;

        this.forwardMotion = true;

        this.slice = Math.ceil(width / spriteSheet.width);

        if (this.type === 'slide' && spriteSheet.width < width) {
            this.currentFrame = width - spriteSheet.width;
        }
    }

    animate(t) {
        const updated = this.updateFrame(t);

        if (updated) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }

        const column = this.currentFrame % this.columnLen;
        const row = Math.floor(this.currentFrame / this.columnLen);

        SpriteAnimator.drawSpriteAnimation(this.spriteSheet, column, row, this.width, this.height, this.scale);
    }

    slide(t) {
        if (this.type !== 'slide') throw Error('Instance is not a slide animator');
        if (this.forwardMotion) {
            if (this.spriteSheet.width > this.width) {
                if (this.currentFrame <= this.width - (this.spriteSheet.width * 2)) {
                    this.currentFrame = this.width - this.spriteSheet.width;
                }
                if (this.currentFrame <= this.width - this.spriteSheet.width) {
                    ctx.drawImage(this.spriteSheet, this.currentFrame + this.spriteSheet.width - this.fps, 0, this.spriteSheet.width, this.height);
                }
            } else {
                if (this.currentFrame <= this.width - this.spriteSheet.width + this.fps) {
                    this.currentFrame = this.currentFrame + this.spriteSheet.width;
                }
                for (let i = 0; i < this.slice; i++) {
                    if (this.currentFrame - (this.spriteSheet.width * i) >= this.width - (this.spriteSheet.width * this.slice)) {
                        ctx.drawImage(this.spriteSheet, this.currentFrame - (this.spriteSheet.width * (i + 1)) - this.fps, 0, this.spriteSheet.width, this.height);
                    }
                }
            }
            this.currentFrame -= this.fps;
        } else {
            if (this.currentFrame > this.width) {
                this.currentFrame = this.width - this.spriteSheet.width;
            }

            if (this.spriteSheet.width > this.width) {
                if (this.currentFrame > this.width - this.spriteSheet.width) {
                    ctx.drawImage(this.spriteSheet, this.currentFrame - this.spriteSheet.width + this.fps, 0, this.spriteSheet.width, this.height);
                }
            } else {
                for (let i = 0; i < this.slice; i++) {
                    if (this.currentFrame - (this.spriteSheet.width * i) > -this.fps) {
                        ctx.drawImage(this.spriteSheet, this.currentFrame - (this.spriteSheet.width * (i + 1)) + this.fps, 0, this.spriteSheet.width, this.height);
                    }
                }
            }
            this.currentFrame += this.fps;
        }

        ctx.drawImage(this.spriteSheet, this.currentFrame, 0, this.spriteSheet.width, this.height);
    }

    updateFrame(t) {
        if (t - this.lastUpdate > 1000 / this.fps) {
            this.lastUpdate = t;

            return true;
        }

        return false;
    }

    static drawSpriteAnimation(spriteSheet, frameX, frameY, width, height, scale) {
        let scaleWidth;
        let scaleHeight;
        if (scale instanceof Object) {
            scaleWidth = scale['w'];
            scaleHeight = scale['h'];
        } else {
            scaleWidth = scale;
            scaleHeight = scale;
        }
        ctx.drawImage(spriteSheet, frameX * width, frameY * height, width, height, -width * (scaleWidth / 2), -height * (scaleHeight / 2), scaleWidth * width, scaleHeight * height);
    }
}
