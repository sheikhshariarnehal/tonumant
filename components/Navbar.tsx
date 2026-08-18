'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Bell, Shield, User, Menu, X, Sparkles, ChevronRight, Gamepad2 } from 'lucide-react';
import { useApp } from '@/lib/store';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, notifications, markNotificationRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
  }, [pathname]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(18, 15, 23, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <img
            src="/icon-tuna.webp"
            alt="eFootball Arena"
            style={{
              width: '38px',
              height: '38px',
              objectFit: 'contain',
              borderRadius: '0px',
              filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.65))',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              eFootball <span style={{ color: 'var(--accent-purple-light)', fontWeight: 800 }}>ARENA</span>
            </div>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'var(--accent-purple-light)',
                textTransform: 'uppercase',
              }}
            >
              Bangladesh Community
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only" style={{ alignItems: 'center', gap: '0.4rem' }}>
          <Link
            href="/"
            style={{
              ...navLinkStyle,
              background: pathname === '/' ? 'rgba(124, 77, 240, 0.14)' : 'transparent',
              color: pathname === '/' ? 'var(--accent-purple-soft)' : 'var(--text-secondary)',
              border: pathname === '/' ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent',
              boxShadow: pathname === '/' ? 'inset 0 1px 0 rgba(255, 255, 255, 0.05)' : 'none',
            }}
          >
            Tournaments
          </Link>
          <Link
            href="/my-tournaments"
            style={{
              ...navLinkStyle,
              background: pathname === '/my-tournaments' ? 'rgba(124, 77, 240, 0.14)' : 'transparent',
              color: pathname === '/my-tournaments' ? 'var(--accent-purple-soft)' : 'var(--text-secondary)',
              border: pathname === '/my-tournaments' ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent',
              boxShadow: pathname === '/my-tournaments' ? 'inset 0 1px 0 rgba(255, 255, 255, 0.05)' : 'none',
            }}
          >
            My Registrations
          </Link>
          {currentUser.role === 'manager' && (
            <Link
              href="/admin"
              style={{
                ...navLinkStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: pathname.startsWith('/admin') ? 'rgba(124, 77, 240, 0.2)' : 'rgba(124, 77, 240, 0.08)',
                color: pathname.startsWith('/admin') ? '#ffffff' : 'var(--accent-purple-light)',
                border: pathname.startsWith('/admin') ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid rgba(124, 77, 240, 0.2)',
                fontWeight: 700,
              }}
            >
              <Shield size={14} color="var(--accent-purple-light)" /> Manager Portal
            </Link>
          )}
        </nav>

        {/* Right Controls & Role / Auth Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Notification Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              style={{
                background: showNotifications ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: showNotifications ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                width: '36px',
                height: '36px',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showNotifications ? '#c084fc' : 'var(--text-primary)',
                position: 'relative',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    background: '#a855f7',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    borderRadius: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #07060e',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.7)',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown (Mobile Responsive) */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: 'min(330px, calc(100vw - 2rem))',
                  background: '#110c22',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '0px',
                  padding: '1rem',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.85), 0 0 25px rgba(168, 85, 247, 0.25)',
                  zIndex: 200,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c084fc' }}>
                    Notifications
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {notifications.length} alerts
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        style={{
                          background: n.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(168, 85, 247, 0.12)',
                          border: n.read ? '1px solid var(--border-subtle)' : '1px solid rgba(168, 85, 247, 0.35)',
                          borderRadius: '0px',
                          padding: '0.65rem',
                          cursor: 'pointer',
                        }}
                      >
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                          {n.message}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                          {new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Auth / Persona Control */}
          <div className="desktop-only">
            {currentUser.role === 'manager' ? (
              <Link
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.45)',
                  borderRadius: '0px',
                  color: '#c084fc',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Shield size={14} />
                <span>Manager Active</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                title="Sign in with Organizer Passkey"
              >
                <User size={14} />
                <span>Organizer Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-only"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (showNotifications) setShowNotifications(false);
            }}
            style={{
              background: mobileMenuOpen ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: mobileMenuOpen ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
              width: '36px',
              height: '36px',
              borderRadius: '0px',
              alignItems: 'center',
              justifyContent: 'center',
              color: mobileMenuOpen ? '#c084fc' : 'var(--text-primary)',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-only"
          style={{
            flexDirection: 'column',
            width: '100%',
            background: '#0d081c',
            borderBottom: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.85)',
            padding: '1rem',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '0px',
              background: pathname === '/' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              border: pathname === '/' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
              color: pathname === '/' ? '#c084fc' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Gamepad2 size={18} />
              <span>Tournaments Hub</span>
            </div>
            <ChevronRight size={16} />
          </Link>

          <Link
            href="/my-tournaments"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '0px',
              background: pathname === '/my-tournaments' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              border: pathname === '/my-tournaments' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
              color: pathname === '/my-tournaments' ? '#c084fc' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Trophy size={18} />
              <span>My Registrations & Rooms</span>
            </div>
            <ChevronRight size={16} />
          </Link>

          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '0px',
              background: pathname.startsWith('/admin') ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255, 255, 255, 0.02)',
              border: pathname.startsWith('/admin') ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
              color: currentUser.role === 'manager' ? '#c084fc' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Shield size={18} color="#a855f7" />
              <span>{currentUser.role === 'manager' ? 'Manager Portal (Active)' : 'Organizer Login'}</span>
            </div>
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  padding: '0.75rem 0.9rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
};


