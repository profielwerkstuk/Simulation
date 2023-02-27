// usefull functions maybe?

import { direction } from "../types.js";

function round(value: number, precision: number) {
    var multiplier = Math.pow(10, Math.round(precision) || 0);
    return Math.round(value * multiplier) / multiplier;
}

function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const directions: direction[] = ["top", "left", "bottom", "right"]


export { round, directions, mulberry32 }