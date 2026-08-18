export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed' | 'locked';
export type RegistrationStatus = 'pending_payment' | 'pending_verification' | 'confirmed' | 'rejected';
export type PaymentMethod = 'bkash' | 'rocket' | 'nagad';
export type PaymentType = 'manual' | 'direct';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type NotificationType = 'reminder' | 'registration_received' | 'payment_verified' | 'payment_rejected';
export type UserRole = 'player' | 'manager';

export interface Tournament {
  id: string;
  title: string;
  description: string;
  rules: string;
  entry_fee: number;
  prize_champion: number;
  prize_runnerup: number;
  prize_2nd_runnerup: number;
  refund_semifinal: number;
  max_players: number;
  start_time: string;
  registration_deadline: string;
  status: TournamentStatus;
  tournament_code?: string;
  banner_url?: string;
  bkash_number: string;
  nagad_number: string;
  rocket_number: string;
  created_by?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  registration_id: string;
  method: PaymentMethod;
  type: PaymentType;
  sender_number: string;
  transaction_id: string;
  amount: number;
  status: PaymentStatus;
  rejection_reason?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface Registration {
  id: string;
  user_id: string;
  tournament_id: string;
  gamer_tag: string;
  sender_number: string;
  status: RegistrationStatus;
  seed_number?: number;
  rejection_reason?: string;
  registered_at: string;
  user_name: string;
  user_email: string;
  payment?: Payment;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  sent_at: string;
  status: 'sent' | 'pending' | 'failed';
  read?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}
