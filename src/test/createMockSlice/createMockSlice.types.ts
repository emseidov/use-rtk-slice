import type { Mock } from 'vitest'
import type {
  Slice,
  SliceState,
  SliceSelectors,
  SliceActions
} from '../../useSlice.types'
import type { OmitFirst } from '../../utils/utils.types'

export interface Config {
  createSpy(): any
  mockImplementation(implementations: any): void
}

export type MockValues<T extends Slice> = {
  [K in keyof SliceSelectors<T>]: (
    ...params: OmitFirst<Parameters<SliceSelectors<T>[K]>>
  ) => SliceState<T>
} & { state: SliceState<T> }

export type MockSliceReturn<T extends Slice> = {
  [K in keyof SliceActions<T>]: Mock
}
