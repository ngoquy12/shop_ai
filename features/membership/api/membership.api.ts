import { apiClient } from '@/lib/api-client';

export interface UpgradeResponse {
  success: boolean;
  message: string;
  isPremium: boolean;
  premiumExpiresAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  code: string;
  type: "FREE" | "PREMIUM";
  description?: string;
  price: number;
  duration: number;
  features: string[];
}

export const membershipApi = {
  getPlans: async () => {
    const response = await apiClient.get<MembershipPlan[]>("/membership-plans");
    return response.data;
  },
  upgrade: async () => {
    const response = await apiClient.post<UpgradeResponse>("/pricing/upgrade");
    return response.data;
  },
};
