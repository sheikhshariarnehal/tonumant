'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { TournamentCard } from '@/components/TournamentCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import {
  Trophy,
  Flame,
  Search,
  Zap,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Sparkles,
  Gamepad2,
  Users,
  Key,
  Clock,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const { tournaments, getRegistrationsForTournament } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Featured Tournament: Top upcoming tournament
  const featuredTournament = useMemo(() => {
    return tournaments.find((t) => t.status === 'upcoming') || tournaments[0];
  }, [tournaments]);

  const featuredRegistrations = useMemo(() => {
    if (!featuredTournament) return [];
    return getRegistrationsForTournament(featuredTournament.id);
  }, [featuredTournament, getRegistrationsForTournament]);

  const featuredConfirmedCount = featuredRegistrations.filter((r) => r.status === 'confirmed').length;
  const featuredTotalCount = featuredRegistrations.length;
  const featuredMaxPlayers = featuredTournament?.max_players || 32;
  const featuredSlotsLeft = Math.max(0, featuredMaxPlayers - featuredTotalCount);
  const featuredFillPercent = Math.min(100, Math.round((featuredTotalCount / featuredMaxPlayers) * 100));

  // Filtered Tournaments
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesTab =
        filterTab === 'all' ? true : t.status === filterTab;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [tournaments, filterTab, searchQuery]);

  return (
    <div>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(3rem, 6vw, 4.5rem) 0 clamp(2.5rem, 5vw, 3.5rem)',
          backgroundImage: `
            radial-gradient(rgba(168, 85, 247, 0.08) 1px, transparent 1px),
            linear-gradient(180deg, rgba(18, 15, 23, 0.92) 0%, rgba(18, 15, 23, 1) 100%)
          `,
          backgroundSize: '32px 32px, 100% 100%',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Heading & Value Prop */}
            <div>
              {/* Live Season Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.4rem 0.85rem',
                  background: 'rgba(124, 77, 240, 0.12)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--accent-purple-soft)',
                  marginBottom: '1.25rem',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                <img
                  src="/icon-tuna.webp"
                  alt="eFootball Arena"
                  style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                />
                <span style={{ letterSpacing: '0.06em' }}>BANGLADESH ESPORTS HUB • SEASON 2026 LIVE</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                  fontWeight: 900,
                  lineHeight: 1.12,
                  marginBottom: '1.2rem',
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                }}
              >
                Compete, Conquer & Win{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 20%, #c4b5fd 65%, #9d7bf5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Cash Prizes ৳
                </span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: '2rem',
                  maxWidth: '540px',
                }}
              >
                The premier competitive platform for eFootball tacticians in Bangladesh. Seamless 2-step registration with <strong>bKash</strong>, <strong>Nagad</strong> & <strong>Rocket</strong>, verified player rosters, live match clocks, and instant private room codes.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {featuredTournament && (
                  <Link
                    href={`/tournaments/${featuredTournament.id}`}
                    className="btn btn-primary btn-lg"
                    style={{ flex: '1 1 auto', gap: '0.6rem' }}
                  >
                    <Gamepad2 size={20} />
                    <span>Enter Next Tournament</span>
                  </Link>
                )}
                <Link href="/my-tournaments" className="btn btn-secondary btn-lg" style={{ flex: '1 1 auto' }}>
                  <span>My Registrations</span>
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Trust & Activity Micro Bar with Minimal Icons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
                  gap: '1rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Zap size={18} color="var(--accent-purple-light)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Manual Verification</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>bKash / Nagad / Rocket</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Trophy size={18} color="var(--accent-amber)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>100% Guaranteed</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Winner & Runner-up Cash</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Key size={18} color="var(--accent-purple-light)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Private Room Codes</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Unlocked on Confirmation</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Featured Tournament Showcase Card */}
            {featuredTournament && (
              <div
                className="glass-card"
                style={{
                  padding: 0,
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Cinematic Tournament Banner Backdrop */}
                <div
                  style={{
                    height: '140px',
                    width: '100%',
                    backgroundImage: `linear-gradient(180deg, rgba(14, 12, 19, 0.2) 0%, rgba(24, 20, 34, 0.98) 100%), url(${featuredTournament.banner_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div
                      style={{
                        background: 'rgba(124, 77, 240, 0.2)',
                        border: '1px solid rgba(167, 139, 250, 0.35)',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        color: 'var(--accent-purple-soft)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Featured Championship</span>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: 'var(--accent-amber)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Trophy size={13} /> {featuredTournament.prize_champion} BDT Champion
                    </div>
                  </div>
                </div>

                {/* Card Inner Body */}
                <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.4rem', color: '#ffffff' }}>
                      {featuredTournament.title}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {featuredTournament.description}
                    </p>
                  </div>

                  {/* Slots Filling Live Meter */}
                  <div
                    style={{
                      background: 'rgba(14, 12, 19, 0.65)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                        <Users size={13} color="var(--accent-purple-light)" /> Live Registration Slots
                      </span>
                      <span style={{ fontWeight: 800, color: featuredSlotsLeft <= 4 ? 'var(--accent-rose)' : 'var(--accent-purple-light)' }}>
                        {featuredTotalCount} / {featuredMaxPlayers} Claimed ({featuredSlotsLeft} Left)
                      </span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          transform: `scaleX(${featuredFillPercent / 100})`,
                          transformOrigin: 'left',
                          background: 'linear-gradient(90deg, #7c4df0 0%, #a78bfa 100%)',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Countdown Box */}
                  <div
                    style={{
                      background: '#120e1a',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <CountdownTimer
                      targetDate={featuredTournament.start_time}
                      label="Official Kickoff Countdown"
                    />
                  </div>


                  {/* Quick Info & Register CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entry Fee</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-purple-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Smartphone size={16} />
                        <span>{featuredTournament.entry_fee} BDT</span>
                      </div>
                    </div>

                    <Link
                      href={`/tournaments/${featuredTournament.id}`}
                      className="btn btn-primary btn-lg"
                      style={{ flex: '1 1 auto', gap: '0.5rem' }}
                    >
                      <span>View Rules & Register</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* THREE PILLAR FEATURES */}
      <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1.25rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(226, 19, 110, 0.15)', color: 'var(--color-bkash)' }}>
                  <Smartphone size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem' }}>bKash / Nagad / Rocket</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Zero hassle mobile banking. Send payment directly to organizer accounts and submit your TrxID in 2 quick steps.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                  <Trophy size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem' }}>Transparent Prize Pool</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Clear breakdown: 600 BDT Champion, 400 BDT Runner-up, 200 BDT 2nd Runner-up, plus 100 BDT semifinal entry refund.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ fontSize: '1.05rem' }}>Instant Room Codes</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Confirmed players get automatic access to private tournament codes and schedule notifications before kickoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOURNAMENTS EXPLORER */}
      <section style={{ padding: '2.5rem 0 3.5rem' }}>
        <div className="container">
          {/* Header & Filter Controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800 }}>Explore Tournaments</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Discover active registrations, ongoing knockout cups, and past champions
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', maxWidth: '640px', justifyContent: 'flex-start' }}>
              {/* Horizontally Scrollable Tabs on Mobile */}
              <div
                className="scroll-tabs"
                style={{
                  background: 'rgba(19, 14, 36, 0.85)',
                  padding: '0.3rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  maxWidth: '100%',
                }}
              >
                {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: filterTab === tab ? 'linear-gradient(180deg, #7c4df0 0%, #6030db 100%)' : 'transparent',
                      color: filterTab === tab ? '#ffffff' : 'var(--text-secondary)',
                      border: filterTab === tab ? '1px solid rgba(167, 139, 250, 0.35)' : '1px solid transparent',
                      boxShadow: filterTab === tab ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.3)' : 'none',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {tab === 'all' ? 'All Tournaments' : tab}
                  </button>
                ))}
              </div>


              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
                <Search
                  size={15}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Tournament Grid */}
          {filteredTournaments.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <Trophy size={44} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No tournaments found
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Try adjusting your search criteria or switch to another category tab.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: '1.5rem',
              }}
            >
              {filteredTournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

