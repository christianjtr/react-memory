import { getValueAsType } from '../../../value/types/utils/get-as-type.mjs';
import { numberValueTypes } from '../../../value/types/maps/number.mjs';
import { transformValueTypes } from '../../../value/types/maps/transform.mjs';
import { transformPropOrder } from '../../utils/keys-transform.mjs';

const translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
};
const numTransforms = transformPropOrder.length;
/**
 * Cache of `translateX(`-style openers so each transform function is a few
 * string concatenations rather than a template.
 */
const openers = {};
/**
 * A transform function, e.g. `translateX(10px)` for `x: 10`.
 */
const transformFunction = (key, value, valueAsType = getValueAsType(value, transformValueTypes[key])) => (openers[key] || (openers[key] = (translateAlias[key] || key) + "(")) + valueAsType + ")";
/**
 * Whether a transform value is at its default, so can be left out.
 */
const isDefaultTransform = (key, value) => (typeof value === "number" ? value : parseFloat(value)) ===
    (key.startsWith("scale") ? 1 : 0);
/**
 * Build a CSS transform style from individual x/y/scale etc properties.
 *
 * This outputs with a default order of transforms/scales/rotations, this can be customised by
 * providing a transformTemplate function.
 */
function buildTransform(latestValues, transform, transformTemplate) {
    // The transform string we're going to build into.
    let transformString = "";
    /**
     * Loop over all possible transforms in order, adding the ones that
     * are present to the transform string.
     */
    for (let i = 0; i < numTransforms; i++) {
        const key = transformPropOrder[i];
        const value = latestValues[key];
        if (value === undefined)
            continue;
        const valueAsType = transformTemplate &&
            (transform[key] = getValueAsType(value, numberValueTypes[key]));
        if (!isDefaultTransform(key, value)) {
            transformString +=
                transformFunction(key, value, valueAsType || undefined) + " ";
        }
    }
    // `pathRotation` composes onto `rotate` as a separate additive term so
    // the user's `rotate` is never clobbered. Deliberately not a slot in
    // `transformPropOrder`.
    const pathRotation = latestValues.pathRotation;
    if (pathRotation) {
        transformString += transformFunction("rotate", pathRotation);
    }
    transformString = transformString.trim();
    // If we have a custom `transform` template, pass our transform values and
    // generated transformString to that before returning
    return transformTemplate
        ? transformTemplate(transform, transformString)
        : transformString || "none";
}

export { buildTransform, isDefaultTransform, transformFunction, translateAlias };
//# sourceMappingURL=build-transform.mjs.map
