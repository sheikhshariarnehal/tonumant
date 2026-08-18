'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Tournament, PaymentMethod } from '@/lib/types';
import { useApp } from '@/lib/store';
import {
  X,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  Smartphone,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

interface RegistrationModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  tournament,
  isOpen,
  onClose,
}) => {
  const { currentUser, submitRegistration } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);

  // Step 1 Fields
  const [userName, setUserName] = useState(currentUser.name || '');
  const [gamerTag, setGamerTag] = useState('');
  const [userEmail, setUserEmail] = useState(currentUser.email || '');
  const [senderNumber, setSenderNumber] = useState(currentUser.phone || '');
  const [step1Error, setStep1Error] = useState('');

  // Step 2 Fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [step2Error, setStep2Error] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getAccountNumber = (method: PaymentMethod) => {
    switch (method) {
      case 'bkash':
        return tournament.bkash_number || '01712-893421';
      case 'nagad':
        return tournament.nagad_number || '01844-592019';
      case 'rocket':
        return tournament.rocket_number || '01923-118844-2';
      default:
        return '01712-893421';
    }
  };

  const currentAccountNumber = getAccountNumber(paymentMethod);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentAccountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !gamerTag.trim() || !userEmail.trim() || !senderNumber.trim()) {
      setStep1Error('Please fill in all player and contact details.');
      return;
    }
    setStep1Error('');
    setStep(2);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setStep2Error('Please enter the Transaction ID (TrxID) from your SMS.');
      return;
    }
    if (transactionId.trim().length < 6) {
      setStep2Error('Transaction ID seems too short. Please verify.');
      return;
    }

    setStep2Error('');
    setIsSubmitting(true);

    try {
      submitRegistration({
        tournamentId: tournament.id,
        userName,
        userEmail,
        gamerTag,
        senderNumber,
        paymentMethod,
        transactionId,
        amount: tournament.entry_fee,
      });

      // Fire confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#3b82f6', '#10b981', '#f59e0b'],
      });

      setStep(3);
    } catch (err: any) {
      setStep2Error(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setTransactionId('');
    setStep1Error('');
    setStep2Error('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Tournament Registration
            </span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              {tournament.title}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Stepper Indicator */}
        {step !== 3 && (
          <div
            style={{
              display: 'flex',
              padding: '1rem 1.5rem 0.5rem',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: step >= 1 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '0px',
                  background: step >= 1 ? 'var(--accent-cyan)' : '#1e293b',
                  color: '#030712',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                1
              </div>
              <span>Player Info</span>
            </div>

            <div
              style={{
                width: '30px',
                height: '2px',
                background: step === 2 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
              }}
            />

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: step === 2 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '0px',
                  background: step === 2 ? 'var(--accent-cyan)' : '#1e293b',
                  color: step === 2 ? '#030712' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                2
              </div>
              <span>Mobile Banking</span>
            </div>
          </div>
        )}

        {/* STEP 1: PLAYER INFORMATION */}
        {step === 1 && (
          <form onSubmit={handleNextToPayment} style={{ padding: '1.5rem' }}>
            {step1Error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={16} /> {step1Error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Shakib Rahman"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                eFootball In-Game Username / Gamer ID *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Shakib_Striker7"
                value={gamerTag}
                onChange={(e) => setGamerTag(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (for tournament notifications) *</label>
              <input
                type="email"
                className="form-input"
                placeholder="player@domain.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Sender Mobile Number (used to send bKash/Nagad/Rocket) *
              </label>
              <input
                type="tel"
                className="form-input mono"
                placeholder="017XXXXXXXX"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Essential for the organizer to cross-check against their banking SMS.
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={resetAndClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <span>Proceed to Payment</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: MANUAL PAYMENT & TRXID */}
        {step === 2 && (
          <form onSubmit={handleSubmitPayment} style={{ padding: '1.5rem' }}>
            {step2Error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={16} /> {step2Error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Select Payment Method
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                }}
              >
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      paymentMethod === 'bkash'
                        ? '2px solid var(--color-bkash)'
                        : '1px solid var(--border-subtle)',
                    background:
                      paymentMethod === 'bkash'
                        ? 'rgba(226, 19, 110, 0.15)'
                        : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: paymentMethod === 'bkash' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: 'var(--color-bkash)', fontSize: '1.1rem', fontWeight: 800 }}>
                    bKash
                  </span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>Send Money</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      paymentMethod === 'nagad'
                        ? '2px solid var(--color-nagad)'
                        : '1px solid var(--border-subtle)',
                    background:
                      paymentMethod === 'nagad'
                        ? 'rgba(247, 148, 29, 0.15)'
                        : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: paymentMethod === 'nagad' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: 'var(--color-nagad)', fontSize: '1.1rem', fontWeight: 800 }}>
                    Nagad
                  </span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>Send Money</span>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      paymentMethod === 'rocket'
                        ? '2px solid var(--color-rocket)'
                        : '1px solid var(--border-subtle)',
                    background:
                      paymentMethod === 'rocket'
                        ? 'rgba(140, 52, 148, 0.15)'
                        : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: paymentMethod === 'rocket' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: '#c084fc', fontSize: '1.1rem', fontWeight: 800 }}>
                    Rocket
                  </span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>Personal</span>
                </button>
              </div>
            </div>

            {/* Account Box & One-tap Copy */}
            <div
              style={{
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Organizer {paymentMethod.toUpperCase()} Account (Personal)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  Fee: {tournament.entry_fee} BDT
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                  }}
                >
                  {currentAccountNumber}
                </span>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                </button>
              </div>

              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.775rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                1. Send <strong>{tournament.entry_fee} BDT</strong> via your {paymentMethod.toUpperCase()} app to the number above.
                <br />
                2. Copy the <strong>Transaction ID</strong> from confirmation SMS and paste below.
              </div>
            </div>

            {/* TrxID Input */}
            <div className="form-group">
              <label className="form-label">
                Transaction ID (TrxID) *
              </label>
              <input
                type="text"
                className="form-input mono"
                placeholder="e.g. 9J4K2L819Z"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                required
                style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Sending from: <strong>{senderNumber}</strong>
              </span>
            </div>

            {/* Direct Gateway Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}
            >
              <CreditCard size={14} />
              <span>Direct Card/Gateway checkout coming in Season 2. Manual mobile banking is active.</span>
            </div>

            {/* Form Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Sparkles size={16} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit & Join Tournament'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUBMISSION SUCCESS */}
        {step === 3 && (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '0px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--accent-emerald)',
                boxShadow: 'var(--glow-emerald)',
              }}
            >
              <ShieldCheck size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Registration Submitted!
            </h3>

            <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
              <span className="badge badge-pending">
                <Clock size={13} /> Status: Pending Verification
              </span>
            </div>

            <div
              style={{
                background: 'rgba(10, 16, 30, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                lineHeight: 1.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gamer Tag:</span>
                <span style={{ fontWeight: 700 }}>{gamerTag}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>TrxID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {transactionId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <span style={{ fontWeight: 700 }}>{tournament.entry_fee} BDT ({paymentMethod.toUpperCase()})</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              The tournament manager will verify your payment against SMS records shortly. Once verified, your status will turn to <strong>Confirmed</strong> and your match room code will unlock!
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={resetAndClose} className="btn btn-secondary">
                Close
              </button>
              <Link
                href="/my-tournaments"
                onClick={resetAndClose}
                className="btn btn-primary"
              >
                Go to My Registrations
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
