 export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor';
  photo?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
}
