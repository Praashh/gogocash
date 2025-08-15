import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest'
import { getAllData } from '../src/actions/shopeextra/getAll'
import axios from 'axios'
import { productDataResponseSchema } from '@/../zod/involve-asia'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

const originalEnv = process.env

describe('getAllData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SHOPEEXTRA_PREFIX: 'https://api.example.com',
      INVOLVE_ASIA_API_TOKEN: 'test-token'
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return success response with data when API call succeeds', async () => {
    const mockApiResponse = {
      status: 'success',
      message: 'Data retrieved successfully',
      data: {
        page: 1,
        limit: 10,
        count: 1,
        nextPage: 2,
        data: [
          {
            shop_id: 123,
            shop_name: 'Test Shop',
            shop_type: 'retail',
            shop_link: 'https://testshop.com',
            shop_image: 'https://testshop.com/image.jpg',
            shop_banner: ['https://testshop.com/banner1.jpg'],
            offer_name: 'Test Offer',
            country: 'US',
            period_start_time: '2024-01-01T00:00:00Z',
            period_end_time: '2024-12-31T23:59:59Z',
            commission_rate: '5%',
            tracking_link: 'https://tracking.com/link'
          }
        ]
      }
    }

    mockedAxios.post.mockResolvedValueOnce({ data: mockApiResponse })

    const result = await getAllData()

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.com/all',
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    )

    expect(result).toEqual({
      status: 'success',
      message: 'Data fetched successfully',
      data: mockApiResponse.data
    })
  })

  it('should return failed response when API call throws an error', async () => {
    const mockError = new Error('Network error')
    mockedAxios.post.mockRejectedValueOnce(mockError)

    const result = await getAllData()

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.com/all',
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    )

    expect(result).toEqual({
      status: 'failed',
      message: 'Failed to fetch data',
      data: []
    })
  })

  it('should return failed response when API returns invalid data structure', async () => {
    const invalidApiResponse = {
      status: 'success',
      message: 'Data retrieved successfully',
      data: {
        page: 1,
        limit: 10
      }
    }

    mockedAxios.post.mockResolvedValueOnce({ data: invalidApiResponse })

    const result = await getAllData()

    expect(result).toEqual({
      status: 'failed',
      message: 'Failed to fetch data',
      data: []
    })
  })

  it('should handle axios errors with different error types', async () => {
    const testCases = [
      { error: new Error('Network timeout'), description: 'network timeout' },
      { error: { response: { status: 401, data: 'Unauthorized' } }, description: '401 unauthorized' },
      { error: { response: { status: 500, data: 'Internal server error' } }, description: '500 server error' }
    ]

    for (const testCase of testCases) {
      mockedAxios.post.mockRejectedValueOnce(testCase.error)

      const result = await getAllData()

      expect(result).toEqual({
        status: 'failed',
        message: 'Failed to fetch data',
        data: []
      })
    }
  })

  it('should validate response data against zod schema', async () => {
    const validApiResponse = {
      status: 'success',
      message: 'Data retrieved successfully',
      data: {
        page: 1,
        limit: 10,
        count: 0,
        nextPage: 0,
        data: []
      }
    }

    mockedAxios.post.mockResolvedValueOnce({ data: validApiResponse })

    const result = await getAllData()

    expect(result.status).toBe('success')
    expect(result.data).toBeDefined()
    
    expect(() => productDataResponseSchema.parse(validApiResponse)).not.toThrow()
  })

  it('should handle empty data array in response', async () => {
    const emptyDataResponse = {
      status: 'success',
      message: 'No data found',
      data: {
        page: 1,
        limit: 10,
        count: 0,
        nextPage: 0,
        data: []
      }
    }

    mockedAxios.post.mockResolvedValueOnce({ data: emptyDataResponse })

    const result = await getAllData()

    expect(result).toEqual({
      status: 'success',
      message: 'Data fetched successfully',
      data: emptyDataResponse.data
    })
  })
})
