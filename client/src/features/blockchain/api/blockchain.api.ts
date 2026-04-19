import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse,
  BlockchainTransaction, BlockchainNetworkStatus,
  SmartContractStatus, PaginationParams,
} from '../../../types';

export const blockchainApi = {
  getNetworkStatus: () =>
    apiClient.get<ApiResponse<BlockchainNetworkStatus>>(`${API_URLS.BLOCKCHAIN}/status`) as unknown as Promise<ApiResponse<BlockchainNetworkStatus>>,

  getTransactions: (params: PaginationParams = {}) =>
    apiClient.get<PaginatedResponse<BlockchainTransaction>>(`${API_URLS.BLOCKCHAIN}/transactions`, { params }) as unknown as Promise<PaginatedResponse<BlockchainTransaction>>,

  getTransactionByHash: (hash: string) =>
    apiClient.get<ApiResponse<BlockchainTransaction>>(`${API_URLS.BLOCKCHAIN}/transactions/${hash}`) as unknown as Promise<ApiResponse<BlockchainTransaction>>,

  getSmartContracts: () =>
    apiClient.get<ApiResponse<SmartContractStatus[]>>(`${API_URLS.BLOCKCHAIN}/contracts`) as unknown as Promise<ApiResponse<SmartContractStatus[]>>,

  verifyDataIntegrity: (resourceType: string, resourceId: string) =>
    apiClient.get<ApiResponse<{ verified: boolean; hash: string }>>(`${API_URLS.BLOCKCHAIN}/verify`, {
      params: { resourceType, resourceId },
    }) as unknown as Promise<ApiResponse<{ verified: boolean; hash: string }>>,

  searchTransactions: (query: string) =>
    apiClient.get<ApiResponse<BlockchainTransaction[]>>(`${API_URLS.BLOCKCHAIN}/transactions/search`, {
      params: { q: query },
    }) as unknown as Promise<ApiResponse<BlockchainTransaction[]>>,
};
