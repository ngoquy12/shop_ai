"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated || !user) {
        router.push("/dang-nhap");
      } else if (!allowedRoles.includes(user.role)) {
        router.push("/?error=access_denied");
      }
    }
  }, [isClient, isAuthenticated, user, allowedRoles, router]);

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Đang tải dữ liệu, vui lòng đợi...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return null;
}
