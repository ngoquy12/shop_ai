import { useMutation } from '@tanstack/react-query';
import { registerFn } from '../api/auth.api';

export const useRegister = () => {
  return useMutation({
    mutationFn: registerFn,
    onError: (error) => {
      console.error('Register Error:', error);
    }
  });
};
