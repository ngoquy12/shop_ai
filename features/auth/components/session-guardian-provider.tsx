"use client";

import { useSessionGuardian } from "../hooks/use-session-guardian";

/**
 * Component trống gắn ở cấp cao (App Layout) 
 * để luôn luôn lắng nghe event bị kick từ server mượt mà.
 */
export function SessionGuardianProvider({ children }: { children: React.ReactNode }) {
  useSessionGuardian();
  return <>{children}</>;
}
