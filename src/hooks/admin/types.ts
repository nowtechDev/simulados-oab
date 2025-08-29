
// Define types for admin functionality

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  type_user: number | null;
  company_id: string | null;
  institution_id: string | null;
  disabled: boolean | null;
  created_at: string;
}

export interface Institution {
  id: string;
  nome: string;
  usuarios: number;
  plano: string | null;
  admin_email: string | null;
  created_at: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  user: any | null;
  role?: string;
  isAdmin?: boolean;
}

export interface UserStats {
  total: number;
  newLastMonth: number;
}
