"use client";

import { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  userInitials?: string;
  userPlan?: string;
}

export function LogoutModal({
  open,
  onClose,
  onConfirm,
  userName = "Người dùng",
  userInitials = "U",
  userPlan = "Free",
}: LogoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Standard portal mount check — runs once after hydration, safe with [] deps
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onConfirm();
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-9999 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="relative"
                >
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <LogOut className="w-7 h-7 text-red-400" />
                  </div>
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-extrabold mb-2">
                  Xác nhận đăng xuất
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                </p>
              </div>

              {/* User info card */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 border border-border/50 mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shrink-0">
                  <span className="text-white font-extrabold text-sm">
                    {userInitials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    Đang đăng nhập với gói {userPlan}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl border-border/60 font-semibold hover:bg-accent"
                >
                  Hủy bỏ
                </Button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={loading}
                  className={cn(
                    "flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                    "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20",
                    loading && "opacity-80 cursor-not-allowed",
                  )}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </>
                  )}
                </motion.button>
              </div>

              {/* Note */}
              <p className="text-center text-xs text-muted-foreground mt-4">
                Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng dịch vụ.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body, // ← key fix: render outside header's stacking context
  );
}
