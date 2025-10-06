export type AdminUser = {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'hr' | 'admin';
  status: 'pending' | 'active' | 'blocked';
  created_at: string;
};

export type GetUsersParams = {
  q?: string;
  page?: number; 
  per_page?: number; 
};

export type UpdateUserDto = Partial<Pick<AdminUser, 'email' | 'full_name' | 'role' | 'status'>>;

export type OkResponse = { status: 'ok' };
