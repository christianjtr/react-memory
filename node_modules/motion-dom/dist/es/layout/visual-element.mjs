import { handOffElementState } from '../animation/animate/element.mjs';
import { hasTransform } from '../projection/utils/has-transform.mjs';
import { HTMLVisualElement } from '../render/html/HTMLVisualElement.mjs';
import { visualElementStore } from '../render/store.mjs';

/**
 * Get the VisualElement that imperative APIs like animateLayout() and
 * drag() render an element with, creating one if it has none, ready for
 * a projection node to be attached.
 */
function resolveVisualElement(element) {
    let visualElement = visualElementStore.get(element);
    if (!visualElement) {
        visualElement = new HTMLVisualElement({
            props: {},
            presenceContext: null,
            visualState: {
                latestValues: {},
                renderState: {
                    transform: {},
                    transformOrigin: {},
                    style: {},
                    vars: {},
                },
            },
        }, { allowProjection: true });
        /**
         * Values animate() has been rendering on this element move to
         * the VisualElement, so the layout animation composes with
         * them instead of overwriting them.
         */
        handOffElementState(element, visualElement);
    }
    /**
     * A first-time element may carry a projection transform in its
     * inline style (e.g. it was cloned from an element mid-animation).
     * That transform isn't tracked in latestValues so the engine can't
     * reset it before measuring - clear it now so the first layout
     * measurement isn't inflated.
     */
    if (element.style.transform && !hasTransform(visualElement.latestValues)) {
        element.style.transform = "";
    }
    return visualElement;
}

export { resolveVisualElement };
//# sourceMappingURL=visual-element.mjs.map
