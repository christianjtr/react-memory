import { Box, Point } from 'motion-utils';
import * as remix_component from 'remix/component';
import { Handle, RemixNode } from 'remix/component';
import { MotionNodeOptions, MotionValue, Transition, ReducedMotionConfig, ScopeSetup, ScopeOptions } from 'motion-dom';

type ReorderAxis = "x" | "y" | "xy";

type ReorderGroupProps<V> = Omit<MotionComponentProps, "values"> & {
    /**
     * The element to render. Defaults to `"ul"`.
     */
    as?: string;
    /**
     * The axis to reorder along. By default, this is detected from the item
     * layout. Use `"xy"` to explicitly enable wrapped layout reordering.
     */
    axis?: ReorderAxis;
    /**
     * Called with the new order of `values`, and the value of the item
     * that moved, for each step of a drag.
     */
    onReorder: (newOrder: V[], moved: V) => void;
    /**
     * The latest values, in order.
     */
    values: V[];
};
type ReorderItemProps<V> = Omit<MotionComponentProps, "layout"> & {
    /**
     * The element to render. Defaults to `"li"`.
     */
    as?: string;
    /**
     * The value in the group's `values` that this item represents.
     */
    value: V;
    /**
     * Set to `"position"` to animate only the position of the item when
     * the order changes.
     *
     * @default true
     */
    layout?: true | "position";
};
type Grab = (element: Element, from?: any[]) => void;
interface ItemHandle {
    element?: HTMLElement;
    update: () => void;
}
interface ReorderContext {
    axis: ReorderAxis;
    hasReordered: boolean;
    getElement: () => Element | undefined;
    registerItem: (value: any, layout: Box) => void;
    /**
     * Each rendered item, for arrow keys to focus.
     */
    items: Map<any, ItemHandle>;
    /**
     * Whether an item is in the tab order. Only one in `values` is: the
     * last focused, or the first rendered.
     */
    isTabStop: (value: any) => boolean;
    setActive: (value: any) => void;
    checkTabStop: () => void;
    updateOrder: (value: any, offset: Point, velocity: Point) => void;
    onKeyDown: (event: KeyboardEvent, item: any, from: any[] | undefined, grab: Grab) => void;
}
/**
 * Creates `Reorder.Group` and `Reorder.Item`, rendering the components of
 * `motion`.
 */
interface ReorderComponents {
    Group: (handle: Handle<ReorderGroupProps<any>, ReorderContext>) => () => RemixNode;
    Item: (handle: Handle<ReorderItemProps<any>>) => () => RemixNode;
}

type MotionStyle = Record<string, string | number | MotionValue | undefined>;
/**
 * The same props as React's `<motion.div>`, without React's DOM props.
 */
interface MotionProps extends MotionNodeOptions {
    style?: MotionStyle;
}
interface MotionConfigProps {
    transition?: Transition;
    reducedMotion?: ReducedMotionConfig;
    children?: RemixNode;
}
interface AnimatePresenceProps {
    /**
     * Set to `false` to skip the `initial` animation of the motion elements
     * rendered with `AnimatePresence`'s first render.
     */
    initial?: boolean;
    /**
     * - `"sync"`: Elements enter and exit at the same time.
     * - `"wait"`: New elements render after the exiting elements are removed.
     * - `"popLayout"`: Exiting elements are taken out of the layout with
     *   `position: absolute`, so the elements around them can move at once.
     */
    mode?: "sync" | "wait" | "popLayout";
    /**
     * In "popLayout" mode, the side exiting elements stay pinned to.
     *
     * @default "left"
     */
    anchorX?: "left" | "right";
    /**
     * In "popLayout" mode, the side exiting elements stay pinned to.
     *
     * @default "top"
     */
    anchorY?: "top" | "bottom";
    /**
     * A value that replaces `custom` on exiting elements, to resolve
     * dynamic `exit` variants with the latest data.
     */
    custom?: any;
    /**
     * Called when every exiting element is removed.
     */
    onExitComplete?: VoidFunction;
    children?: RemixNode;
}
interface LayoutGroupProps {
    /**
     * Prefixes every `layoutId` inside, so separate groups can use the
     * same `layoutId`s without animating between each other.
     */
    id?: string;
    children?: RemixNode;
}
interface PresenceGroup {
    props: AnimatePresenceProps;
    isFirstRender: boolean;
}
/**
 * Set a default `transition` and `reducedMotion` for every motion element
 * below it.
 *
 * @public
 */
