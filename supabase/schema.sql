-- eFootball Tournament Platform - Supabase / PostgreSQL Schema

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enum Types
CREATE TYPE tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'locked');
CREATE TYPE registration_status AS ENUM ('pending_payment', 'pending_verification', 'confirmed', 'rejected');
CREATE TYPE payment_method AS ENUM ('bkash', 'rocket', 'nagad');
CREATE TYPE payment_type AS ENUM ('manual', 'direct');
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE notification_type AS ENUM ('reminder', 'registration_received', 'payment_verified', 'payment_rejected');
CREATE TYPE notification_status AS ENUM ('sent', 'failed', 'pending');
CREATE TYPE admin_role AS ENUM ('manager', 'superadmin');

-- 3. Users Table (Synchronized with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  entry_fee NUMERIC NOT NULL DEFAULT 100,
  prize_champion NUMERIC NOT NULL DEFAULT 600,
  prize_runnerup NUMERIC NOT NULL DEFAULT 400,
  prize_2nd_runnerup NUMERIC NOT NULL DEFAULT 200,
  refund_semifinal NUMERIC NOT NULL DEFAULT 100,
  max_players INT NOT NULL DEFAULT 32,
  start_time TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  status tournament_status NOT NULL DEFAULT 'upcoming',
  tournament_code TEXT,
  banner_url TEXT,
  bkash_number TEXT DEFAULT '01712-345678',
  nagad_number TEXT DEFAULT '01812-345678',
  rocket_number TEXT DEFAULT '01912-345678-0',
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  gamer_tag TEXT NOT NULL,
  sender_number TEXT NOT NULL,
  status registration_status NOT NULL DEFAULT 'pending_verification',
  seed_number INT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_tournament UNIQUE (user_id, tournament_id)
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  method payment_method NOT NULL DEFAULT 'bkash',
  type payment_type NOT NULL DEFAULT 'manual',
  sender_number TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL DEFAULT 100,
  status payment_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status notification_status NOT NULL DEFAULT 'sent'
);

-- 8. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'manager'
);

-- 9. Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Tournaments: Readable by everyone, writeable only by admins
CREATE POLICY "Tournaments are publicly readable" ON public.tournaments
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert/update tournaments" ON public.tournaments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- Registrations: Users can select/insert their own; Admins can select/update all
CREATE POLICY "Users can view their own registrations" ON public.registrations
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create registrations" ON public.registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update registrations" ON public.registrations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- Payments: Users can select/insert their own payments; Admins can verify/reject
CREATE POLICY "Users can view their payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.registrations
      WHERE registrations.id = payments.registration_id
      AND registrations.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can submit payment" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registrations
      WHERE registrations.id = payments.registration_id
      AND registrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update payment status" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
  );

-- Seed Initial Tournaments Data
INSERT INTO public.tournaments (
  id, title, description, rules, entry_fee, prize_champion, prize_runnerup, prize_2nd_runnerup, refund_semifinal, max_players, start_time, registration_deadline, status, tournament_code, bkash_number, nagad_number, rocket_number
) VALUES
(
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'eFootball Bangladesh Championship: Season 1',
  'The flagship community tournament for top eFootball mobile and console tacticians across Bangladesh. Compete for the grand prize and community glory.',
  'Match Time: 10 mins (Authentic/Dream Team).\nExtra Time: ON, PK: ON.\nCondition: Excellent.\nNo lag switching or disconnection cheating.\nScreenshots of final score required.',
  100, 600, 400, 200, 100, 32,
  NOW() + INTERVAL '2 days 6 hours',
  NOW() + INTERVAL '1 day 18 hours',
  'upcoming',
  'EF-BD-9402',
  '01712-893421',
  '01844-592019',
  '01923-118844-2'
),
(
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'Dhaka Masters: Quick Knockout Cup',
  'Fast-paced single elimination knockout cup. Limited 16 slots. High intensity matches with immediate payout recognition.',
  'Match Time: 8 mins.\nExtra Time: ON, PK: ON.\nInjuries: OFF.\nSubstitutions: 5.\nFair play mandatory.',
  100, 600, 400, 200, 100, 16,
  NOW() + INTERVAL '18 hours 30 minutes',
  NOW() + INTERVAL '12 hours',
  'upcoming',
  'DK-KO-7731',
  '01712-893421',
  '01844-592019',
  '01923-118844-2'
),
(
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'eFootball Pro League - Week 3',
  'Weekly competitive series currently underway. Live match rooms open for participating players.',
  'Standard Konami Competitive Rules.\nFormat: Double Elimination.\nRoom Codes shared via match portal.',
  100, 600, 400, 200, 100, 32,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '2 days',
  'ongoing',
  'EPL-W3-5501',
  '01712-893421',
  '01844-592019',
  '01923-118844-2'
);
