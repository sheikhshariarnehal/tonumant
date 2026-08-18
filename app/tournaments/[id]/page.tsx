'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/StatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RegistrationModal } from '@/components/RegistrationModal';
import {
  Trophy,
  Calendar,
  Wallet,
  Users,
  ShieldCheck,
  Clock,
  Key,
  Copy,
  Check,
  AlertCircle,
  FileText,
  ChevronLeft,
  Share2,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const {
    getTournament,
    getRegistrationsForTournament,
    getUserRegistrationForTournament,
    currentUser,
  } = useApp();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const tournament = getTournament(tournamentId);
  const registrations = getRegistrationsForTournament(tournamentId);
  const userRegistration = getUserRegistrationForTournament(tournamentId);

  if (!tournament) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Tournament not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          The tournament you are looking for does not exist or has been removed.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Tournaments
        </Link>
      </div>
    );
  }

  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const isFull = registrations.length >= tournament.max_players;
  const isLocked = tournament.status === 'locked' || tournament.status === 'completed';

  const handleCopyCode = () => {
    if (tournament.tournament_code) {
      navigator.clipboard.writeText(tournament.tournament_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={16} /> Back to all tournaments
        </Link>

        {/* HERO BANNER & STATUS */}
        <div
          className="glass-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: 'clamp(1.25rem, 3.5vw, 2.5rem)',
            marginBottom: '2rem',
            backgroundImage: `linear-gradient(180deg, rgba(6, 9, 14, 0.4) 0%, rgba(13, 21, 39, 0.98) 100%), url(${tournament.banner_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(167, 139, 250, 0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusBadge status={tournament.status} />
              {isFull && <span className="badge badge-locked">Slots Full</span>}
            </div>

            {tournament.status === 'upcoming' && (
              <CountdownTimer targetDate={tournament.start_time} compact />
            )}
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {tournament.title}
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'var(--text-secondary)',
              maxWidth: '800px',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}
          >
            {tournament.description}
          </p>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '1rem',
              background: 'rgba(6, 9, 14, 0.75)',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entry Fee</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {tournament.entry_fee} BDT
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Champion Prize</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {tournament.prize_champion} BDT
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Players</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {registrations.length} / {tournament.max_players} <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>({confirmedCount} Confirmed)</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Start Schedule</span>
              <div
                suppressHydrationWarning
                style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}
              >
                {new Date(tournament.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.75rem',
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN: PRIZES, RULES, ROSTER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* PRIZE POOL BREAKDOWN */}
            <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                  <Trophy size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem' }}>Prize Pool Structure</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '0.75rem' }}>
                {/* Champion */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: 'var(--accent-amber)', marginBottom: '0.3rem' }}>
                    <Trophy size={26} style={{ margin: '0 auto' }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
                    Champion
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>
                    {tournament.prize_champion} BDT
                  </div>
                </div>

                {/* Runner-up */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    <Trophy size={22} style={{ margin: '0 auto' }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase' }}>
                    Runner-up
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    {tournament.prize_runnerup} BDT
                  </div>
                </div>

                {/* 2nd Runner-up */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(217, 119, 6, 0.3)',
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#d97706', marginBottom: '0.3rem' }}>
                    <Trophy size={20} style={{ margin: '0 auto' }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                    2nd Runner-up
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    {tournament.prize_2nd_runnerup} BDT
                  </div>
                </div>

                {/* Semifinal Refund */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>
                    <Wallet size={20} style={{ margin: '0 auto' }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    Semifinalists
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
                    Refund ({tournament.refund_semifinal} BDT)
                  </div>
                </div>
              </div>
            </div>

            {/* RULES & GUIDELINES */}
            <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--accent-cyan)' }}>
                  <FileText size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem' }}>Match Rules & Regulations</h2>
              </div>

              <div
                style={{
                  background: 'rgba(10, 16, 30, 0.75)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  whiteSpace: 'pre-line',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                }}
              >
                {tournament.rules}
              </div>
            </div>

            {/* ROSTER TABLE */}
            <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    <Users size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.3rem' }}>Confirmed Player Roster</h2>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {confirmedCount} confirmed
                </span>
              </div>

              {registrations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                  No registrations yet. Be the first to claim a slot!
                </p>
              ) : (
                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Seed / #</th>
                        <th>Player Name</th>
                        <th>eFootball Gamer Tag</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg, index) => (
                        <tr key={reg.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            #{reg.seed_number || index + 1}
                          </td>
                          <td style={{ fontWeight: 600 }}>{reg.user_name}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                            {reg.gamer_tag}
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
          </div>

          {/* RIGHT COLUMN: REGISTRATION & ROOM CODE CARD */}
          <div>
            <div
              className="glass-card"
              style={{
                padding: 'clamp(1.25rem, 3vw, 2rem)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), var(--glow-cyan)',
              }}
            >
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Your Tournament Status
              </h3>


              {/* SCENARIO 1: USER IS ALREADY REGISTERED */}
              {userRegistration ? (
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div
                    style={{
                      background: 'rgba(10, 16, 30, 0.85)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
                      <StatusBadge status={userRegistration.status} />
                    </div>

                    <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Registered Gamer Tag: </span>
                        <strong>{userRegistration.gamer_tag}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Submitted TrxID: </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                          {userRegistration.payment?.transaction_id}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Method: </span>
                        <strong>{userRegistration.payment?.method?.toUpperCase()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ROOM CODE ACCESS (UNLOCKED IF CONFIRMED) */}
                  {userRegistration.status === 'confirmed' ? (
                    <div
                      style={{
                        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(10, 16, 30, 0.9) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <Key size={16} /> OFFICIAL MATCH ROOM CODE
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#06090e', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
                          {tournament.tournament_code || 'ROOM-PENDING'}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.3rem' }}
                        >
                          {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        Paste this code in eFootball under <strong>Friend Match → Match Room</strong> at kickoff time.
                      </p>
                    </div>
                  ) : userRegistration.status === 'rejected' ? (
                    <div
                      style={{
                        background: 'rgba(244, 63, 94, 0.12)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                        <AlertCircle size={16} /> Payment Verification Rejected
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                        Reason: {userRegistration.payment?.rejection_reason || 'Transaction could not be verified.'}
                      </p>
                      <button
                        onClick={() => setIsRegisterOpen(true)}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        Resubmit Payment TrxID
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <Clock size={16} style={{ color: 'var(--accent-amber)', marginBottom: '0.35rem' }} />
                      <p>
                        Your payment is currently in the verification queue. The organizer will approve your TrxID shortly and unlock the room code.
                      </p>
                    </div>
                  )}

                  <Link href="/my-tournaments" className="btn btn-secondary" style={{ width: '100%' }}>
                    View in My Registrations
                  </Link>
                </div>
              ) : (
                /* SCENARIO 2: NOT YET REGISTERED */
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div
                    style={{
                      background: 'rgba(10, 16, 30, 0.85)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Entry Fee</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {tournament.entry_fee} BDT
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Slots Available</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {tournament.max_players - registrations.length} slots left
                      </span>
                    </div>

                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                      Pay via bKash, Nagad, or Rocket. Verification is completed within minutes.
                    </div>
                  </div>

                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    disabled={isFull || isLocked}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', gap: '0.5rem' }}
                  >
                    <Sparkles size={18} />
                    <span>{isFull ? 'Tournament Full' : isLocked ? 'Registration Closed' : 'Register Now (100 BDT)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2-STEP REGISTRATION MODAL */}
      <RegistrationModal
        tournament={tournament}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
