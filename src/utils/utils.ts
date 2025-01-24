import { useRef, type RefObject } from 'react'
import type { Slice } from './../useSlice.types'
import type { ObjectEntriesReturn, Expand, BoundSelectors } from './utils.types'

export function objectEntries<T extends Record<string, any>>(
  obj: T
): ObjectEntriesReturn<T> {
  return Object.keys(obj).map((key) => [key, obj[key]])
}

export function assoc<
  T extends Record<PropertyKey, any>,
  K extends PropertyKey,
  V extends T[K]
>(obj: T, key: K, value: V): Expand<T & Record<K, V>> {
  obj[key] = value

  return obj
}

export function append<T>(array: T[], element: T) {
  array.push(element)

  return array
}

export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  ref.current = value

  return ref
}

export function bindSelectors<
  T extends Slice['selectors'],
  K extends Slice['name'],
  V extends RefObject<ReturnType<Slice['selectSlice']>>
>(selectors: T, sliceName: K, stateRef: V) {
  return objectEntries(selectors).reduce(
    (accumulator, [name, fn]) =>
      assoc(accumulator, name, (...rest: any[]) =>
        fn({ [sliceName]: stateRef.current }, ...rest)
      ),
    {} as BoundSelectors<T>
  )
}
