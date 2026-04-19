import { useQuery } from '@tanstack/react-query';
import { blockchainApi } from '../api/blockchain.api';
import type { PaginationParams } from '../../../types';

export const blockchainKeys = {
  all: ['blockchain'] as const,
  networkStatus: () => [...blockchainKeys.all, 'status'] as const,
  transactions: () => [...blockchainKeys.all, 'transactions'] as const,
  transactionList: (params: PaginationParams) => [...blockchainKeys.transactions(), params] as const,
  transactionDetail: (hash: string) => [...blockchainKeys.all, 'tx', hash] as const,
  contracts: () => [...blockchainKeys.all, 'contracts'] as const,
};

export function useBlockchainNetworkStatus() {
  return useQuery({
    queryKey: blockchainKeys.networkStatus(),
    queryFn: () => blockchainApi.getNetworkStatus(),
    refetchInterval: 15000, // Real-time updates
  });
}

export function useBlockchainTransactions(params: PaginationParams = {}) {
  return useQuery({
    queryKey: blockchainKeys.transactionList(params),
    queryFn: () => blockchainApi.getTransactions(params),
  });
}

export function useBlockchainTransaction(hash: string) {
  return useQuery({
    queryKey: blockchainKeys.transactionDetail(hash),
    queryFn: () => blockchainApi.getTransactionByHash(hash),
    enabled: !!hash,
  });
}

export function useSmartContracts() {
  return useQuery({
    queryKey: blockchainKeys.contracts(),
    queryFn: () => blockchainApi.getSmartContracts(),
  });
}
