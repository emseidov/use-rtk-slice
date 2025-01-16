import { Slice } from '@reduxjs/toolkit'
import { UseSliceReturn } from './useSlice.types'

export default function useSlice<T extends Slice>(slice: T): UseSliceReturn<T> {
  return null
}
