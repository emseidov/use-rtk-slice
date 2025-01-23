import { assoc } from '../../utils'
import type {
  Config,
  MockSlice,
  MockValues,
  MockSliceReturn
} from './createMockSlice.types'

export function createMockSlice(config: Config) {
  const implementations: Record<string, Record<string, any>> = {}

  function mockSlice<T extends MockSlice>(
    mockedSlice: T,
    mockValues: Partial<MockValues<T>> = {}
  ): MockSliceReturn<T> {
    const isSliceMocked = Boolean(implementations[mockedSlice.name])

    if (isSliceMocked) {
      throw new Error(`
        ${mockSlice.name} is already mocked. Don't forget to call beforeEach():

        beforeEach(() => {
          mockSlice.beforeEach()
        })`)
    }

    const actions = Object.keys(mockedSlice.actions).reduce(
      (accumulator, key) => assoc(accumulator, key, config.createSpy()),
      {} as MockSliceReturn<T>
    )
    const { state, ...selectors } = mockValues

    implementations[mockedSlice.name] = [state, actions, selectors]

    return actions
  }

  function reset() {
    Object.keys(implementations).forEach((key) => {
      delete implementations[key]
    })
  }

  function beforeEach() {
    reset()
  }

  config.mockImplementation(implementations)
  mockSlice.beforeEach = beforeEach

  return mockSlice
}
