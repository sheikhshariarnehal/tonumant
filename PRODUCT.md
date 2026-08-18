# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14+ (App Router), React, Supabase (PostgreSQL / Auth / RLS), Vanilla CSS

## Users

- **Players:** Community eFootball players in Bangladesh who want to discover tournaments, register via a 2-step flow (info + mobile banking payment), view real-time countdowns, and track their verification & room access status.
- **Managers / Admins:** Tournament organizers who create and configure tournaments, verify or reject manual mobile banking payments (bKash, Rocket, Nagad), manage/seed players, lock/unlock tournament registrations, and issue shareable match/room codes.

## Product Purpose

Eliminate manual WhatsApp/Facebook group coordination and spreadsheet tracking for eFootball tournaments by providing a self-serve player registration, manual mobile payment verification pipeline, automated status notifications, and centralized manager dashboard.

## Positioning

A purpose-built web platform for competitive eFootball communities featuring local Bangladeshi mobile banking (bKash/Rocket/Nagad) verification, configurable tournament entry/prize rules, and real-time match room management.

## Operating Context

- **Geographic & Financial Context:** Bangladesh eFootball gaming community utilizing mobile financial services (bKash, Rocket, Nagad) for manual payment verification via Transaction ID (TrxID).
- **Communication Channels:** Transaction updates and pre-tournament reminders delivered via email notifications. External match coordination using shareable room codes.

## Capabilities and Constraints

- **MVP Functionality:**
  - Email-based user registration & login (Supabase Auth).
  - Public tournament discovery listing (Ongoing & Upcoming) with live reverse countdown timer.
  - Tournament detail view displaying prize breakdowns, entry fee, rules, and registration trigger.
  - 2-step player registration flow: Step 1 (Personal Info & Sender Phone), Step 2 (Mobile Banking Method & Manual TrxID submission).
  - Player dashboard showing registration history and verification statuses (`pending_verification`, `confirmed`, `rejected`).
  - Manager Admin Dashboard: Create/edit tournaments, review payment verification queue (verify/reject with reason), player seeding/management, lock/unlock registrations, share match codes.
  - Email notifications (`pending_verification`, `payment_verified`, `payment_rejected`, `reminder`).
- **Technical & Domain Constraints:**
  - Direct payment gateway is UI-only placeholder ("Coming soon") for MVP; Manual TrxID verification is fully functional.
  - In-house automated bracket progression and match score tracking are out of scope for MVP (organizers share room codes externally).
  - Prize payouts and refunds are tracked in-app but disbursed manually outside the app for MVP.
  - Scoped specifically to eFootball for MVP.

## Brand Commitments

- **Name:** eFootball Tournament Platform
- **Visual Identity Tone:** Energetic, competitive esports aesthetic, dark mode focus, precise status clarity.

## Evidence on Hand

- [eFootball_Tournament_Platform_PRD.md](file:///d:/Poject/tonumant/eFootball_Tournament_Platform_PRD.md) — Full Product Requirements Document detailing user flows, data schemas, functional specifications, and business rules.

## Product Principles

1. **Frictionless Registration:** Player registration and payment submission must take under 60 seconds with zero ambiguity on payment details.
2. **Transparent Verification:** Clear real-time status feedback for players and an auditable, fast queue for admin payment verifications.
3. **Esports Authenticity:** Sleek, modern visual polish tailored for gamers with live countdowns and high-contrast dark themes.
4. **Data Integrity & Security:** Protected role-based admin access and secure transaction logs using Supabase Row-Level Security.
