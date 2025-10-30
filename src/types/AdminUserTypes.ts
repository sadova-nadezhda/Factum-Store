export type OkResponse = {
  status: 'ok' | 'error' | string;
  message?: string;
};

export interface AdminUser {
  id: number | string;
  email: string;
  username?: string;
  full_name?: string;
  role?: 'user' | 'admin' | 'moderator' | string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface GetUsersParams {
  q?: string;
  page?: number;
  per_page?: number;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  [key: string]: any;
}