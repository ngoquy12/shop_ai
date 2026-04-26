import { apiClient } from '@/lib/api-client';
import { BalanceResponse, DepositRequest, DepositResponse, WalletTransactionResponse } from '../types';

export const getBalanceFn = async (): Promise<BalanceResponse> => {
  const res = await apiClient.get('/wallets/balance');
  return res.data;
};

export const createDepositFn = async (data: DepositRequest): Promise<DepositResponse> => {
  const res = await apiClient.post('/wallets/deposit', data);
  return res.data;
};

export const getTransactionsFn = async (): Promise<WalletTransactionResponse[]> => {
  const res = await apiClient.get('/wallets/transactions');
  return res.data.data;
};
