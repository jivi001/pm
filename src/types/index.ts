export interface User {
  id: string;
  name: string;
  email: string;
  aadhaar?: string; // Only for candidates
  companyRegistration?: string; // Only for admins/companies
  role: 'candidate' | 'admin';
  skills: string[];
  location: string;
  phone: string;
  companyName?: string; // Only for admins
  password: string; // Encrypted password
}

export interface LoginRequest {
  identifier: string; // Aadhaar or Company Registration
  password: string;
  loginType: 'candidate' | 'admin';
  otp?: string; // Optional OTP for enhanced security
}

export interface RegisterRequest {
  name: string;
  email: string;
  aadhaar?: string;
  companyRegistration?: string;
  companyName?: string;
  role: 'candidate' | 'admin';
  skills: string[];
  location: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  sector: string;
  location: string;
  duration: string;
  stipend: number;
  skillsRequired: string[];
  description: string;
  status: 'open' | 'closed';
  postedDate: string;
  deadline: string;
}

export interface Application {
  id: string;
  internshipId: string;
  candidateId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  internship: Internship;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'application' | 'status' | 'reminder';
  isRead: boolean;
  createdAt: string;
}

export type Language = 'en' | 'hi' | 'ta';

export interface LanguageContent {
  [key: string]: {
    en: string;
    hi: string;
    ta: string;
  };
}