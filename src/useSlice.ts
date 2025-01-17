import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators, type Slice } from '@reduxjs/toolkit'
import { useLatest, bindSelectors } from './utils'
import type { UseSliceReturn } from './useSlice.types'

export function useSlice<T extends Slice>(slice: T): UseSliceReturn<T> {
  const state = useSelector(slice.selectSlice)
  const stateRef = useLatest(state)
  const dispatch = useDispatch()

  const actions = useMemo(
    () => bindActionCreators(slice.actions, dispatch),
    [slice.actions, dispatch]
  )
  const selectors = useMemo(
    () => bindSelectors(slice.selectors, slice.name, stateRef),
    [slice.selectors, slice.name, stateRef]
  )

  return [state, actions, selectors]
}
