'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/StatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RegistrationModal } from '@/components/RegistrationModal';
import {
  Trophy,
  User,
  ShieldCheck,
  Clock,
  Key,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Wallet,
  Smartphone,
  Calendar,
} from 'lucide-react';
import { Tournament } from '@/lib/types';

export default function MyTournamentsPage() {
  const { getUserRegistrations, tournaments, currentUser } = useApp();
  const registrations = getUserRegistrations();

  const [selectedTournamentForResubmit, setSelectedTournamentForResubmit] = useState<Tournament | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* User Profile Card */}
        <div
          className="glass-card"
          style={{
            padding: 'clamp(1.25rem, 3vw, 1.75rem)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            border: '1px solid rgba(0, 240, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '0px',
                background: 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#030712',
                fontWeight: 900,
                fontSize: '1.2rem',
                boxShadow: 'var(--glow-cyan)',
                flexShrink: 0,
              }}
            >
              <User size={26} />
            </div>

            <div>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.08em' }}>
                Player Profile
              </span>
              <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800 }}>{currentUser.name}</h1>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <span>Email: {currentUser.email}</span>
                <span>•</span>
                <span>Contact: {currentUser.phone}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              background: 'rgba(6, 9, 14, 0.6)',
              padding: '0.65rem 1.1rem',
              borderRadius: '0px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {registrations.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confirmed</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {registrations.filter((r) => r.status === 'confirmed').length}
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 800 }}>My Tournament Registrations</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Track payment verification status, cover banners, countdowns, and match room codes
          </p>
        </div>

        {/* Registrations List */}
        {registrations.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <Trophy size={44} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Tournament Registrations Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.875rem' }}>
              Explore our active and upcoming eFootball tournaments in Bangladesh and claim your slot today.
            </p>
            <Link href="/" className="btn btn-primary">
              <span>Browse Active Tournaments</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {registrations.map((reg) => {
              const tournament = tournaments.find((t) => t.id === reg.tournament_id);
              if (!tournament) return null;

              const totalPrize =
                (tournament.prize_champion || 600) +
                (tournament.prize_runnerup || 400) +
                (tournament.prize_2nd_runnerup || 200) +
                (tournament.refund_semifinal || 100);

              const coverImage =
                tournament.banner_url ||
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80';

              return (
                <div
                  key={reg.id}
                  className="glass-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border:
                      reg.status === 'confirmed'
                        ? '1px solid rgba(16, 185, 129, 0.45)'
                        : reg.status === 'rejected'
                        ? '1px solid rgba(244, 63, 94, 0.45)'
                        : '1px solid rgba(245, 158, 11, 0.45)',
                  }}
                >
                  {/* Tournament Cover Banner Strip */}
                  <div
                    style={{
                      height: '115px',
                      width: '100%',
                      backgroundImage: `linear-gradient(180deg, rgba(6, 9, 14, 0.2) 0%, rgba(13, 21, 39, 0.95) 100%), url(${coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      position: 'relative',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <StatusBadge status={reg.status} />
                      <span
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          padding: '0.2rem 0.5rem',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.725rem',
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      >
                        Registered {new Date(reg.registered_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          color: 'var(--accent-amber)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Trophy size={13} /> {totalPrize} BDT Pool
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Title & Detail Link */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tournament.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {tournament.description}
                        </p>
                      </div>

                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <span>View Tournament</span>
                        <ExternalLink size={14} />
                      </Link>
                    </div>

                    {/* Information Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                        gap: '0.85rem',
                        background: 'rgba(10, 16, 30, 0.7)',
                        padding: '0.85rem',
                        borderRadius: '0px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gamer Tag</span>
                        <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          {reg.gamer_tag}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment TrxID</span>
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                          {reg.payment?.transaction_id || 'N/A'} ({reg.payment?.method?.toUpperCase()})
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entry Fee</span>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {reg.payment?.amount || tournament.entry_fee} BDT
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tournament Start</span>
                        <div style={{ fontWeight: 600, fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} style={{ color: 'var(--accent-cyan)' }} />
                          <span suppressHydrationWarning>{new Date(tournament.start_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC STATUS CARDS */}
                    {reg.status === 'confirmed' && (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(10, 16, 30, 0.9) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          padding: '1rem',
                          borderRadius: '0px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ padding: '0.45rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '0px', color: 'var(--accent-emerald)' }}>
                            <Key size={18} />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                              MATCH ROOM CODE UNLOCKED
                            </span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 900, color: '#fff', letterSpacing: '0.08em' }}>
                              {tournament.tournament_code || 'ROOM-PENDING'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopy(reg.id, tournament.tournament_code || '')}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          {copiedCodeId === reg.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          <span>{copiedCodeId === reg.id ? 'Copied' : 'Copy Room Code'}</span>
                        </button>
                      </div>
                    )}


                    {reg.status === 'pending_verification' && (
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          padding: '1rem 1.25rem',
                          borderRadius: '0px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                        }}
                      >
                        <Clock size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.875rem' }}>
                          <strong style={{ color: 'var(--accent-amber)' }}>Manual Payment Under Review: </strong>
                          Your {reg.payment?.method?.toUpperCase()} TrxID (<code>{reg.payment?.transaction_id}</code>) is being verified against organizer statements. Verification typically completes within 10–30 minutes.
                        </div>
                      </div>
                    )}

                    {reg.status === 'rejected' && (
                      <div
                        style={{
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.35)',
                          padding: '1rem 1.25rem',
                          borderRadius: '0px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <AlertCircle size={20} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-rose)', textTransform: 'uppercase' }}>
                              Payment Verification Failed
                            </span>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                              Reason: {reg.rejection_reason || 'TrxID was not found in statement or invalid sender number.'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedTournamentForResubmit(tournament)}
                          className="btn btn-sm"
                          style={{
                            background: 'var(--accent-rose)',
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        >
                          Resubmit Correct TrxID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Registration Resubmit Modal */}
      {selectedTournamentForResubmit && (
        <RegistrationModal
          tournament={selectedTournamentForResubmit}
          isOpen={!!selectedTournamentForResubmit}
          onClose={() => setSelectedTournamentForResubmit(null)}
        />
      )}
    </div>
  );
}
