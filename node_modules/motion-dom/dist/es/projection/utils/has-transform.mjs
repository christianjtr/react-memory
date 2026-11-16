function isIdentityScale(scale) {
    return scale === undefined || scale === 1;
}
function hasScale({ scale, scaleX, scaleY }) {
    return (!isIdentityScale(scale) ||
        !isIdentityScale(scaleX) ||
        !isIdentityScale(scaleY));
}
/**
 * Rotations and skews, which projection can't correct for.
 */
const angleTransforms = [
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skewX",
    "skewY",
];
function hasTransform(values) {
    return (hasScale(values) ||
        has2DTranslate(values) ||
        hasDistortingTransform(values));
}
function hasDistortingTransform(values) {
    return (values.z ||
        values.rotate ||
        values.rotateX ||
        values.rotateY ||
        values.rotateZ ||
        values.skewX ||
        values.skewY);
}
function has2DTranslate(values) {
    return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
    return value && value !== "0%";
}

export { angleTransforms, has2DTranslate, hasDistortingTransform, hasScale, hasTransform };
//# sourceMappingURL=has-transform.mjs.map
