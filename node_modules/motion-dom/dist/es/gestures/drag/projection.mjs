import { noop, SubscriptionManager } from 'motion-utils';
import { resolveVisualElement } from '../../layout/visual-element.mjs';
import { roundBox } from '../../projection/geometry/round.mjs';
import { measurePageBox, measureDocumentScroll } from '../../projection/utils/measure.mjs';
import { visualElementStore } from '../../render/store.mjs';

/**
 * animateLayout() registers a function here that creates nodes in the
 * layout projection tree. When it's in the bundle, drag() uses those, so
 * the two work together (e.g. a drag follows a layout change mid-gesture).
 * Otherwise drag() makes do with a node that only measures. Bundles that
 * don't tree-shake (dev pre-bundling, CDN builds) always register it, and
 * a drag() started before animateLayout() is lazy loaded keeps its node.
 */
const layoutProjection = {};
/**
 * The document root of measurement-only nodes. Like the projection tree's
 * root, it keeps its scroll until drag controls clear it to re-measure.
 */
const root = {
    updateScroll: () => {
        root.scroll || (root.scroll = { offset: measureDocumentScroll() });
    },
};
/**
 * The part of a projection node that drag controls use: measuring the
 * element's page box, for its layout and constraints. It never projects
 * or joins a layout update.
 */
const createMeasureNode = (element) => {
    const visualElement = resolveVisualElement(element);
    const measureListeners = new SubscriptionManager();
    const node = {
        instance: element,
        root,
        path: [root],
        setOptions: noop,
        /**
         * Truthy like the full node's method, which HTMLVisualElement reads
         * (rather than calls) to default transform values.
         */
        isProjecting: noop,
        applyProjectionStyles: noop,
        removeElementScroll: (box) => box,
        updateLayout: () => {
            const layoutBox = measurePageBox(element, root, visualElement.getTransformPagePoint());
            roundBox(layoutBox);
            node.layout = { layoutBox };
            measureListeners.notify();
        },
        addEventListener: (name, handler) => name === "measure" ? measureListeners.add(handler) : noop,
        /**
         * Detach from the VisualElement too, so it doesn't later remount
         * (or a `motion` component's layout feature adopt) a node that
         * can't do either.
         */
        unmount: () => {
            node.instance = undefined;
            if (visualElement.projection === node) {
                visualElement.projection = undefined;
            }
        },
    };
    visualElement.projection = node;
    visualElement.current || visualElement.mount(element);
    return [node, node.unmount];
};
/**
 * Get a projection node for drag() to measure an element with, and a
 * function that releases it. Reuses a node a `motion` component or
 * animateLayout() owns.
 */
const acquireDragNode = (element) => {
    const owned = visualElementStore.get(element)?.projection;
    /**
     * A VisualElement can outlive its node (e.g. an unmounted `motion`
     * component's), so only reuse a node that's still mounted.
     */
    return owned?.instance
        ? [owned, noop]
        : (layoutProjection.create || createMeasureNode)(element);
};

export { acquireDragNode, layoutProjection };
//# sourceMappingURL=projection.mjs.map
