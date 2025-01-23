import { vi } from 'vitest'
import * as useSlice from '../../useSlice'
import { createMockSlice } from '../createMockSlice'

export const vitestConfig = {
  createSpy: () => vi.fn(),
  mockImplementation: (implementations: any) =>
    vi
      .spyOn(useSlice, 'useSlice')
      .mockImplementation((slice) => implementations[slice.name])
}

export const mockSlice = createMockSlice(vitestConfig)
