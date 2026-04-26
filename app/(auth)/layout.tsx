import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Tài khoản | VideoPrompt",
    template: "%s | VideoPrompt",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Page content */}
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}
