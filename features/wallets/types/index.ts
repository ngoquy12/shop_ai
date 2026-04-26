export interface BalanceResponse {
  success: boolean;
  balance: number;
}

export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  depositId: string;
  amount: number;
  transferCode: string;
  qrUrl: string;
  bankId: string;
  accountNo: string;
  accountName: string;
  message: string;
}

export interface WalletTransactionResponse {
  id: string;
  type: 'DEPOSIT' | 'PAYMENT' | 'REFUND';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}
