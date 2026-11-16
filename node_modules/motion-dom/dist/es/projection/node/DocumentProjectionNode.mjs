import { addDomEvent } from '../../events/add-dom-event.mjs';
import { measureDocumentScroll } from '../utils/measure.mjs';
import { createProjectionNode } from './create-projection-node.mjs';

const DocumentProjectionNode = 
/* @__PURE__ */ createProjectionNode({
    attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
    measureScroll: measureDocumentScroll,
    checkIsScrollRoot: () => true,
});

export { DocumentProjectionNode };
//# sourceMappingURL=DocumentProjectionNode.mjs.map
