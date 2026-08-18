'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tournament, Registration, CurrentUser, PaymentMethod, Payment, NotificationItem, UserRole } from './types';
import { INITIAL_TOURNAMENTS, INITIAL_REGISTRATIONS, INITIAL_USER, INITIAL_ADMIN, INITIAL_NOTIFICATIONS } from './mock-data';
import { supabase, isSupabaseConfigured } from './supabase';

interface AppContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  toggleRole: () => void;
  tournaments: Tournament[];
  registrations: Registration[];
  notifications: NotificationItem[];
  
  // Tournament actions
  createTournament: (tournament: Omit<Tournament, 'id' | 'created_at'>) => Promise<Tournament>;
  updateTournament: (tournamentId: string, updatedData: Partial<Tournament>) => Promise<void>;
  deleteTournament: (tournamentId: string) => Promise<void>;
  updateTournamentStatus: (tournamentId: string, status: Tournament['status']) => Promise<void>;
  updateTournamentCode: (tournamentId: string, code: string) => Promise<void>;
  
  // Registration & Payment actions
  submitRegistration: (params: {
    tournamentId: string;
    userName: string;
    userEmail: string;
    gamerTag: string;
    senderNumber: string;
    paymentMethod: PaymentMethod;
    transactionId: string;
    amount: number;
  }) => Promise<{ registration: Registration; payment: Payment }>;
  
  // Admin auth actions
  loginAsAdmin: (passkey: string) => boolean;
  logoutAdmin: () => void;

  // Admin verification actions
  verifyPayment: (paymentId: string) => Promise<void>;
  rejectPayment: (paymentId: string, reason: string) => Promise<void>;
  assignSeed: (registrationId: string, seedNumber: number) => Promise<void>;
  
  // Helpers
  getTournament: (id: string) => Tournament | undefined;
  getRegistrationsForTournament: (tournamentId: string) => Registration[];
  getUserRegistrationForTournament: (tournamentId: string, userId?: string) => Registration | undefined;
  getUserRegistrations: (userId?: string) => Registration[];
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_TOURNAMENTS = 'efootball_tournaments_v1';
const STORAGE_KEY_REGISTRATIONS = 'efootball_registrations_v1';
const STORAGE_KEY_USER = 'efootball_user_v1';
const STORAGE_KEY_NOTIFS = 'efootball_notifs_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(INITIAL_USER);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from Supabase and/or localStorage on mount
  useEffect(() => {
    async function loadData() {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedUser) setCurrentUserState(JSON.parse(savedUser));

        const savedTournaments = localStorage.getItem(STORAGE_KEY_TOURNAMENTS);
        if (savedTournaments) setTournaments(JSON.parse(savedTournaments));

        const savedRegistrations = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
        if (savedRegistrations) setRegistrations(JSON.parse(savedRegistrations));

        const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

        // If Supabase is configured, fetch live tournaments and sync
        if (isSupabaseConfigured && supabase) {
          const { data: dbTournaments, error: tourError } = await supabase
            .from('tournaments')
            .select('*')
            .order('created_at', { ascending: false });

          if (!tourError && dbTournaments && dbTournaments.length > 0) {
            setTournaments(dbTournaments as Tournament[]);
          }
        }
      } catch (e) {
        console.warn('Data loading warning:', e);
      } finally {
        setIsHydrated(true);
      }
    }

    loadData();
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY_TOURNAMENTS, JSON.stringify(tournaments));
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(registrations));
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Could not save to localStorage quota exceeded', e);
    }
  }, [currentUser, tournaments, registrations, notifications, isHydrated]);

  const setCurrentUser = (user: CurrentUser) => {
    setCurrentUserState(user);
  };

  const toggleRole = () => {
    setCurrentUserState((prev) =>
      prev.role === 'player' ? INITIAL_ADMIN : INITIAL_USER
    );
  };

  const loginAsAdmin = (passkey: string): boolean => {
    const validPasskeys = ['efootball2026', 'admin123', 'admin', 'manager2026'];
    if (validPasskeys.includes(passkey.trim())) {
      setCurrentUserState(INITIAL_ADMIN);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setCurrentUserState(INITIAL_USER);
  };

  const createTournament = async (tournamentData: Omit<Tournament, 'id' | 'created_at'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: `tour_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setTournaments((prev) => [newTournament, ...prev]);

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tournaments').insert([newTournament]);
      } catch (err) {
        console.warn('Supabase tournament insert failed, stored in local state:', err);
      }
    }

    return newTournament;
  };

  const updateTournament = async (tournamentId: string, updatedData: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, ...updatedData } : t))
    );

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tournaments').update(updatedData).eq('id', tournamentId);
      } catch (err) {
        console.warn('Supabase tournament update failed, stored in local state:', err);
      }
    }
  };

  const deleteTournament = async (tournamentId: string) => {
    setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tournaments').delete().eq('id', tournamentId);
      } catch (err) {
        console.warn('Supabase tournament delete failed:', err);
      }
    }
  };

  const updateTournamentStatus = async (tournamentId: string, status: Tournament['status']) => {
    await updateTournament(tournamentId, { status });
  };

  const updateTournamentCode = async (tournamentId: string, code: string) => {
    await updateTournament(tournamentId, { tournament_code: code });
  };

  const submitRegistration = async (params: {
    tournamentId: string;
    userName: string;
    userEmail: string;
    gamerTag: string;
    senderNumber: string;
    paymentMethod: PaymentMethod;
    transactionId: string;
    amount: number;
  }) => {
    const regId = `reg_${Date.now()}`;
    const payId = `pay_${Date.now()}`;
    const now = new Date().toISOString();

    const newPayment: Payment = {
      id: payId,
      registration_id: regId,
      method: params.paymentMethod,
      type: 'manual',
      sender_number: params.senderNumber,
      transaction_id: params.transactionId.trim().toUpperCase(),
      amount: params.amount,
      status: 'pending',
      created_at: now,
    };

    const newRegistration: Registration = {
      id: regId,
      user_id: currentUser.id,
      tournament_id: params.tournamentId,
      gamer_tag: params.gamerTag.trim(),
      sender_number: params.senderNumber.trim(),
      status: 'pending_verification',
      registered_at: now,
      user_name: params.userName.trim(),
      user_email: params.userEmail.trim(),
      payment: newPayment,
    };

    setRegistrations((prev) => {
      // Remove any existing prior registration for this user & tournament
      const filtered = prev.filter(
        (r) => !(r.tournament_id === params.tournamentId && r.user_id === currentUser.id)
      );
      return [newRegistration, ...filtered];
    });

    // Add confirmation notification
    const tournament = tournaments.find((t) => t.id === params.tournamentId);
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: currentUser.id,
      type: 'registration_received',
      message: `Registration submitted for "${tournament?.title || 'Tournament'}". Payment TrxID: ${params.transactionId.toUpperCase()} is pending admin review.`,
      sent_at: now,
      status: 'sent',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('registrations').insert([{
          id: regId,
          user_id: currentUser.id,
          tournament_id: params.tournamentId,
          gamer_tag: params.gamerTag.trim(),
          sender_number: params.senderNumber.trim(),
          status: 'pending_verification',
          registered_at: now,
        }]);

        await supabase.from('payments').insert([{
          id: payId,
          registration_id: regId,
          method: params.paymentMethod,
          type: 'manual',
          sender_number: params.senderNumber.trim(),
          transaction_id: params.transactionId.trim().toUpperCase(),
          amount: params.amount,
          status: 'pending',
          created_at: now,
        }]);
      } catch (err) {
        console.warn('Supabase registration sync warning:', err);
      }
    }

    return { registration: newRegistration, payment: newPayment };
  };

  const verifyPayment = async (paymentId: string) => {
    const now = new Date().toISOString();

    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.payment?.id === paymentId) {
          const updatedPayment: Payment = {
            ...reg.payment,
            status: 'verified',
            verified_by: currentUser.id,
            verified_at: now,
          };
          return {
            ...reg,
            status: 'confirmed',
            payment: updatedPayment,
          };
        }
        return reg;
      })
    );

    // Find the affected registration to send notification
    const affected = registrations.find((r) => r.payment?.id === paymentId);
    if (affected) {
      const tournament = tournaments.find((t) => t.id === affected.tournament_id);
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        user_id: affected.user_id,
        type: 'payment_verified',
        message: `Payment verified! You are confirmed for "${tournament?.title}". Match code: ${tournament?.tournament_code || 'TBA'}`,
        sent_at: now,
        status: 'sent',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('payments').update({ status: 'verified', verified_by: currentUser.id, verified_at: now }).eq('id', paymentId);
          await supabase.from('registrations').update({ status: 'confirmed' }).eq('id', affected.id);
        } catch (err) {
          console.warn('Supabase payment verify sync warning:', err);
        }
      }
    }
  };

  const rejectPayment = async (paymentId: string, reason: string) => {
    const now = new Date().toISOString();

    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.payment?.id === paymentId) {
          const updatedPayment: Payment = {
            ...reg.payment,
            status: 'rejected',
            rejection_reason: reason || 'Invalid Transaction ID / Amount Mismatch',
            verified_by: currentUser.id,
            verified_at: now,
          };
          return {
            ...reg,
            status: 'rejected',
            payment: updatedPayment,
          };
        }
        return reg;
      })
    );

    const affected = registrations.find((r) => r.payment?.id === paymentId);
    if (affected) {
      const tournament = tournaments.find((t) => t.id === affected.tournament_id);
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        user_id: affected.user_id,
        type: 'payment_rejected',
        message: `Payment rejected for "${tournament?.title}". Reason: ${reason || 'Transaction not found'}. You may resubmit your payment details.`,
        sent_at: now,
        status: 'sent',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('payments').update({ status: 'rejected', rejection_reason: reason, verified_by: currentUser.id, verified_at: now }).eq('id', paymentId);
          await supabase.from('registrations').update({ status: 'rejected' }).eq('id', affected.id);
        } catch (err) {
          console.warn('Supabase payment reject sync warning:', err);
        }
      }
    }
  };

  const assignSeed = async (registrationId: string, seedNumber: number) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId ? { ...reg, seed_number: seedNumber } : reg
      )
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('registrations').update({ seed_number: seedNumber }).eq('id', registrationId);
      } catch (err) {
        console.warn('Supabase assignSeed sync warning:', err);
      }
    }
  };

  const getTournament = (id: string) => tournaments.find((t) => t.id === id);

  const getRegistrationsForTournament = (tournamentId: string) =>
    registrations.filter((r) => r.tournament_id === tournamentId);

  const getUserRegistrationForTournament = (tournamentId: string, userId = currentUser.id) =>
    registrations.find((r) => r.tournament_id === tournamentId && r.user_id === userId);

  const getUserRegistrations = (userId = currentUser.id) =>
    registrations.filter((r) => r.user_id === userId);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        toggleRole,
        loginAsAdmin,
        logoutAdmin,
        tournaments,
        registrations,
        notifications,
        createTournament,
        updateTournament,
        deleteTournament,
        updateTournamentStatus,
        updateTournamentCode,
        submitRegistration,
        verifyPayment,
        rejectPayment,
        assignSeed,
        getTournament,
        getRegistrationsForTournament,
        getUserRegistrationForTournament,
        getUserRegistrations,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