declare function MotionConfig(handle: Handle<MotionConfigProps, MotionConfigProps>): () => RemixNode;
/**
 * Keep removed children of `AnimatePresence` until their motion elements
 * finish their `exit` animations. Also choose how entering and exiting
 * children share the screen, skip their first `initial` animation, and
 * know when exits finish.
 *
 * @public
 */
declare function AnimatePresence(handle: Handle<AnimatePresenceProps, PresenceGroup>): () => remix_component.RemixElement[];
/**
 * Inside `AnimatePresence`: keep the exiting child until `exit` resolves,
 * like React's `safeToRemove`. Call it in each render while `isPresent()`
 * is `false`.
 *
 * @public
 */
declare function holdPresence(handle: Handle<any, any>, exit: Promise<void>): void;
/**
 * Inside `AnimatePresence`: whether the component is present, or exiting.
 *
 * @public
 */
declare function isPresent(handle: Handle<any, any>): boolean;
/**
 * Inside `AnimatePresence`: the `custom` value of `AnimatePresence`, while
 * the component exits.
 *
 * @public
 */
declare function getPresenceData(handle: Handle<any, any>): any;
/**
 * Give the `layoutId`s inside an `id`, so separate groups don't animate
 * between each other.
 *
 * @public
 */
declare function LayoutGroup(handle: Handle<LayoutGroupProps, LayoutGroupProps>): () => RemixNode;
declare const motionMixin: remix_component.MixinFactory<Element, [props: MotionProps], remix_component.ElementProps>;
type MotionComponentProps = MotionProps & {
    children?: RemixNode | MotionValue;
    [key: string]: any;
};
type MotionComponent = (handle: Handle<MotionComponentProps>) => () => RemixNode;
type Motion = typeof motionMixin & {
    [Tag in keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap]: MotionComponent;
};
/**
 * Animate elements with Motion in Remix 3, with the same props as React's
 * `<motion.div>`:
 *
 * ```tsx
 * <motion.ul initial="hidden" animate="visible" variants={list}>
 *     {items.map((item) => (
 *         <motion.li key={item.id} variants={item} exit={{ opacity: 0 }} />
 *     ))}
 * </motion.ul>
 * ```
 *
 * `initial` is rendered on the server. `exit` keeps an element, and
 * everything inside it, in the DOM until its exit animation finishes.
 *
 * `motion(props)` is the same as a mixin for any element, as used by the
 * components.
 *
 * Experimental: Remix 3's component API is new, so this API can change
 * in a minor release.
 *
 * @public
 */
declare const motion: Motion;
/**
 * The `mix` form of vanilla `scopeMotion()`: run `setup` in a scope rooted
 * at this element, so selectors resolve inside it. Everything it starts is
 * cancelled, and inline styles restored, when the element is removed.
 *
 * ```tsx
 * <ul mix={scopeMotion(() => {
 *     animate("li", { opacity: [0, 1] }, { delay: stagger(0.05) })
 * })} />
 * ```
 *
 * @public
 */
declare const scopeMotion: remix_component.MixinFactory<HTMLElement, [setup: ScopeSetup, options?: ScopeOptions | undefined], remix_component.ElementProps>;
/**
 * Drag, or grab with Space and move with the arrow keys, to reorder a
 * list, with the same props as React's `Reorder`:
 *
 * ```tsx
 * <Reorder.Group values={items} onReorder={(next) => {
 *     items = next
 *     handle.update()
 * }}>
 *     {items.map((item) => (
 *         <Reorder.Item key={item} value={item}>{item}</Reorder.Item>
 *     ))}
 * </Reorder.Group>
 * ```
 *
 * @public
 */
declare const Reorder: ReorderComponents;

export { AnimatePresence, type AnimatePresenceProps, LayoutGroup, type LayoutGroupProps, type MotionComponent, type MotionComponentProps, MotionConfig, type MotionConfigProps, type MotionProps, type MotionStyle, Reorder, getPresenceData, holdPresence, isPresent, motion, scopeMotion };
