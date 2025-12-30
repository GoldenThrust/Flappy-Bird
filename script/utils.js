import { assets, audioCtx } from "./constants.js";

export function getRandom(min, max) {
    return (Math.random() * (max - min) + min)
}

export function getRandomValue(items) {
    const len = items.length;
    return items[Math.floor(getRandom(0, len))];
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function getIntersection(a, b, c, d) {
    // I = a + (b-a) * t = c + (d-c) * u;
    const tTop = (a.y - c.y) * (d.x - c.x) - (a.x - c.x) * (d.y - c.y);
    const uTop = (a.x - b.x) * (c.y - a.y) - (a.y - b.y) * (c.x - a.x);
    const bottom = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 & t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t
            }
        }
    }


    return null;
}

export function vertsIntersect(verts1, verts2) {
    for (let i = 0; i < verts1.length; i++) {
        for (let j = 0; j < verts2.length; j++) {
            const touch = getIntersection(
                verts1[i],
                verts1[(i + 1) % verts1.length],
                verts2[j],
                verts2[(j + 1) % verts2.length],
            )
            if (touch) return true;
        }
    }

    return false;
}

export function playSound(name, volume = 1) {
    const buffer = assets.audio[name];
    if (!buffer)
        throw Error('Sound not found');

    const source = audioCtx.createBufferSource();

    source.buffer = buffer;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode).connect(audioCtx.destination);
    source.start();
}

export function throtle(func, limit) {
    let lastRun = 0;

    return function (...args) {
        const now = performance.now();

        if (now - lastRun >= limit) {
            func.apply(this, args);
            lastRun = now;
        }
    }
}