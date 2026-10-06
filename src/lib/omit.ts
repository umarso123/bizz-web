export function omitKeys<T extends object, K extends string>(
  props: T,
  keys: readonly K[],
): Omit<T, K> {
  const blocked = new Set<string>(keys)
  const rest: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!blocked.has(key)) rest[key] = props[key as keyof T]
  }

  return rest as Omit<T, K>
}
