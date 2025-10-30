export type User = {
  id: number;
  email: string;
  full_name: string;
  avatar?: string;
  role: string;
  status: string;
};

export type LoginDto = { email: string; password: string };
export type AuthResponse = { token: string };
export type UpdateMeDto = { full_name?: string; password?: string };

export type RegisterDto = { email: string; password: string; full_name?: string };
export type RegisterResponse = { status: 'ok'; message: string };

export type ForgotDto = { email: string };
export type ForgotResponse = { status: 'ok' } | { status: 'ok'; message?: string };

export type ResetDto = { token: string; password: string };
export type ResetResponse = { status: 'ok' };
