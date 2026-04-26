import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Bảng Role Mapping removed as it's not needed anymore
// Các route cần Auth
const protectedRoutes = [
  "/library",
  "/dashboard",
  "/tai-khoan",
  "/don-hang",
  "/yeu-thich",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra access token hoặc refresh token từ Cookie
  const hasAccessToken = request.cookies.has("accessToken");
  const hasRefreshToken = request.cookies.has("refreshToken");

  const isAuthenticated = hasAccessToken || hasRefreshToken;

  // 1. Chặn người dùng chưa đăng nhập vào các trang cần Auth
  const isProtectedRoute = protectedRoutes.some((p) => pathname.startsWith(p));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/dang-nhap", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(pathname)); // Chuyển về đúng link sau logic
    return NextResponse.redirect(loginUrl);
  }

  // 3. Nếu đã đăng nhập mà vẫn vào /login thì đẩy sang /dashboard hoặc trang chủ
  if (isAuthenticated && (pathname === "/dang-nhap" || pathname === "/dang-ky")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Chạy proxy trên các routes (trừ api, _next, static files...)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
