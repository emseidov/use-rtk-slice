<div align="center">
  <h1>use-rtk-slice</h1>
  <p>A <a href="https://react.dev/">React</a> hook for working with <a href="https://redux-toolkit.js.org/">Redux Toolkit</a> slices, with zero setup and boilerplate ⚛️ 🛠️
  </p>
  <p>
    <a href="https://www.npmjs.com/package/use-rtk-slice" target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/use-rtk-slice.svg?label=NPM"></a>
    <a href="https://www.npmjs.com/package/use-rtk-slice" target="_blank"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/use-rtk-slice.svg?label=Downloads" /></a>
    <a href="https://github.com/Lambdaphile/use-rtk-slice/blob/main/src/useSlice.test.tsx" target="_blank"><img alt="Coverage" src="https://img.shields.io/badge/Coverage-100%25-brightgreen"></a>
    <a href="https://www.typescriptlang.org/" target="_blank"><img alt="TypeScript Ready" src="https://img.shields.io/badge/TypeScript-Ready-blue.svg"></a>
  </p>
  <pre>npm i <a href="https://www.npmjs.com/package/use-rtk-slice">use-rtk-slice</a></pre>
</div>
<hr/>

Using Redux Toolkit slices with plain `useSelector` and `useDispatch` hooks often requires:

1. Manually defining typed versions of `useSelector` and `useDispatch` in TypeScript projects: [Define `useAppSelector` and `useAppDispatch`](https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks).
2. Repeatedly writing `const dispatch = useDispatch()` just to dispatch an action.
3. Slice selectors are not bound - using them requires passing the relevant slice state, e.g., `selector({ stateName: state })`.

The `useSlice` hook from `use-rtk-slice` handles all of this: it binds actions and selectors internally, and returns fully typed, ready-to-use slice state, actions, and selectors.

## Contents

- [Usage](#usage)
- [Testing (Mocking Slices)](#testing-mocking-slices)
  - [Mock State](#mock-state)
  - [Mock Selectors](#mock-selectors)
  - [Mock and Spy on Actions](#mock-and-spy-on-actions)

## Usage

Define a RTK slice:

`todosSlice.ts`

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Todo {
  id: number
  name: string
  done: boolean
}

const initialState: Todo[] = [
  {
    id: Date.now(),
    name: '🧪 Write unit tests',
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
    selectCompleted(state) {
      return state.filter((todo) => todo.done)
    }
  }
})
```

Destructure the `state`, and the bound `actions` and `selectors` from the slice as needed, using the `useSlice` hook:

`TodoList.tsx`

```ts
import useSlice from 'use-rtk-slice'
import { todosSlice } from './todosSlice'

function TodoList() {
  const [state, actions, selectors] = useSlice(todosSlice)

  return (
    <div>
      <ul>
        {state.map(({ id, name, done }) => (
          <li key={id}>
            <label>
              <input
                type="checkbox"
                checked={done}
                onChange={() => actions.toggleTodo(id)}
              />
              {done ? <s>{name}</s> : name}
            </label>
            <button onClick={() => actions.removeTodo(id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <p>Completed todo count: {selectors.selectCompleted().length}</p>
    </div>
  )
}
```

## Testing (Mocking Slices)

To mock slices, use the `mockSlice` utility from `use-rtk-slice/test/vitest` or `use-rtk-slice/test/jest`:

### Mock State

```ts
import { mockSlice } from 'use-rtk-slice/test/vitest'
// or
import { mockSlice } from 'use-rtk-slice/test/jest'

import { App } from './App'
import { todoSlice } from './todoSlice'

describe('TodoList', () => {
  beforeEach(() => {
    mockSlice.beforeEach()
  })

  it('should render todos', () => {
    mockSlice(todosSlice, {
      state: [
        { id: 0, name: '🧪 Write unit tests', done: false },
        { id: 1, name: '📝 Update README', done: false }
      ]
    })

    render(<App />)

    const todos = screen.getAllByRole('listitem')
    expect(todos).toHaveLength(2)
  })
})
```

### Mock Selectors

```ts
describe('TodoList', () => {
  beforeEach(() => {
    mockSlice.beforeEach()
  })

  it('should render completed todo count', () => {
    mockSlice(todosSlice, {
      selectCompleted: () => [{ id: 0, name: '🧪 Write unit tests', done: true }]
    })

    render(<App />)

    expect(screen.getByText('Completed todo count: 1')).toBeInTheDocument()
  })
})
```

### Mock and Spy on Actions

```ts
describe('TodoList', () => {
  beforeEach(() => {
    mockSlice.beforeEach()
  })

  it('should toggle todos', () => {
    const { toggleTodo } = mockSlice(todosSlice, {
      state: [{ id: 0, name: '🧪 Write unit tests', done: false }]
    })

    render(<App />)

    const todoToggle = screen.getByRole('checkbox')
    fireEvent.click(todoToggle)
    expect(toggleTodo).toHaveBeenCalled()
  })
})
```

**Note:** Calling `beforeEach(() => { mockSlice.beforeEach() })` is required to ensure test cases run in isolation.
