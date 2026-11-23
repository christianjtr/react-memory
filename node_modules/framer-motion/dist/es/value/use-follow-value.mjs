"use client";
import { isMotionValue, attachFollow } from 'motion-dom';
import { useContext, useInsertionEffect } from 'react';
import { MotionConfigContext } from '../context/MotionConfigContext.mjs';
import { useMotionValue } from './use-motion-value.mjs';
import { useComputed } from './use-computed.mjs';

function useFollowValue(source, options = {}) {
    return useFollow(source, options, attachFollow);
}
function useFollow(source, options, attach) {
    const { isStatic } = useContext(MotionConfigContext);
    const getFromSource = () => (isMotionValue(source) ? source.get() : source);
    // isStatic will never change, allowing early hooks return
    if (isStatic) {
        return useComputed(getFromSource);
    }
    const value = useMotionValue(getFromSource());
    useInsertionEffect(() => {
        return attach(value, source, options);
    }, [value, JSON.stringify(options)]);
    return value;
}

export { useFollow, useFollowValue };
//# sourceMappingURL=use-follow-value.mjs.map
