import { vi } from 'vitest'
import { useSliceRef } from '../../useSlice'
import { createMockSlice } from '../createMockSlice'

export const vitestConfig = {
  createSpy: () => vi.fn(),
  mockImplementation: (implementations: any) =>
    vi
      .spyOn(useSliceRef, 'useSlice')
      .mockImplementation((slice) => implementations[slice.name])
}

export const mockSlice = createMockSlice(vitestConfig)
