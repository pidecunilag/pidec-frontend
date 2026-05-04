export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
  deletedAt?: string;
}
