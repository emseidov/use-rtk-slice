import * as useSlice from '../../useSlice'
import { createMockSlice } from '../createMockSlice'

const jestConfig = {
  createSpy: () => jest.fn(),
  mockImplementation: (implementations: any) =>
    jest
      .spyOn(useSlice, 'useSlice')
      .mockImplementation((slice) => implementations[slice.name])
}

export const mockSlice = createMockSlice(jestConfig)
