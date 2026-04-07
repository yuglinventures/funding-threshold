# funding-threshold

> This project follows the Venture Pipeline system.
> For shared conventions and skills, see ~/ventures/CLAUDE.md

## Project Overview
- **Created**: 2026-03-31
- **Status**: Day 7 — Deployed. PostHog + Loops.so verified. Reddit organic blocked by spam filter; moving to Reddit Ads.
- **Live URL**: https://funding-threshold.vercel.app
- **Phase**: Week 2 (Marketing)

## Problem Statement
Groups of people regularly want to do something together — attend an event, fund a local project, book a venue, run a group buy — but organizers can't collect money or commitments until they know enough people are in. This chicken-and-egg problem means good ideas stall: people won't commit without knowing others will, and organizers can't move forward without commitments. There's no modern, lightweight tool for conditional group payments — where money is only collected once a critical threshold is reached — outside of GoFundMe (which lacks the threshold mechanic) or Kickstarter (which is too heavyweight for informal group coordination).

## Qualification Score
- Willingness to Pay: 4/5 (×3 = 12)
- Reachability: 4/5 (×3 = 12)
- Urgency: 3/5 (×2 = 6)
- Frequency: 3/5 (×2 = 6)
- Simplicity: 4/5 (×1 = 4)
- **Total: 40/55** (GO ≥ 38 | MAYBE 28-37 | KILL < 28) → **GO**

## Solution
Partiful-style shareable campaign page where participants pledge by authorizing a card hold. Money is only captured when the group hits its threshold by the deadline — otherwise all holds are released automatically. Social, frictionless, mobile-first.

**Key mechanic:** Stripe PaymentIntent with `capture_method: manual`. Card is authorized (held) but not charged until threshold is met.

**Closest prior art:** Tilt (Crowdtilt) — acquired by Airbnb in 2017 and shut down. Space has been vacated for 8 years. Cash App Pools (2025) is the nearest current competitor but has no threshold enforcement.

## Tech Stack
Inherits from ~/ventures/.claude/skills/tech-stack.md. Overrides:
- Stripe PaymentIntent with `capture_method: manual` (not standard billing/subscriptions)
- Supabase Storage for campaign cover photos (public bucket: `campaign-covers`)
- Vercel Cron for hourly deadline checking (`/api/cron/check-deadlines`)

## Routes
| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/new` | Create campaign form |
| `/c/[slug]` | Shareable campaign page (Partiful-style) |
| `/c/[slug]/success` | Post-pledge confirmation |
| `/api/campaigns` | POST: create campaign |
| `/api/pledges` | POST: create Stripe PaymentIntent + save pledge |
| `/api/cron/check-deadlines` | Vercel cron: capture or cancel on deadline |
| `/api/webhooks/stripe` | Stripe webhook handler |

## Database Tables (3 of 5 max)
- `campaigns` — slug, title, description, cover_image_url, amount_cents, threshold, deadline, organizer_email, organizer_name, manage_token, status
- `pledges` — campaign_id, participant_name, participant_email, stripe_payment_intent_id, status

## Build Order (Phase 1 — ~17 hours)
- [P1-1] Project setup + Supabase schema (1.5h)
- [P1-2] Stripe setup + PaymentIntent API + webhook (2h)
- [P1-3] Create campaign flow `/new` (2h)
- [P1-4] Campaign page — Partiful-style (3h)
- [P1-5] Pledge flow — Stripe Elements (2h)
- [P1-6] Vercel cron + threshold logic (2h)
- [P1-7] Loops.so emails (1.5h)
- [P1-8] Landing page + deploy (2h)
- [P1-9] Cover photo upload via Supabase Storage (1h)

## Kill Switch Thresholds
| Metric | Target | Kill If Below | Reasoning |
|---|---|---|---|
| Ad CTR | >1.5% | <0.8% | Discovery audience, not search intent |
| Landing Page CVR | >8% | <4% | Low-commitment free CTA |
| Cost per Lead | <$8 | >$20 | B2C, budget-sensitive |
| Campaigns Created | >10 in 14 days | <5 in 14 days | Real signal — not vanity signups |
| Pledge Conversion | >40% of viewers | <20% | Tests whether social mechanic works |

*These differ from defaults because traffic is discovery-driven (Reddit/social), not high-intent search. Campaigns created is the primary signal, not landing page CVR.*

## Decisions Log
| Date | Decision | Reasoning |
|------|----------|-----------|
| 2026-03-31 | Partiful-style UX over fintech-style | Social context (who's in, progress bar) drives pledges. Card auth is invisible infrastructure. |
| 2026-03-31 | No auth for MVP | Organizer gets private manage link via email. Reduces friction, sufficient for validation. |
| 2026-03-31 | No platform fee UI in Phase 1 | Validate conversion first; add fee in Phase 2 once demand is confirmed. |
| 2026-03-31 | Cron handles threshold capture | Simpler than real-time webhook math; Phase 2 adds immediate capture on Nth pledge. |
| 2026-04-05 | Built landing page before core product | Running fake-door test first to validate demand before building Supabase/Stripe backend. |
| 2026-04-05 | Used V0.dev for landing page generation | Faster than writing from scratch; V0 output was clean enough to integrate directly with minor modifications. |
| 2026-04-05 | Loops.so wired via Server Action | Keeps API call server-side; no API key exposed to client. `NEXT_PUBLIC_LOOPS_FORM_ID` is public (form ID only, not secret). |
| 2026-04-06 | Skipped Sentry DSN for now | Fake-door phase; app won't break without it. Add DSN to Vercel env vars if errors appear post-launch. |
| 2026-04-06 | Skip organic Reddit, go straight to paid ads | New account karma too low — posts blocked by spam filter. Reddit Ads bypass this entirely. |

## Known Issues
None.

## What's Next
1. Launch Reddit Ads ($50 budget) — 3 ad variations ready, target r/travel, r/camping, r/festivals
2. Collect metrics for 7–14 days against kill thresholds
3. Run `prompt-decision` once enough data collected
4. If GO: begin [P1-1] project setup (Supabase schema)
