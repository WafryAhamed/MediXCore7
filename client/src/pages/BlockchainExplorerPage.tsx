import React, { useState, useMemo } from 'react';
import { Blocks, Server, FileCode } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';

import { Skeleton } from '../components/ui/Skeleton';
import {
  useBlockchainNetworkStatus, useBlockchainTransactions, useSmartContracts,
} from '../features/blockchain/hooks/useBlockchain';
import type { BlockchainTransaction, BlockchainNetworkStatus, SmartContractStatus, PaginationParams } from '../types';


export const BlockchainExplorerPage: React.FC = () => {
  const { data: netData, isLoading: netLoading } = useBlockchainNetworkStatus();
  const { data: contractsData } = useSmartContracts();
  const [params, setParams] = useState<PaginationParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');
  const { data: txData, isLoading: txLoading } = useBlockchainTransactions(params);

  const network = (netData as unknown as { data: BlockchainNetworkStatus })?.data;
  const contracts = (contractsData as unknown as { data: SmartContractStatus[] })?.data ?? [];

  const columns = useMemo<ColumnDef<BlockchainTransaction, unknown>[]>(() => [
    {
      accessorKey: 'txHash', header: 'Tx Hash',
      cell: ({ getValue }) => <span className="font-mono text-xs text-primary truncate max-w-[120px] block">{getValue() as string}</span>,
    },
    { accessorKey: 'blockNumber', header: 'Block' },
    {
      accessorKey: 'from', header: 'From',
      cell: ({ getValue }) => <span className="font-mono text-xs truncate max-w-[100px] block">{getValue() as string}</span>,
    },
    {
      accessorKey: 'to', header: 'To',
      cell: ({ getValue }) => <span className="font-mono text-xs truncate max-w-[100px] block">{getValue() as string}</span>,
    },
    {
      accessorKey: 'type', header: 'Type',
      cell: ({ getValue }) => {
        const colors: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
          PATIENT_RECORD: 'info', CONSENT: 'success', PRESCRIPTION: 'warning', DATA_HASH: 'default', AUDIT: 'danger',
        };
        const t = getValue() as string;
        return <Badge variant={colors[t] || 'default'} size="sm">{t.replace('_', ' ')}</Badge>;
      },
    },
    {
      accessorKey: 'timestamp', header: 'Timestamp',
      cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM dd, HH:mm:ss'),
    },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blockchain Explorer"
        subtitle="Hyperledger Besu Network Monitor"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin' }, { label: 'Blockchain' }]}
      />

      {/* Network Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {netLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton.Card key={i} />)
        ) : (
          [
            { label: 'Connected Nodes', value: network?.connectedNodes ?? 0, icon: <Server className="h-5 w-5 text-emerald-400" /> },
            { label: 'Block Height', value: (network?.blockHeight ?? 0).toLocaleString(), icon: <Blocks className="h-5 w-5 text-blue-400" /> },
            { label: 'Network ID', value: network?.networkId ?? '—', icon: <FileCode className="h-5 w-5 text-amber-400" /> },
            { label: 'Consensus', value: network?.consensus ?? 'IBFT 2.0', icon: <Blocks className="h-5 w-5 text-violet-400" /> },
          ].map((item) => (
            <Card key={item.label} hover>
              <CardBody className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">{item.icon}</div>
                <div>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-lg font-bold text-white">{item.value}</p>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Smart Contracts */}
      <Card>
        <CardHeader title="Smart Contracts" subtitle="Deployed contract status" />
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Contract</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.name} className="border-b border-slate-700/30">
                  <td className="px-4 py-2.5 text-slate-200 font-medium">{c.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{c.address}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'} size="sm" dot>{c.status}</Badge>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">No contracts deployed</td></tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader title="Recent Transactions" />
        <CardBody>
          <DataTable
            columns={columns}
            data={txData?.data?.content ?? []}
            loading={txLoading}
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setParams(p => ({ ...p, page: 0 })); }}
            searchPlaceholder="Search by tx hash, patient ID, block #..."
            page={txData?.data?.number ?? 0}
            size={txData?.data?.size ?? 10}
            totalElements={txData?.data?.totalElements ?? 0}
            totalPages={txData?.data?.totalPages ?? 1}
            onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))}
            onSizeChange={(s) => setParams(prev => ({ ...prev, size: s, page: 0 }))}
          />
        </CardBody>
      </Card>
    </div>
  );
};
