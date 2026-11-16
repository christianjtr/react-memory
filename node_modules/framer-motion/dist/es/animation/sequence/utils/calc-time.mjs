/**
 * The time of a label, or a label with an offset like "label+1" or
 * "label-0.5". An exact label name wins over an offset.
 */
function calcLabelTime(position, labels) {
    if (labels.has(position))
        return labels.get(position);
    const [, name, offset] = position.match(/^(.+?)([+-][\d.]+)$/) || [];
    return labels.has(name)
        ? Math.max(0, labels.get(name) + parseFloat(offset))
        : undefined;
}
/**
 * Given a absolute or relative time definition and current/prev time state of the sequence,
 * calculate an absolute time for the next keyframes.
 */
function calcNextTime(current, next, prev, labels) {
    if (typeof next === "number") {
        return next;
    }
    else if (next.startsWith("-") || next.startsWith("+")) {
        return Math.max(0, current + parseFloat(next));
    }
    else if (next === "<") {
        return prev;
    }
    else if (next.startsWith("<")) {
        return Math.max(0, prev + parseFloat(next.slice(1)));
    }
    else {
        return calcLabelTime(next, labels) ?? current;
    }
}

export { calcLabelTime, calcNextTime };
//# sourceMappingURL=calc-time.mjs.map
