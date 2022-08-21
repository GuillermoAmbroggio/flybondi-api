export interface UsersAttributes {
  email: string;
  role: 'client' | 'admin' | 'developer';
  name: string;
  lastname: string;
  password: string;
  phone?: string;
  country?: string;
  birthdate?: string;
  [key: string]: string | undefined;
}

export interface AdminAttributes {
  email: string;
  role: 'client' | 'admin' | 'developer';
  name: string;
  lastname: string;
  password: string;
  phone?: string;
  country?: string;
  birthdate?: string;
  secretKey: string;
  [key: string]: string | undefined;
}

export interface UsersRegister extends UsersAttributes {
  confirm_password: string;
}
