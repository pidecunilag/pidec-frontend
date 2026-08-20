export interface FinaleRegistrationConfirmation {
  id: string;
  registrationNumber: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface FinaleRegistration {
  id: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  admittedAt: string | null;
  admittedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinaleRegistrationStats {
  total: number;
  admitted: number;
  awaiting: number;
}

export interface FinaleRegistrationsResponse {
  registrations: FinaleRegistration[];
  stats: FinaleRegistrationStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FinaleRegistrationRequest {
  fullName: string;
  email: string;
  phone: string;
}

export interface FinaleRegistrationsParams {
  q?: string;
  status?: 'all' | 'admitted' | 'awaiting';
  page?: number;
  limit?: number;
}
