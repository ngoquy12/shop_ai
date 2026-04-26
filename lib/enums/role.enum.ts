export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
}

export const getRoleLabel = (role?: string | null): string => {
  switch (role) {
    case UserRole.ADMIN: return "Quản trị viên";
    case UserRole.CUSTOMER: return "Thành viên";
    case UserRole.STAFF: return "Nhân viên";
    default: return role || "Không xác định";
  }
};
