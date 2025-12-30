export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const { width, height } = canvas.getBoundingClientRect();
canvas.width = width;
canvas.height = height;

export const assets = {
    imgs: {},
    audio: {},
}

export const fps = 24;
export const audioCtx = new (AudioContext || webkitaudioContext)();