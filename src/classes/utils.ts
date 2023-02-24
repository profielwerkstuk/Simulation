// usefull functions maybe?

import { direction } from "../types.js";

function round(value: number, precision: number) {
    var multiplier = Math.pow(10, Math.round(precision) || 0);
    return Math.round(value * multiplier) / multiplier;
}

const directions: direction[] = ["top", "left", "bottom", "right"]


export { round, directions }