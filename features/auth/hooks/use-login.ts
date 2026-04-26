import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginFn, firebaseLoginFn } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import Cookies from 'js-cookie';
import { AuthResponse } from '../types';

export const useLogin = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data: AuthResponse) => {
      const user = data.user;
      const tokens = data.tokens;

      setCredentials(user);
      Cookies.set('accessToken', tokens.accessToken, { expires: 1/96 }); // 15 phút
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 }); // 7 ngày
      if (tokens.sessionId) {
        Cookies.set('sessionId', tokens.sessionId, { expires: 7 });
      }
      queryClient.setQueryData(["user-profile"], user);
    },
    onError: (error) => {
      console.error('Login Error:', error);
    }
  });
};

export const useFirebaseLogin = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: firebaseLoginFn,
    onSuccess: (data: AuthResponse) => {
      const user = data.user;
      const tokens = data.tokens;

      setCredentials(user);
      Cookies.set('accessToken', tokens.accessToken, { expires: 1/96 }); 
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 }); 
      if (tokens.sessionId) {
        Cookies.set('sessionId', tokens.sessionId, { expires: 7 });
      }
      queryClient.setQueryData(["user-profile"], user);
    },
    onError: (error) => {
      console.error('Firebase Login Error:', error);
    }
  });
};
