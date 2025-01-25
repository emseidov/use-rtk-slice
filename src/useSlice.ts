import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useLatest, bindSelectors } from './utils'
import type { Slice, UseSliceReturn } from './useSlice.types'

function useSlice<T extends Slice>(slice: T): UseSliceReturn<T> {
  const { selectSlice, actions, selectors, name } = slice
  const state = useSelector(selectSlice)
  const stateRef = useLatest(state)
  const dispatch = useDispatch()

  const boundActions = useMemo(
    () => bindActionCreators(actions, dispatch),
    [actions, dispatch]
  )
  const boundSelectors = useMemo(
    () => bindSelectors(selectors, name, stateRef),
    [selectors, name, stateRef]
  )

  return [state, boundActions, boundSelectors]
}

export const useSliceRef = { useSlice }
