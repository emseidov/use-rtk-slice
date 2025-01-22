<div align="center">
  <h1>use-rtk-slice</h1>
  <p>A <a href="https://react.dev/">React</a> hook for working with <a href="https://redux-toolkit.js.org/">Redux Toolkit</a> slices, with zero setup and boilerplate ⚛️ 🛠️
  </p>
  <p>
    <a href="https://www.npmjs.com/package/use-rtk-slice"><img alt="npm" src="https://img.shields.io/npm/v/use-rtk-slice.svg"></a>
    <a href="https://www.npmjs.com/package/use-rtk-slice" target="_blank"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/use-rtk-slice.svg" /></a>
    <a href="https://github.com/Lambdaphile/use-rtk-slice/blob/main/src/useSlice.test.tsx"><img alt="Coverage" src="https://img.shields.io/badge/coverage-100%25-brightgreen"></a>
    <a href="https://www.typescriptlang.org/"><img alt="TypeScript Ready" src="https://img.shields.io/badge/TypeScript-Ready-blue.svg"></a>
  </p>
  <pre>npm i <a href="https://www.npmjs.com/package/use-rtk-slice">use-rtk-slice</a></pre>
</div>
<hr/>

Using Redux Toolkit slices with plain `useSelector` and `useDispatch` hooks requires:

1. Manually defining typed versions of `useSelector` and `useDispatch` in TypeScript projects - [Define `useAppSelector` and `useAppDispatch`](https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks).
2. Repeatedly writing `const dispatch = useDispatch()` just to dispatch an action.
3. Slice selectors are not bound - using them requires passing the relevant slice state, e.g., `selector({ stateName: state })`.

The `useSlice` hook from `use-rtk-slice` handles all of this: it binds actions and selectors internally, and returns fully typed, ready-to-use slice state, actions, and selectors.

## Usage

Define a RTK slice:

`todosSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    }
  },
  selectors: {
    selectCompleted: (state) => state.filter((todo) => todo.done)
  }
})
```

Destructure the `state`, and the bound `actions` and `selectors` from the slice as needed using, the `useSlice` hook:

`TodoList.tsx`

```tsx
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
              {name}
            </label>
          </li>
        ))}
      </ul>
      <p>
        <strong>Completed Todos:</strong> {selectors.selectCompleted().length}
      </p>
    </div>
  )
}
```
