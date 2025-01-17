export type ObjectEntriesReturn<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][] & {}

export type Expand<T> = { [P in keyof T]: T[P] } & {}

export type BoundSelector<T extends (...args: any[]) => any> = T extends (
  state: any,
  ...args: infer Args
) => infer Return
  ? (...args: Args) => Return
  : never

export type BoundSelectors<T extends Record<string, (...args: any[]) => any>> =
  {
    [P in keyof T]: BoundSelector<T[P]>
  }
