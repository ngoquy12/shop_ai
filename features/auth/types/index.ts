import { UserRole } from '@/lib/enums/role.enum';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  address?: string | null;
  bio?: string | null;
  isEmailVerified: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  sessionId?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface BaseApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatarUrl?: string;
  address?: string;
  bio?: string;
}
