export function omitKeys(props, keys) {
    const blocked = new Set(keys);
    const rest = {};
    for (const key of Object.keys(props)) {
        if (!blocked.has(key))
            rest[key] = props[key];
    }
    return rest;
}
