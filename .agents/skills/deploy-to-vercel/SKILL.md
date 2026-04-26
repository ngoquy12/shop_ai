---
name: nextjs-react-architecture
description: >
  Phân tích kiến trúc FE và các quy định cho ứng dụng Shop AI Frontend.
  Dùng Next.js 14/15 App Router, Tailwind, Zustand, React Query và FSD pattern.
metadata:
  author: shop_ai-team
  version: "1.0.0"
  tags: [nextjs, frontend, react-query, zustand, tailwind]
---

# Skill: Shop AI Frontend Architecture

## Phần 1. Tổng quan Kiến trúc Frontend (Senior Review)

Dự án Shop AI Frontend hiện tại đang sử dụng một bộ xương kiến trúc rất chắc chắn, kết hợp **App Router (Next.js)** với mô hình **Feature-Sliced Design (FSD)** - phân lô từng module chức năng một cách dễ theo dõi và tái cấu trúc.

### 1.1 Tech Stack Cốt Lõi Dự Án
- **Framework Chính**: Next.js 14/15 sử dụng cấu trúc App Router với tư duy chia Component (Phân định Server vs Client component).
- **Styling**: Tailwind CSS với tiêu chuẩn Dark Mode cực tốt (next-themes).
- **UI System**: Cụm Shadcn UI (`components/ui`) phối hợp cùng thư viện hoạt ảnh đỉnh cao `framer-motion` / `tw-animate-css`. Giao diện có tính **Premium**, thẩm mỹ cực nhạy và WOW.
- **Quản lý Dữ liệu Toàn cục**: 
  - `Zustand` (`store/` chứa tại các tính năng cụ thể) dùng cho trạng thái UI tĩnh.
  - `@tanstack/react-query`: Trái tim phía máy khách đảm nhận Caching, Data Syncing và đồng bộ hóa siêu tốc các request HTTP.
- **Validation**: Thống nhất dùng `react-hook-form` gắn kết với `zod` schema-based.
- **Kết nối Network**: Trình điều khiển HTTP Client dựa trên `axios` (`api-client.ts`) và `socket.io-client` để đồng bộ thời gian thực.

### 1.2 Cấu trúc Code Hiện Tại (Folder Map)

```text
src/ (hoặc mức dự án root Frontend)
├── app/                  # Nơi tập trung Routing Next.js App Router (Các trang như /cart, /checkout, /orders...)
│   ├── (auth)/           # Nhóm logic view bảo mật login/đăng ký
│   ├── admin/            # Phân quyền admin panel
│   └── layout.tsx        # Chứa context providers bao trùm (QueryProvider, ThemeProvider)
│
├── features/             # Khối Business Logic Độc Lập cho Từng Tính Năng
│   └── auth/             # (VD cho tính năng Auth)
│       ├── api/          # Nơi khai báo Axios caller function
│       ├── components/   # UI view riêng của Auth
│       ├── hooks/        # React Query custom hooks
│       └── store/        # Zustand global states (nếu cần quản lý riêng module Auth)
│
├── components/           # Toàn bộ Shared Components
│   ├── ui/               # Kho Atomic UI dựng bởi Shadcn (button, toast, dialog...)
│   └── [pages/blocks]    # Những thẻ logic Block siêu bự (navbar.tsx, home-page.tsx, course-detail-page.tsx...)
│
├── lib/                  # Shared Utils
│   ├── api-client.ts     # Wrapper trung trạm Axios điều tiết Tokens/Refresh/Cookies
│   ├── firebase.ts       # Service cầu nối Firebase API (Google Auth)
│   └── utils.ts          # Thư viện hàm linh tinh (cn merger, currency formater...)
```

---

## Phần 2. Các Quy định Viết Code Khắt Khe (Senior Rules)

### 2.1 Fetching Dữ liệu (Network)
- **TỐI KỴ việc chèn Axios trực tiếp vào Component**. Mọi HTTP Requests PHẢI nằm gọn trong `api/` (VD: `d:\Workspace\shop_ai\Frontend\lib\data.ts`, `prompt-data.ts`).
- Dữ liệu gọi về sẽ được bọc vào Custom Hook (sử dụng `useQuery` / `useMutation`) trong thư viện cục bộ hoặc thư mục `hooks/`. Component chỉ cần biết 3 thứ từ Hook: `isLoading`, `data`, và `error`.

### 2.2 Đặt Tên & Cấu Trúc File
- Thư mục tuân theo **kebab-case** toàn mạch (VD: `ai-tools`, `components`).
- File đuôi là `.tsx`/`.ts` dạng **kebab-case** có kèm hậu tố làm rõ nhiệm vụ (VD: `checkout-page.tsx`, `use-debounce.ts`, `auth.store.ts`).
- Export Component/Interfaces mang chuẩn **PascalCase** (`ShoppingCart`, `OrderType`). Export functions là **camelCase**.
- Loại bỏ tuyệt đối kiểu biến `any` bằng khả năng suy luận type của TypeScript hoặc bằng các Data Type Definition chặt chẽ trong `types/`.

### 2.3 Style & UX Tương Tác
- KHÔNG viết CSS thuần hoặc mix Styles object inline. 
- Mọi thiết kế phải dựa vào Classes của Tailwind thông qua thư viện merge `cn()` (từ `clsx` + `tailwind-merge`).
- Yêu cầu mọi component giao diện mang nhãn "Premium": Phải có hiệu ứng thị giác tối tân, hover interactions, transition siêu mượt nhờ `framer-motion`.

### 2.4 Quản trị Khối Dữ Liệu UI State
- Luôn ưu tiên thiết kế state tại khu vực nhỏ (Atomic - via `useState`) để tránh re-render phung phí toàn bộ cây DOM.
- Tận dụng `React Query` gánh hoàn toàn khối lượng dữ liệu Sever-State (Dữ liệu trả về từ DB).
- Chức năng liên đới diện rộng xuyên App Router (Ví dụ: Drawer đóng mở từ Header đến Footer, Trạng thái User Authentication, Hệ thống Notification nội bộ) -> Chuyển sang sử dụng `Zustand store`.
