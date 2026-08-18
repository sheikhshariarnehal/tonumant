# Product Requirements Document
## eFootball Tournament Platform

**Version:** 1.0
**Date:** August 18, 2026
**Status:** Draft for review
**Database:** Supabase (PostgreSQL)

---

## 1. Overview

A web platform for organizing and running eFootball tournaments. Players discover tournaments, register through a two-step flow (personal info, then payment), and pay their entry fee via Bangladeshi mobile banking (bKash, Rocket, Nagad). Tournament managers create and run tournaments, verify payments, seed/assign players, and control tournament state (lock/unlock) from an admin panel.

### 1.1 Problem Statement
Running community eFootball tournaments manually (via WhatsApp/Facebook groups + spreadsheets) is error-prone for tracking payments, hard to scale, and gives players no self-serve way to register, pay, or track tournament status.

### 1.2 Goals
- Let players register and pay entry fees online without back-and-forth messaging.
- Give organizers a single dashboard to manage tournaments, verify payments, and manage players.
- Keep players informed automatically (email notifications, live countdown, tournament status).

### 1.3 Non-Goals (for MVP)
- Live match score tracking / automated bracket progression.
- In-house payment gateway processing (direct payment is UI-only for now — see §7.2).
- Multi-game support (platform is scoped to eFootball only for MVP).

---

## 2. User Roles

| Role | Description |
|---|---|
| **Player** | Registers for tournaments, submits payment, views tournament status. |
| **Manager/Admin** | Creates and manages tournaments, verifies manual payments, manages players, locks/unlocks tournaments, shares match codes. |

---

## 3. Tournament Structure & Prize Rules

Default rule set (should be configurable per tournament by the manager, with these as defaults):

| Placement | Reward |
|---|---|
| Champion | 600 BDT |
| Runner-up | 400 BDT |
| 2nd Runner-up | 200 BDT |
| Semifinal Qualifier | Entry fee refunded (100 BDT) |

- **Entry fee:** 100 BDT (default; configurable per tournament).
- Prize payout and refunds are recorded/tracked in the platform but disbursed manually by the manager outside the app (via mobile banking) for MVP — see §11 Future Scope for automation.

---

## 4. Registration Flow

Registration is a **2-step form**:

### Step 1 — Information
- Name
- Email

> **Open question:** Should a phone number also be captured at this step? It would help manually match manual-payment transactions to a registrant (since bKash/Nagad/Rocket transactions are tied to a sender phone number). Recommended: add "Sender/Contact Number" as a required field. Flagged as an assumption to confirm.

### Step 2 — Payment
1. Player selects a payment method: **bKash / Rocket / Nagad**
2. Player selects a payment type:
   - **Direct** — *(future scope)* would redirect to a live payment gateway/API. For MVP, this option is shown in the UI (e.g., labeled "Coming soon") but is non-functional.
   - **Manual** — *(MVP — fully functional)*:
     - Platform displays the organizer's account number for the selected method (bKash/Rocket/Nagad), along with the exact amount due.
     - Player sends the money via their own mobile banking app.
     - Player enters the **Transaction ID (TrxID)** (and ideally the sending number) into the form.
     - Player clicks **Submit**.
3. On submit, registration is created with status `pending_verification`.
4. Manager reviews the submitted TrxID against their banking app/SMS and marks it **Verified** or **Rejected** from the admin panel.
5. Player receives an email once the payment is verified (registration confirmed) or rejected (with reason, and an option to resubmit).

**Registration status lifecycle:**
`pending_payment` → `pending_verification` → `confirmed` (or `rejected` → resubmit allowed)

---

## 5. Functional Requirements

| # | Requirement | Detail |
|---|---|---|
| 1 | Email notifications | Sent before tournament starts (reminder), on registration submission, on payment verified/rejected. |
| 2 | Payment gateway | Manual (bKash/Rocket/Nagad) fully functional for MVP; Direct is a UI placeholder for future integration. |
| 3 | Player accounts | Sign-up/login (email-based), profile with registration history and current status per tournament. |
| 4 | Reverse countdown | Live countdown to tournament start time, shown on the tournament detail page. |
| 5 | Tournament listing | Players can browse **Ongoing** and **Upcoming** tournaments (Completed/Past recommended as an addition for history). |
| 6 | Tournament detail page | Clicking a tournament shows its rules and an **Entry/Register** button. |
| 7 | Manager capabilities | Manage tournament (create/edit), assign players, share tournament/match code, manage players (view/verify/reject/remove), lock/unlock tournament registration. |

---

## 6. Non-Functional Requirements

- **Security:** Admin routes protected by role-based auth; payment/transaction data access-restricted (see RLS notes in §8).
- **Reliability:** Payment verification queue must not lose or duplicate submissions under concurrent registrations.
- **Auditability:** Every payment status change (verify/reject) should be logged with which admin acted and when.
- **Data privacy:** Store only necessary personal data (name, email, phone, transaction reference); no card/banking credentials are ever stored, only the TrxID.

---

## 7. Payment System Detail

### 7.1 Manual Payment (MVP)
- Organizer configures a receiving account number per method (bKash / Rocket / Nagad) — ideally configurable per tournament or globally in admin settings.
- Player-facing form fields: Payment Method (select), Sender Number, Transaction ID, Amount (pre-filled, read-only).
- Verification is manual: admin cross-checks TrxID against their own banking app/SMS notification, then approves or rejects in the dashboard.

