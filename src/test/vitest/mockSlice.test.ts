import { describe, expect, it, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { append } from '../../utils'
import { useSlice } from '../../useSlice'
import { mockSlice } from './mockSlice'

interface Todo {
  id: number
  name: string
  done: boolean
}

const initialState: Todo[] = [
  {
    id: Date.now(),
    name: 'Feed the cat 🐱',
    done: false
  }
]

export const todosSlice = createSlice({
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
    selectCompleted: (state) => state.filter((todo) => todo.done),
    selectFirstN: (state, n: number) =>
      state.reduce<Todo[]>(
        (accumulator, current, index) =>
          index < n ? append(accumulator, current) : accumulator,
        []
      )
  }
})

function useTestSlice() {
  const [state, actions, selectors] = useSlice(todosSlice)

  return { state, actions, selectors }
}

describe('mockSlice (Vitest)', () => {
  afterEach(() => {
    mockSlice.beforeEach()
  })

  it('should mock state', () => {
    mockSlice(todosSlice, {
      state: [{ id: 0, name: 'Mock todo', done: false }]
    })

    const { result } = renderHook(() => useTestSlice())
    expect(result.current.state[0].name).toBe('Mock todo')
  })

  it('should mock selector return', () => {
    mockSlice(todosSlice, {
      selectCompleted: () => [{ id: 0, name: 'Mock todo', done: false }],
      selectFirstN: () => [
        { id: 0, name: 'Mock todo 1', done: false },
        { id: 1, name: 'Mock todo 2', done: false }
      ]
    })

    const { result } = renderHook(() => useTestSlice())
    expect(result.current.selectors.selectCompleted().length).toBe(1)
    expect(result.current.selectors.selectFirstN(2).length).toBe(2)
  })

  it('should spy on slice actions', () => {
    const { addTodo } = mockSlice(todosSlice)

    const { result } = renderHook(() => useTestSlice())
    result.current.actions.addTodo('Spy action')
    expect(addTodo).toHaveBeenCalledWith('Spy action')
  })
})
