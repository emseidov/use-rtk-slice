import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook, type RenderHookResult } from '@testing-library/react'
import {
  configureStore,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { useSlice } from './useSlice'

interface Todo {
  id: number
  name: string
  done: boolean
}

const initialState: Todo[] = [
  {
    id: Date.now(),
    name: 'Be Awesome 🦄',
    done: false
  }
]

const todosSlice = createSlice({
  name: 'todos',
  initialState: initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo['name']>) {
      state.push({ id: Date.now(), name: action.payload, done: false })
    },
    toggleTodo(state, action: PayloadAction<Todo['id']>) {
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      )
    },
    removeTodo(state, action: PayloadAction<Todo['id']>) {
      return state.filter((todo) => todo.id !== action.payload)
    }
  },
  selectors: {
    selectCompleted: (state) => state.filter((todo) => todo.done)
  }
})

const store = configureStore({
  reducer: { todos: todosSlice.reducer }
})

function useTestSlice() {
  const [state, actions, selectors] = useSlice(todosSlice)

  return { state, actions, selectors }
}

describe('useSlice', () => {
  let result: RenderHookResult<ReturnType<typeof useTestSlice>, any>['result']
  beforeEach(() => {
    const hook = renderHook(() => useTestSlice(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    })
    result = hook.result
  })

  it('should return slice state', () => {
    expect(result.current.state.length).toBe(1)
  })

  it('should return bound slice actions', () => {
    act(() => result.current.actions.addTodo('Spread Good Vibes 🍀'))
    expect(result.current.state.length).toBe(2)

    const todoId = result.current.state[1].id
    act(() => result.current.actions.toggleTodo(todoId))
    expect(result.current.state[1].done).toBe(true)

    act(() => result.current.actions.removeTodo(todoId))
    expect(result.current.state.length).toBe(1)
  })

  it('should return bound slice selectors', () => {
    const todoId = result.current.state[0].id
    act(() => result.current.actions.toggleTodo(todoId))
    expect(result.current.selectors.selectCompleted().length).toBe(1)
  })
})
