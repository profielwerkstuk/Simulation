// usefull functions maybe?

function round(value: number, precision: number) {
    var multiplier = Math.pow(10, Math.round(precision) || 0);
    return Math.round(value * multiplier) / multiplier;
}


export { round }