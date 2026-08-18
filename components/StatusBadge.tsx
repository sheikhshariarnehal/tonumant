import React from 'react';
import { TournamentStatus, RegistrationStatus } from '@/lib/types';
import { Clock, CheckCircle2, AlertCircle, Lock, PlayCircle, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: TournamentStatus | RegistrationStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'upcoming':
      return (
        <span className={`badge badge-upcoming ${className}`}>
          <Clock size={12} /> Upcoming
        </span>
      );
    case 'ongoing':
      return (
        <span className={`badge badge-ongoing ${className}`}>
          <PlayCircle size={12} /> Live Now
        </span>
      );
    case 'completed':
      return (
        <span className={`badge badge-completed ${className}`}>
          <CheckCircle2 size={12} /> Completed
        </span>
      );
    case 'locked':
      return (
        <span className={`badge badge-locked ${className}`}>
          <Lock size={12} /> Registration Closed
        </span>
      );
    case 'confirmed':
      return (
        <span className={`badge badge-confirmed ${className}`}>
          <ShieldCheck size={12} /> Confirmed / Verified
        </span>
      );
    case 'pending_verification':
      return (
        <span className={`badge badge-pending ${className}`}>
          <Clock size={12} /> Pending Verification
        </span>
      );
    case 'rejected':
      return (
        <span className={`badge badge-rejected ${className}`}>
          <AlertCircle size={12} /> Payment Rejected
        </span>
      );
    default:
      return <span className={`badge badge-completed ${className}`}>{status}</span>;
  }
};
