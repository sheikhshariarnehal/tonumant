'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/StatusBadge';
import { CreateTournamentModal } from '@/components/CreateTournamentModal';
import { EditTournamentModal } from '@/components/EditTournamentModal';
import { Tournament } from '@/lib/types';
import {
  Shield,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Users,
  Wallet,
  Key,
  Lock,
  Unlock,
  AlertCircle,
  ExternalLink,
  Edit,
  Sparkles,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const {
    tournaments,
    registrations,
    verifyPayment,
    rejectPayment,
    updateTournamentStatus,
    updateTournamentCode,
    assignSeed,
    currentUser,
    loginAsAdmin,
    logoutAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'tournaments' | 'roster'>('queue');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTournamentForEdit, setSelectedTournamentForEdit] = useState<Tournament | null>(null);
  const [rejectModalData, setRejectModalData] = useState<{
    paymentId: string;
    playerName: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('Transaction not found in statement');
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  const [tempCode, setTempCode] = useState('');
  const [selectedTournamentForRoster, setSelectedTournamentForRoster] = useState<string>(
    tournaments[0]?.id || ''
  );

  // Admin Auth Passkey State
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      setPasskeyError('Please enter the organizer passkey.');
      return;
    }
    const success = loginAsAdmin(passkeyInput);
    if (!success) {
      setPasskeyError('Invalid Organizer Passkey. Access denied.');
    } else {
      setPasskeyError('');
      setPasskeyInput('');
    }
  };

  // If user is NOT a manager, show the security gate
  if (currentUser.role !== 'manager') {
    return (
      <div style={{ minHeight: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', backgroundColor: '#0e0c13' }}>
        <div style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          <div
            className="glass-card"
            style={{
              padding: '2.5rem 2rem',
              background: '#181422',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'rgba(124, 77, 240, 0.15)',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--accent-purple-light)',
              }}
            >
              <Lock size={28} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--accent-rose)',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              <AlertCircle size={13} /> Restricted Access
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
              Organizer Command Portal
            </h1>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              This portal is restricted to authorized tournament directors. Please enter your Organizer Passkey to proceed.
            </p>

            <form onSubmit={handleAdminLogin} style={{ textAlign: 'left' }}>
              {passkeyError && (
                <div
                  style={{
                    padding: '0.65rem 0.9rem',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: 'var(--accent-rose)',
                    fontSize: '0.825rem',
                    marginBottom: '1rem',
                  }}
                >
                  {passkeyError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Organizer Passkey</label>
                <input
                  type="password"
                  className="form-input mono"
                  placeholder="••••••••••••"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  required
                  style={{
                    fontSize: '1.05rem',
                    letterSpacing: '0.15em',
                    background: '#120f1a',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem', gap: '0.5rem' }}
              >
                <Key size={16} />
                <span>Authorize & Unlock Dashboard</span>
              </button>
            </form>

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Link
                href="/"
                style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                ← Return to Public Tournament Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Derived Metrics
  const pendingRegistrations = registrations.filter((r) => r.status === 'pending_verification' && r.payment);
  const confirmedRegistrations = registrations.filter((r) => r.status === 'confirmed');
  const totalRevenue = confirmedRegistrations.reduce((acc, r) => acc + (r.payment?.amount || 100), 0);

  const handleApprove = (paymentId: string) => {
    verifyPayment(paymentId);
  };

  const handleOpenReject = (paymentId: string, playerName: string) => {
    setRejectModalData({ paymentId, playerName });
    setRejectReason('Transaction ID not found in mobile banking SMS');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectModalData) {
      rejectPayment(rejectModalData.paymentId, rejectReason);
      setRejectModalData(null);
    }
  };

  const handleSaveCode = (tournamentId: string) => {
    if (tempCode.trim()) {
      updateTournamentCode(tournamentId, tempCode.trim());
      setEditingCodeId(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '0px',
                color: '#c084fc',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              <Shield size={14} /> TOURNAMENT ORGANIZER COMMAND
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manager Dashboard</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Logged in as <strong style={{ color: '#fff' }}>{currentUser.name}</strong> • Verify payments, seed players, & control lifecycles
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={logoutAdmin}
              className="btn btn-secondary"
              style={{ gap: '0.4rem' }}
              title="Lock Admin Session & Return to Player Mode"
            >
              <Lock size={14} />
              <span>Lock / Exit Admin</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              <PlusCircle size={18} />
              <span>Create New Tournament</span>
            </button>
          </div>
        </div>

        {/* KPI STAT CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* Pending Verifications */}
          <div
            className="glass-card"
            style={{
              padding: '1rem',
              border: pendingRegistrations.length > 0 ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid var(--border-subtle)',
              boxShadow: pendingRegistrations.length > 0 ? 'var(--glow-amber)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Pending Review
              </span>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                <Clock size={16} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--accent-amber)', margin: '0.3rem 0' }}>
              {pendingRegistrations.length}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Awaiting SMS check
            </span>
          </div>

          {/* Confirmed Players */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Confirmed Players
              </span>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-emerald)' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--accent-emerald)', margin: '0.3rem 0' }}>
              {confirmedRegistrations.length}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Across tournaments
            </span>
          </div>

          {/* Total Revenue */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Verified Revenue
              </span>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--accent-cyan)' }}>
                <Wallet size={16} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--accent-cyan)', margin: '0.3rem 0' }}>
              {totalRevenue} BDT
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Collected fees
            </span>
          </div>

          {/* Total Tournaments */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Active Tournaments
              </span>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                <Trophy size={16} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#fff', margin: '0.3rem 0' }}>
              {tournaments.length}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Competitions
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS (HORIZONTALLY SCROLLABLE ON MOBILE) */}
        <div
          className="scroll-tabs"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            paddingBottom: '0',
          }}
        >
          <button
            onClick={() => setActiveTab('queue')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: 'transparent',
              color: activeTab === 'queue' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'queue' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Clock size={16} />
            <span>Verification Queue</span>
            {pendingRegistrations.length > 0 && (
              <span
                style={{
                  background: 'var(--accent-amber)',
                  color: '#030712',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {pendingRegistrations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: 'transparent',
              color: activeTab === 'tournaments' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'tournaments' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Trophy size={16} />
            <span>Tournaments ({tournaments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              background: 'transparent',
              color: activeTab === 'roster' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'roster' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Users size={16} />
            <span>Seeding & Rosters</span>
          </button>
        </div>


        {/* TAB 1: PAYMENT VERIFICATION QUEUE */}
        {activeTab === 'queue' && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Pending Manual Payments</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Cross-check TrxID with bKash/Nagad/Rocket statement before approving
              </span>
            </div>

            {pendingRegistrations.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={44} style={{ color: 'var(--accent-emerald)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Verification Queue is Empty</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  All submitted player payments have been verified and processed.
                </p>
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Player & Gamer Tag</th>
                      <th>Tournament</th>
                      <th>Method</th>
                      <th>Sender Number</th>
                      <th>Transaction ID (TrxID)</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRegistrations.map((reg) => {
                      const t = tournaments.find((tour) => tour.id === reg.tournament_id);
                      const payment = reg.payment;
                      if (!payment) return null;

                      return (
                        <tr key={reg.id}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{reg.user_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                              @{reg.gamer_tag}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{t?.title}</td>
                          <td>
                            <span
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background:
                                  payment.method === 'bkash'
                                    ? 'rgba(226, 19, 110, 0.15)'
                                    : payment.method === 'nagad'
                                    ? 'rgba(247, 148, 29, 0.15)'
                                    : 'rgba(140, 52, 148, 0.15)',
                                color:
                                  payment.method === 'bkash'
                                    ? 'var(--color-bkash)'
                                    : payment.method === 'nagad'
                                    ? 'var(--color-nagad)'
                                    : '#c084fc',
                              }}
                            >
                              {payment.method.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                            {payment.sender_number}
                          </td>
                          <td>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 800,
                                color: 'var(--accent-cyan)',
                                background: 'rgba(0, 240, 255, 0.08)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(0, 240, 255, 0.2)',
                              }}
                            >
                              {payment.transaction_id}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700 }}>{payment.amount} BDT</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleApprove(payment.id)}
                                className="btn btn-sm"
                                style={{
                                  background: 'rgba(16, 185, 129, 0.2)',
                                  color: 'var(--accent-emerald)',
                                  border: '1px solid rgba(16, 185, 129, 0.4)',
                                }}
                              >
                                <CheckCircle2 size={14} />
                                <span>Verify</span>
                              </button>

                              <button
                                onClick={() => handleOpenReject(payment.id, reg.user_name)}
                                className="btn btn-sm"
                                style={{
                                  background: 'rgba(244, 63, 94, 0.15)',
                                  color: 'var(--accent-rose)',
                                  border: '1px solid rgba(244, 63, 94, 0.3)',
                                }}
                              >
                                <XCircle size={14} />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TOURNAMENT MANAGEMENT */}
        {activeTab === 'tournaments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tournaments.map((t) => {
              const regList = registrations.filter((r) => r.tournament_id === t.id);
              const isEditing = editingCodeId === t.id;
              const coverImage =
                t.banner_url ||
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80';

              const totalPrize =
                (t.prize_champion || 600) +
                (t.prize_runnerup || 400) +
                (t.prize_2nd_runnerup || 200) +
                (t.refund_semifinal || 100);

              return (
                <div
                  key={t.id}
                  className="glass-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Visual Cover Banner Strip */}
                  <div
                    style={{
                      height: '110px',
                      width: '100%',
                      backgroundImage: `linear-gradient(180deg, rgba(6, 9, 14, 0.3) 0%, rgba(13, 21, 39, 0.95) 100%), url(${coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <StatusBadge status={t.status} />
                      <span
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          padding: '0.2rem 0.5rem',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.75rem',
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      >
                        {regList.length} / {t.max_players} Players
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          color: 'var(--accent-amber)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                        }}
                      >
                        {totalPrize} BDT Pool
                      </span>
                      <span
                        style={{
                          background: 'rgba(0, 240, 255, 0.15)',
                          border: '1px solid rgba(0, 240, 255, 0.3)',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                        }}
                      >
                        {t.entry_fee} BDT Entry
                      </span>
                    </div>
                  </div>

                  {/* Tournament Card Body */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{t.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {t.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Edit Tournament Button */}
                        <button
                          onClick={() => setSelectedTournamentForEdit(t)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Edit size={14} />
                          <span>Edit Tournament</span>
                        </button>

                        {/* Lifecycle Status Selector */}
                        <select
                          className="form-select"
                          style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                          value={t.status}
                          onChange={(e) => updateTournamentStatus(t.id, e.target.value as any)}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Live / Ongoing</option>
                          <option value="locked">Registration Locked</option>
                          <option value="completed">Completed</option>
                        </select>

                        <Link
                          href={`/tournaments/${t.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <span>View Page</span>
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>

                  {/* Room Code Manager */}
                  <div
                    style={{
                      background: 'rgba(10, 16, 30, 0.75)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Official Match Room Code (Broadcasted to Confirmed Players)
                      </span>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                          <input
                            type="text"
                            className="form-input mono"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.9rem' }}
                            value={tempCode}
                            onChange={(e) => setTempCode(e.target.value)}
                          />
                          <button
                            onClick={() => handleSaveCode(t.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCodeId(null)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                          {t.tournament_code || 'NONE ASSIGNED'}
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingCodeId(t.id);
                          setTempCode(t.tournament_code || '');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.3rem' }}
                      >
                        <Edit size={14} />
                        <span>Update Code</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

        {/* TAB 3: ROSTER & SEEDING */}
        {activeTab === 'roster' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label className="form-label" style={{ margin: 0 }}>Select Tournament:</label>
              <select
                className="form-select"
                style={{ maxWidth: '380px' }}
                value={selectedTournamentForRoster}
                onChange={(e) => setSelectedTournamentForRoster(e.target.value)}
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({registrations.filter((r) => r.tournament_id === t.id).length} players)
                  </option>
                ))}
              </select>
            </div>

            {registrations.filter((r) => r.tournament_id === selectedTournamentForRoster).length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No players registered for this tournament yet.
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Seed #</th>
                      <th>Player Name</th>
                      <th>eFootball Gamer ID</th>
                      <th>Contact Phone</th>
                      <th>TrxID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations
                      .filter((r) => r.tournament_id === selectedTournamentForRoster)
                      .map((reg, idx) => (
                        <tr key={reg.id}>
                          <td>
                            <input
                              type="number"
                              className="form-input mono"
                              style={{ width: '65px', padding: '0.25rem 0.45rem', fontSize: '0.85rem' }}
                              value={reg.seed_number ?? idx + 1}
                              onChange={(e) => assignSeed(reg.id, Number(e.target.value))}
                              min={1}
                            />
                          </td>
                          <td style={{ fontWeight: 700 }}>{reg.user_name}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                            {reg.gamer_tag}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{reg.sender_number}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                            {reg.payment?.transaction_id || 'N/A'}
                          </td>
                          <td>
                            <StatusBadge status={reg.status} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE TOURNAMENT MODAL */}
      <CreateTournamentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* EDIT TOURNAMENT MODAL */}
      <EditTournamentModal
        tournament={selectedTournamentForEdit}
        isOpen={!!selectedTournamentForEdit}
        onClose={() => setSelectedTournamentForEdit(null)}
      />

      {/* REJECT PAYMENT REASON MODAL */}
      {rejectModalData && (
        <div className="modal-overlay" onClick={() => setRejectModalData(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-rose)' }}>
                Reject Payment Verification
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Player: {rejectModalData.playerName}
              </p>
            </div>

            <form onSubmit={handleConfirmReject} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Rejection Reason (Player will see this)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalData(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm"
                  style={{
                    background: 'var(--accent-rose)',
                    color: '#fff',
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
