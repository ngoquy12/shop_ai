"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyDepositRequests } from "../hooks/use-manual-deposits";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { DepositRequest } from "../types/manual-deposit.types";

const statusConfig = {
  PENDING: {
    label: "Chờ duyệt",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  APPROVED: {
    label: "Đã duyệt",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
  REJECTED: {
    label: "Đã từ chối",
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
};

export function DepositHistory() {
  const { data, isLoading } = useMyDepositRequests();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.data || data?.data?.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Chưa có yêu cầu nạp tiền nào
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data?.data?.map((request: DepositRequest) => {
        const config =
          statusConfig[request.status as keyof typeof statusConfig] ||
          statusConfig.PENDING;
        const StatusIcon = config.icon;

        return (
          <Card key={request.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {request.amount.toLocaleString("vi-VN")}đ
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(request.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <Badge className={config.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {request.method && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-medium">{request.method}</span>
                </div>
              )}
              {request.note && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ghi chú:</span>
                  <span className="font-medium">{request.note}</span>
                </div>
              )}
              {request.actualAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Số tiền thực nhận:
                  </span>
                  <span className="font-medium text-green-600">
                    {request.actualAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              {request.adminNote && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ghi chú admin:</span>
                  <span className="font-medium">{request.adminNote}</span>
                </div>
              )}
              {request.proofImages && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Ảnh chứng từ:
                  </p>
                  <div className="flex gap-2">
                    {request.proofImages &&
                      (typeof request.proofImages === "string"
                        ? JSON.parse(request.proofImages)
                        : request.proofImages
                      )?.map((img: string, idx: number) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Proof ${idx}`}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => window.open(img, "_blank")}
                        />
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