### 7.2 Direct Payment (Future Scope)
- UI-only for MVP (button visible, disabled or labeled "Coming soon").
- Future integration candidates: bKash/Nagad merchant APIs, or a local aggregator (e.g., SSLCommerz, ShurjoPay) that supports bKash/Rocket/Nagad under one integration.

---

## 8. Database Schema (Supabase / PostgreSQL)

### `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | matches `auth.users.id` |
| name | text | |
| email | text | unique |
| phone | text | nullable (see open question §4) |
| created_at | timestamptz | default now() |

### `tournaments`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| title | text | |
| description | text | |
| rules | text | |
| entry_fee | numeric | default 100 |
| prize_champion | numeric | default 600 |
| prize_runnerup | numeric | default 400 |
| prize_2nd_runnerup | numeric | default 200 |
| refund_semifinal | numeric | default 100 |
| max_players | int | |
| start_time | timestamptz | drives the countdown |
| registration_deadline | timestamptz | |
| status | enum | `upcoming`, `ongoing`, `completed`, `locked` |
| tournament_code | text | shareable match/room code |
| created_by | uuid, FK → users.id | manager who created it |
| created_at | timestamptz | |

### `registrations`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| tournament_id | uuid, FK → tournaments.id | |
| status | enum | `pending_payment`, `pending_verification`, `confirmed`, `rejected` |
| registered_at | timestamptz | |

### `payments`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| registration_id | uuid, FK → registrations.id | |
| method | enum | `bkash`, `rocket`, `nagad` |
| type | enum | `manual`, `direct` |
| sender_number | text | |
| transaction_id | text | |
| amount | numeric | |
| status | enum | `pending`, `verified`, `rejected` |
| verified_by | uuid, FK → users.id | nullable, admin who reviewed it |
| verified_at | timestamptz | nullable |
| created_at | timestamptz | |

### `notifications`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| type | enum | `reminder`, `registration_received`, `payment_verified`, `payment_rejected` |
| message | text | |
| sent_at | timestamptz | |
| status | enum | `sent`, `failed`, `pending` |

### `admins`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| role | enum | `manager`, `superadmin` |

**Row Level Security (RLS) notes:**
- Players can only `SELECT`/`INSERT` their own rows in `registrations` and `payments`.
- Only rows in `admins` (via `user_id = auth.uid()`) can `UPDATE` `payments.status` or `tournaments`.
- `tournaments` table is publicly readable (for the listing page) but only admin-writable.

---

## 9. Key User Flows

**Player:**
Browse tournaments → open tournament detail (rules + countdown) → click Register → fill Step 1 (info) → fill Step 2 (select method + manual payment, enter TrxID) → submit → status shows "Pending Verification" → receive email once confirmed → see live countdown → receive reminder email before start.

**Manager:**
Log in to admin dashboard → create tournament (set entry fee, prizes, rules, schedule) → monitor incoming registrations → review payment queue, verify/reject each TrxID → assign/seed players → share tournament/match code with confirmed players → lock tournament once it starts → mark it completed and record final standings.

---

## 10. Screens (High-Level)

1. Home — tournament list (Ongoing / Upcoming tabs)
2. Tournament Detail — rules, prize breakdown, countdown, Register button
3. Registration Step 1 — Info form
4. Registration Step 2 — Payment method + manual payment form
5. Registration Status / Confirmation page
6. Player Dashboard — my registrations & statuses
7. Admin Dashboard — tournament list/management
8. Admin Payment Verification Queue
9. Admin Player Management (per tournament)

---

## 11. MVP Scope vs. Future Scope

**MVP (build now):**
- Player accounts (email-based)
- Tournament listing (ongoing/upcoming) + detail page with rules & countdown
- 2-step registration with manual payment (bKash/Rocket/Nagad) + TrxID submission
- Admin: create/edit tournaments, verify/reject payments, manage/assign players, share code, lock/unlock
- Email notifications (registration received, verified/rejected, pre-start reminder)

**Future:**
- Direct/live payment gateway integration
- Automated bracket generation & match result tracking
- Push notifications (in addition to email)
- Player stats/leaderboard across tournaments
- Multi-game support beyond eFootball

---

## 12. Open Questions & Assumptions

1. Should the entry fee/prize pool be fixed platform-wide or configurable per tournament? *(Assumed: configurable per tournament, defaulting to the values given.)*
2. Should phone number be collected at Step 1 to make manual TrxID matching easier? *(Recommended: yes.)*
3. Is match/bracket management handled inside the platform, or externally (e.g., organizer shares a match code and coordinates rounds via chat)? *(Assumed: external/manual for MVP — "share code" suggests a match-room code shared with players, not an in-app bracket engine.)*
4. Are prize payouts and semifinal refunds disbursed manually by the manager outside the platform, with the app only tracking status? *(Assumed: yes for MVP.)*

---

## 13. Success Metrics

- Number of completed (confirmed) registrations per tournament
- Average time from payment submission to verification
- Tournament fill rate (registrations vs. max_players)
- Player repeat-registration rate across tournaments
