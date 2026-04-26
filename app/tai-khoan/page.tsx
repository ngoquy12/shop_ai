"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, CheckCircle2, Edit2, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import { getRoleLabel } from "@/lib/enums/role.enum";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginHistory } from "@/features/profile/components/login-history";
import { WalletHistory } from "@/features/wallets/components/WalletHistory";
import { WalletOverview } from "@/features/wallets/components/WalletOverview";
import { ManualDepositModal } from "@/features/wallets/components/ManualDepositModal";
import { PendingDeposits } from "@/features/wallets/components/PendingDeposits";
import { DepositHistory } from "@/features/wallets/components/DepositHistory";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "@/features/auth/hooks/use-profile";

function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {multiline ? (
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="w-full text-sm rounded-xl border border-border/60 bg-background px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                className="h-10 rounded-xl border-border/60 bg-background"
              />
            )}
          </motion.div>
        ) : (
          <motion.p
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-foreground py-2.5 px-3 rounded-xl bg-muted/40 border border-border/30 min-h-[40px]"
          >
            {value || (
              <span className="text-muted-foreground italic">
                Chưa cập nhật
              </span>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isManualDepositModalOpen, setIsManualDepositModalOpen] =
    useState(false);

  const defaultTab = searchParams.get("tab") || "info";

  const handleEdit = () => {
    setDraft({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      bio: user?.bio || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: user?.gender || "OTHER",
    });
    setEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(draft, {
      onSuccess: () => {
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const update = (key: string) => (v: string) =>
    setDraft((d: Record<string, string>) => ({ ...d, [key]: v }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatarMutation.mutate(e.target.files[0], {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-11 w-32 bg-muted/40 rounded-lg" />
          <div className="h-11 w-40 bg-muted/40 rounded-lg" />
        </div>
        <div className="rounded-2xl border border-border/30 bg-card p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-muted/40 shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-6 w-48 bg-muted/40 rounded" />
              <div className="h-4 w-32 bg-muted/40 rounded" />
              <div className="h-3 w-40 bg-muted/40 rounded mt-1" />
            </div>
            <div className="w-28 h-9 rounded-xl bg-muted/40" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/30 bg-card p-6 space-y-5">
          <div className="h-5 w-40 bg-muted/40 rounded" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted/40 rounded" />
                <div className="h-10 w-full bg-muted/40 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-32 bg-muted/40 rounded" />
            <div className="h-20 w-full bg-muted/40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Không thể tải thông tin cá nhân.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-24 right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-500 text-sm font-medium shadow-lg backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Thông tin đã được cập nhật thành công!
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="bg-muted/50 p-1 h-11">
            <TabsTrigger
              value="info"
              className="px-5 rounded-lg h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Hồ sơ của tôi
            </TabsTrigger>
            <TabsTrigger
              value="deposit"
              className="px-5 rounded-lg h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Nạp tiền
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="px-5 rounded-lg h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Ví & Thanh toán
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-5 rounded-lg h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Lịch sử hoạt động
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="deposit" className="space-y-6 mt-4">
          {/* Wallet Overview */}
          <WalletOverview />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              size={"default"}
              onClick={() => setIsManualDepositModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nạp tiền thủ công
            </Button>
          </div>

          {/* Pending Deposits */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-bold mb-4 text-base">
              Yêu cầu nạp tiền đang chờ
            </h3>
            <PendingDeposits />
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-bold mb-4 text-base">
              Lịch sử yêu cầu nạp tiền
            </h3>
            <DepositHistory />
          </div>

          {/* 
          {/* Manual Deposit Modal */}
          <ManualDepositModal
            isOpen={isManualDepositModalOpen}
            onClose={() => setIsManualDepositModalOpen(false)}
          />
        </TabsContent>

        <TabsContent value="info" className="space-y-6 mt-4">
          {/* Avatar card */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-5">
              <div className="relative group overflow-hidden w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-500/20">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-white font-extrabold text-2xl">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadAvatarMutation.isPending}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tham gia từ{" "}
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MM/yyyy")
                    : "Chưa cập nhật"}{" "}
                  · {getRoleLabel(user.role)}
                </p>
              </div>
              {!editing ? (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="gap-2 rounded-xl h-9"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl h-9"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Lưu
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="gap-2 rounded-xl h-9"
                  >
                    <X className="w-3.5 h-3.5" />
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Info form */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-bold mb-5 text-base">Thông tin cá nhân</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Họ và tên"
                value={editing ? draft.fullName : user.fullName}
                editing={editing}
                onChange={update("fullName")}
              />
              <Field
                label="Email"
                value={user.email}
                editing={false}
                onChange={() => {}}
                type="email"
              />
              <Field
                label="Số điện thoại"
                value={editing ? draft.phoneNumber : user.phoneNumber || ""}
                editing={editing}
                onChange={update("phoneNumber")}
                type="tel"
              />
              <Field
                label="Ngày sinh"
                value={
                  editing
                    ? draft.dateOfBirth
                    : user.dateOfBirth
                      ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
                      : ""
                }
                editing={editing}
                onChange={update("dateOfBirth")}
                type="date"
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Giới tính
                </label>
                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <select
                        value={draft.gender}
                        onChange={(e) => update("gender")(e.target.value)}
                        className="w-full h-10 rounded-xl border border-border/60 bg-background px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-foreground py-2.5 px-3 rounded-xl bg-muted/40 border border-border/30 min-h-[40px]"
                    >
                      {user.gender === "MALE" ? (
                        "Nam"
                      ) : user.gender === "FEMALE" ? (
                        "Nữ"
                      ) : user.gender === "OTHER" ? (
                        "Khác"
                      ) : (
                        <span className="text-muted-foreground italic">
                          Chưa cập nhật
                        </span>
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Field
                label="Địa chỉ / Thành phố"
                value={editing ? draft.address : user.address || ""}
                editing={editing}
                onChange={update("address")}
              />
            </div>
            <div className="mt-4">
              <Field
                label="Giới thiệu bản thân"
                value={editing ? draft.bio : user.bio || ""}
                editing={editing}
                onChange={update("bio")}
                multiline
              />
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <h3 className="font-bold text-destructive mb-1.5">
              Vùng nguy hiểm
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Xóa tài khoản sẽ xóa toàn bộ dữ liệu vĩnh viễn và không thể khôi
              phục.
            </p>
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 rounded-xl h-9"
            >
              Xóa tài khoản
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <LoginHistory />
        </TabsContent>

        <TabsContent value="wallet" className="mt-4">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="font-bold mb-5 text-base">Lịch sử giao dịch ví</h3>
            <WalletHistory />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageContent />
    </Suspense>
  );
}
