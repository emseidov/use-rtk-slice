import type { Slice } from '../useSlice.types'

export type ObjectEntriesReturn<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][] & {}

export type Expand<T> = { [P in keyof T]: T[P] } & {}

export type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never

export type BoundSelectors<T extends Slice['selectors']> = {
  [K in keyof T]: (...params: OmitFirst<Parameters<T[K]>>) => ReturnType<T[K]>
}
