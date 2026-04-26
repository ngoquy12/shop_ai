export interface ManualDepositRequest {
  amount: number;
  method: string;
  note?: string;
  proofImages: string[];
}

export interface DepositRequest {
  id: string;
  userId: string;
  amount: number;
  type: "AUTO" | "MANUAL";
  status:
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELLED"
    | "APPROVED"
    | "REJECTED"
    | "PROCESSING";
  method?: string;
  note?: string;
  proofImages?: string;
  actualAmount?: number;
  adminNote?: string;
  processedBy?: string;
  processedAt?: string;
  transferCode?: string;
  bankCode?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
  comments?: DepositComment[];
  history?: DepositHistory[];
}

export interface DepositComment {
  id: string;
  depositRequestId: string;
  userId: string;
  isAdmin: boolean;
  content: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface DepositHistory {
  id: string;
  depositRequestId: string;
  fromStatus: string;
  toStatus: string;
  note?: string;
  changedBy: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
