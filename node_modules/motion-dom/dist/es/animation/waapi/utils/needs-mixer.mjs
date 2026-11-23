/**
 * Whether an animation needs its mixer, which WAAPI can't call. Numbers
 * blend as usual, and an animation whose mixer declines every pair runs
 * as it would without one.
 */
const needsMixer = ({ mixer, keyframes }) => mixer &&
    typeof keyframes[0] !== "number" &&
    keyframes.some((keyframe, i) => i && mixer(keyframes[i - 1], keyframe));

export { needsMixer };
//# sourceMappingURL=needs-mixer.mjs.map
