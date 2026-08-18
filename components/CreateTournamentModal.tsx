'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  X,
  PlusCircle,
  Trophy,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Check,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Sparkles,
} from 'lucide-react';

import { optimizeBannerImage } from '@/lib/image-utils';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COVERS = [
  {
    id: 'stadium',
    title: 'Arena Stadium',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cyber',
    title: 'Esports Neon',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pitch',
    title: 'Floodlight Pitch',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'trophy',
    title: 'Championship Cup',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createTournament, currentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState(
    '• Match Time: 10 mins\n• Extra Time: ON | Penalty Shootout: ON\n• Condition: Excellent\n• Screenshots required after full time.'
  );
  const [entryFee, setEntryFee] = useState(100);
  const [prizeChampion, setPrizeChampion] = useState(600);
  const [prizeRunnerup, setPrizeRunnerup] = useState(400);
  const [prize2ndRunnerup, setPrize2ndRunnerup] = useState(200);
  const [refundSemifinal, setRefundSemifinal] = useState(100);
  const [maxPlayers, setMaxPlayers] = useState(32);
  const [startDate, setStartDate] = useState('');
  const [bkashNumber, setBkashNumber] = useState('01712-893421');
  const [nagadNumber, setNagadNumber] = useState('01844-592019');
  const [rocketNumber, setRocketNumber] = useState('01923-118844-2');
  const [tournamentCode, setTournamentCode] = useState('EF-BD-' + Math.floor(1000 + Math.random() * 9000));
  
  // Cover Banner Image State
  const [bannerUrl, setBannerUrl] = useState(PRESET_COVERS[0].url);
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const optimizedUrl = await optimizeBannerImage(file);
        setBannerUrl(optimizedUrl);
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setBannerUrl(customUrlInput.trim());
      setIsCustomUrlOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startIso = startDate
      ? new Date(startDate).toISOString()
      : new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();

    const deadlineIso = new Date(new Date(startIso).getTime() - 1000 * 60 * 60 * 6).toISOString();

    await createTournament({
      title: title.trim(),
      description: description.trim(),
      rules: rules.trim(),
      entry_fee: Number(entryFee),
      prize_champion: Number(prizeChampion),
      prize_runnerup: Number(prizeRunnerup),
      prize_2nd_runnerup: Number(prize2ndRunnerup),
      refund_semifinal: Number(refundSemifinal),
      max_players: Number(maxPlayers),
      start_time: startIso,
      registration_deadline: deadlineIso,
      status: 'upcoming',
      tournament_code: tournamentCode.trim(),
      banner_url: bannerUrl,
      bkash_number: bkashNumber.trim(),
      nagad_number: nagadNumber.trim(),
      rocket_number: rocketNumber.trim(),
      created_by: currentUser.id,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '660px' }}
      >
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '0px',
                background: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Create New Tournament</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Configure cover image, rules, prize pool, schedule, and mobile banking accounts
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '0px',
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

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* TOURNAMENT COVER IMAGE UPLOAD & PREVIEW SECTION */}
          <div
            style={{
              background: 'rgba(10, 16, 30, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ImageIcon size={15} /> Tournament Cover / Banner Image
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Displayed on Homepage & Tournament Detail
              </span>
            </div>

            {/* Live Banner Preview Box */}
            <div
              style={{
                height: '140px',
                width: '100%',
                backgroundImage: `linear-gradient(180deg, rgba(6, 9, 14, 0.3) 0%, rgba(13, 21, 39, 0.9) 100%), url(${bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '0.85rem',
                position: 'relative',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span
                  style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: 700,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Live Cover Preview
                </span>

                {/* Upload & Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Upload size={13} />
                    <span>Upload Custom Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCustomUrlOpen(!isCustomUrlOpen)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <LinkIcon size={13} />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom URL Input Accordion */}
            {isCustomUrlOpen && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Paste direct image link (e.g. https://...)"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="btn btn-primary btn-sm"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Curated Presets Bar */}
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Or select from curated eFootball covers:
              </span>
              {/* Preset Covers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))', gap: '0.5rem' }}>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setBannerUrl(preset.url)}
                    style={{
                      height: '46px',
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${preset.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: bannerUrl === preset.url ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      borderRadius: '0px',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.2rem',
                      textAlign: 'center',
                      boxShadow: bannerUrl === preset.url ? 'var(--glow-cyan)' : 'none',
                    }}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tournament Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bangladesh eFootball Super Cup 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Short summary of format, eligibility, and game edition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Grid for Entry Fee & Max Players */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Entry Fee (BDT) *</label>
              <input
                type="number"
                className="form-input mono"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                min={0}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Player Slots *</label>
              <select
                className="form-select"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              >
                <option value={16}>16 Players (Knockout)</option>
                <option value={32}>32 Players (Standard)</option>
                <option value={64}>64 Players (Grand Championship)</option>
              </select>
            </div>
          </div>

          {/* Prize Breakdown */}
          <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <Trophy size={14} /> Prize Pool Distribution (BDT)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 105px), 1fr))', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Champion</label>
                <input
                  type="number"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={prizeChampion}
                  onChange={(e) => setPrizeChampion(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Runner-up</label>
                <input
                  type="number"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={prizeRunnerup}
                  onChange={(e) => setPrizeRunnerup(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2nd Runner-up</label>
                <input
                  type="number"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={prize2ndRunnerup}
                  onChange={(e) => setPrize2ndRunnerup(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Semifinal Refund</label>
                <input
                  type="number"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={refundSemifinal}
                  onChange={(e) => setRefundSemifinal(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule & Match Code */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tournament Start Date/Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shareable Match/Room Code</label>
              <input
                type="text"
                className="form-input mono"
                value={tournamentCode}
                onChange={(e) => setTournamentCode(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Organizer Mobile Banking Accounts */}
          <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.75rem' }}>
              Organizer Mobile Banking Accounts (Players send fees here)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--color-bkash)' }}>bKash Number</label>
                <input
                  type="text"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--color-nagad)' }}>Nagad Number</label>
                <input
                  type="text"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#c084fc' }}>Rocket Number</label>
                <input
                  type="text"
                  className="form-input mono"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  value={rocketNumber}
                  onChange={(e) => setRocketNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>




          {/* Rules */}
          <div className="form-group">
            <label className="form-label">Rules & Match Regulations</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Publish Tournament</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
