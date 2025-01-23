import { Mock } from 'vitest'
import { Slice } from '@reduxjs/toolkit'
import { SliceState, SliceSelectors, SliceActions } from '../../useSlice.types'

export interface Config {
  createSpy(): any
  mockImplementation(implementations: any): void
}

export type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never

export type MockSlice = Omit<Slice, 'selectors'> & {
  selectors: {
    [key: string]: <T extends Slice>(
      state: SliceState<T>,
      ...params: any[]
    ) => any
  }
}

export type MockValues<T extends MockSlice> = {
  [K in keyof SliceSelectors<T>]: (
    ...params: OmitFirst<Parameters<SliceSelectors<T>[K]>>
  ) => SliceState<T>
} & { state: SliceState<T> }

export type MockSliceReturn<T extends MockSlice> = {
  [K in keyof SliceActions<T>]: Mock
}
