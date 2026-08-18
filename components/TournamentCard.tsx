'use client';

import React from 'react';
import Link from 'next/link';
import { Tournament } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';
import { Trophy, Users, ArrowRight, Wallet, Calendar } from 'lucide-react';
import { useApp } from '@/lib/store';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const { getRegistrationsForTournament } = useApp();
  const registrations = getRegistrationsForTournament(tournament.id);
  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const totalRegistered = registrations.length;
  const fillPercentage = Math.min(100, Math.round((totalRegistered / tournament.max_players) * 100));

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Card Header & Banner */}
      <div
        style={{
          position: 'relative',
          height: '160px',
          backgroundImage: `linear-gradient(180deg, rgba(14, 12, 19, 0.2) 0%, rgba(24, 20, 34, 0.98) 100%), url(${tournament.banner_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <StatusBadge status={tournament.status} />
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: 'var(--accent-amber)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Trophy size={13} /> {tournament.prize_champion} BDT Top Prize
          </div>
        </div>

        {/* Countdown Ticker on Card */}
        {tournament.status === 'upcoming' && (
          <div style={{ alignSelf: 'flex-start' }}>
            <CountdownTimer targetDate={tournament.start_time} compact />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
        <div>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '0.4rem',
              color: '#ffffff',
            }}
          >
            {tournament.title}
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {tournament.description}
          </p>
        </div>

        {/* Meta Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            background: 'rgba(14, 12, 19, 0.65)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Entry Fee
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-purple-soft)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Wallet size={14} /> {tournament.entry_fee} BDT
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Date & Time
            </div>
            <div
              suppressHydrationWarning
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Calendar size={13} /> {new Date(tournament.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Slot Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={12} /> Slots Filled
            </span>
            <span style={{ fontWeight: 700, color: totalRegistered >= tournament.max_players ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
              {totalRegistered} / {tournament.max_players} Players ({confirmedCount} Confirmed)
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `scaleX(${fillPercentage / 100})`,
                transformOrigin: 'left',
                background: fillPercentage >= 100 ? 'var(--accent-rose)' : 'linear-gradient(90deg, #7c4df0 0%, #a78bfa 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'transform 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Card Footer CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          <Link
            href={`/tournaments/${tournament.id}`}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <span>View Tournament & Rules</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
