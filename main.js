import Bird from "./script/bird.js";
import { assets, audioCtx, canvas, ctx, fps, height, width } from "./script/constants.js";
import Obstacle from "./script/obstacle.js";
import SpriteAnimator from "./script/spritesheet.js";
import { getRandom, getRandomValue, playSound } from "./script/utils.js";

let bird = [];
let bestBird;
const count = 1000;
let pipes = [];
let lastSpawn = 0;
let spawnSeed = 500;

const assetUrl = {
    imgs: {
        '0': '0.png',
        '1': '1.png',
        '2': '2.png',
        '3': '3.png',
        '4': '4.png',
        '5': '5.png',
        '6': '6.png',
        '7': '7.png',
        '8': '8.png',
        '9': '9.png',
        message: 'message.png',
        gameover: 'gameover.png',
        bird: 'bird.png',
        pole: 'electric-pole.png',
        bg: 'background-day.png'
    },
    audio: {
        wing: 'wing.wav',
        die: 'die.wav',
    }
}

let background;
const highScore = localStorage.getItem('highscore');

function main(t) {
    bestBird = bird.find(b => b.x == Math.max(
        ...bird.map(b => b.x)
    ) && b.alive);
    canvas.width = width;
    background.slide(t);
    ctx.save();
    ctx.translate(width / 3 - bestBird.x, 0)

    if (background.fps !== bestBird.speed * 0.5)
        background.fps = bestBird.speed * 0.5;
    if (t - lastSpawn > spawnSeed) {
        lastSpawn = t;
        spawnSeed = getRandom(100, 5000);
        const h = getRandom(1, 10);
        pipes.push(new Obstacle({ x: canvas.width + bestBird.x, y: getRandomValue([0, height - ((64 * h) * 0.8)]), scaleW: getRandom(1, 1.2), scaleH: h, incBoundingBoxHeight: 0.8, incBoundingBoxWidth: 0.2 }));
    }
    bird.forEach((b) => {
        if (b.alive) {
            b.checkColision(pipes);
            b.update(t);
        }
        b.draw(t);
    })
    pipes = pipes.filter((pipe) => {
        pipe.draw(t);

        // if (pipe.x > bird.x - canvas.width) {
        return true;
        // }

        return false
    })

    // pipes.forEach((pipe) => {
    //     pipe.draw(ctx);
    // })

    ctx.restore();

    const score = Math.floor(bestBird.x - width / 2);
    ctx.font = '20px serif';
    ctx.fillStyle = 'azure';
    ctx.fillText(`Score: ${score} ${highScore ? 'highscore ' + highScore : ''}`, 10, 20);

    // if (bird.alive) {
    if (true) {
        requestAnimationFrame(main);
    } else {
        playSound('die');
        let message = `Score: ${score}`;
        if (highScore && Number(highScore) >= 0) {
            if (score > Number(highScore)) {
                message += `  New highscore: ${score}`;
                localStorage.setItem('highscore', score)
            } else {
                message += `  Highscore: ${highScore}`;
            }
        } else {
            localStorage.setItem('highscore', score);
        }
        const gameOver = assets.imgs['gameover'];
        ctx.fillStyle = 'brown';
        ctx.drawImage(gameOver, (width - gameOver.width) / 2, (height - gameOver.height) / 2);

        const { width: TextWidth } = ctx.measureText(message);
        ctx.fillStyle = 'brick';
        ctx.fillText(message, (width - TextWidth) / 2, height / 2 + 50);
        const restartText = 'Restart Game';
        ctx.font = '20px monospace';
        ctx.fillStyle = 'springgreen'
        const { width: RestartTextWidth } = ctx.measureText(restartText);
        ctx.fillText(restartText, (width - RestartTextWidth) / 2, height / 2 + 80);
        addEventListener('click', () => {
            init();
        }, {
            once: true
        })
        addEventListener('keydown', () => {
            init();
        }, {
            once: true
        })
    }
}


async function init() {
    // preload image
    await Promise.all(Object.entries(assetUrl.imgs).map(([name, url]) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `./sprites/${url}`;
            img.onload = () => resolve();
            assets.imgs[name] = img;
        })
    }));

    // preload audio
    await Promise.all(Object.entries(assetUrl.audio).map(async ([name, url]) => {
        return await new Promise(async (resolve) => {
            const response = await fetch(`./audio/${url}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            assets.audio[name] = audioBuffer;
            resolve();
        })
    }));

    const bg = assets.imgs['bg'];
    const message = assets.imgs['message'];

    for (let i = 0; i < count; i++) {
        bird.push(new Bird({
            x: width / 2,
            y: height / 2
        }));
    }

    bestBird = bird[0];

    background = new SpriteAnimator({
        type: 'slide',
        spriteSheet: bg,
        columnLen: 1,
        rowLen: 1,
        height,
        width,
        fps: bestBird.speed * 0.5
    });

    background.slide(0);
    ctx.drawImage(message, (width - message.width) / 2, (height - message.height) / 2)


    // addEventListener('click', () => {
    //     let count = 9
    //     const intervalId = setInterval(() => {
    //         ctx.clearRect(0, 0, width, height);
    //         background.slide(0);
    //         const img = assets.imgs[count.toString()];
    //         if (count < 0) {
    //             clearInterval(intervalId);
    //             requestAnimationFrame(main);
    //             return;
    //         }
    //         ctx.drawImage(img, (width - img.width) / 2, (height - img.height) / 2);
    //         count--;
    //     }, 300)
    // }, {
    //     once: true
    // })

    requestAnimationFrame(main);

}
init();
