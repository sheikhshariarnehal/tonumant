'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
  label?: string;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  compact = false,
  label = 'Tournament Starts In',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: compact ? '0.85rem' : '1rem' }}>
        <Clock size={16} /> Matches Live / In Progress
      </div>
    );
  }

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--accent-purple-light)',
          fontSize: '0.875rem',
          fontWeight: 700,
        }}
      >
        <Clock size={14} className="animate-pulse" />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {String(timeLeft.hours).padStart(2, '0')}h:
          {String(timeLeft.minutes).padStart(2, '0')}m:
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={timerBoxStyle}>
          <span style={timerDigitStyle}>{String(timeLeft.days).padStart(2, '0')}</span>
          <span style={timerUnitStyle}>DAYS</span>
        </div>
        <span style={timerSeparatorStyle}>:</span>
        <div style={timerBoxStyle}>
          <span style={timerDigitStyle}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span style={timerUnitStyle}>HOURS</span>
        </div>
        <span style={timerSeparatorStyle}>:</span>
        <div style={timerBoxStyle}>
          <span style={timerDigitStyle}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span style={timerUnitStyle}>MINS</span>
        </div>
        <span style={timerSeparatorStyle}>:</span>
        <div style={{ ...timerBoxStyle, borderColor: 'rgba(168, 85, 247, 0.6)' }}>
          <span style={{ ...timerDigitStyle, color: 'var(--accent-purple-light)' }}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span style={timerUnitStyle}>SECS</span>
        </div>
      </div>
    </div>
  );
};

const timerBoxStyle: React.CSSProperties = {
  background: 'rgba(15, 11, 28, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 'var(--radius-md)',
  padding: '0.5rem 0.4rem',
  minWidth: '0',
  flex: 1,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
};

const timerDigitStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
  fontWeight: 800,
  lineHeight: 1,
  color: 'var(--text-primary)',
};

const timerUnitStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
  marginTop: '0.3rem',
};

const timerSeparatorStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
  fontWeight: 700,
  color: 'var(--text-muted)',
  flexShrink: 0,
};

