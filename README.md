# Kshetra

**The Event's Nervous System**  
*Every attendee, a personal route. Every incident, a timed fix.*

Kshetra is a real-time spatial operational web platform for large-scale conferences, conventions, and public gatherings. It closes the feedback loop between ground-level attendee experiences and facility operations command. Instead of unmonitored crowd surges or lost complaints in messaging channels, Kshetra aggregates 1-tap friction signals into correlated incident cards, directs staff interventions against an active timer, recomputes venue flow dynamically, and audits every physical resolution into an immutable Barrier Ledger.

---

## Operational Architecture

Kshetra operates on a closed-loop dispatch model:

1. **Detection**: Attendees flag physical or sensory friction (blocked paths, queue spillover, accessibility barriers, medical needs) in under 5 seconds.
2. **Correlation & Classification**: Signals submitted within the same zone, category, and a 15-minute rolling window merge into a single incident card (`PO-XXXX`), incrementing the affected attendee count and calculating confidence thresholds.
3. **Dispatch & Triage**: Operations staff receive prioritized incident cards with live stopwatches, recommended protocols, and one-click marshal assignment.
4. **Resolution & Verification**: When staff resolve an obstruction, the system recomputes the zone status (e.g., Red to Green), logs the resolution time delta to the Barrier Ledger, and updates attendee route guidance in real time.

---

## Core System Modules

### 1. Attendee Portal

- **Route DNA Personalization**:
  Attendees select navigation profiles tailored to their access needs:
  - *Mobility-Friendly*: Enforces step-free access, ramps, and elevator routing; automatically reroutes around reported incline obstructions.
  - *Low-Sensory*: Prioritizes acoustic buffers (< 42 dB ambient noise) and bypasses crowded dining or demo zones.
  - *Fast / Shortest Path*: Direct geometric navigation for tight session transitions.
  - *Safety-First*: Routes exclusively through illuminated, staffed main arteries.
  Changing Route DNA immediately recalculates facility walk times and session suitability across the entire application.

- **5-Second Friction Reporting**:
  A streamlined 3-step submission interface (Category -> Zone -> Optional Note/Photo) that generates an authenticated ticket ID (`PO-XXXX`) and provides visual confirmation without cognitive overhead.

- **2D Architectural Venue Map**:
  An interactive SVG floorplan visualizing real-time zone congestion and access status using strict four-color status tokens (Green: Nominal, Yellow: Moderate, Orange: High Crowd, Red: Blocked). Room strokes, wait times, and reason strings update directly from the persistent incident store.

- **Transparent Session Recommendations**:
  Sessions are dynamically evaluated and ranked using a transparent weighted scoring algorithm:
  ```
  Score = 0.45 * Interest + 0.25 * Accessibility + 0.15 * TimeWalk + 0.15 * CrowdFlow
  ```
  Each session card displays its normalized 0–1 sub-scores, percentage breakdowns, and an explicit plain-language rationale.

- **Quiet Sanctuary Routing**:
  A single contextual trigger calculates the fastest route to verified acoustic decompression spaces (< 38 dB), comparing walking distance and sensory exposure against direct crowded pathways.

- **Three-Tier Safety & Emergency Protocols**:
  - *Tier 1 (Guidance)*: Dynamic directory of medical tents, quiet sanctuaries, and help desks with walk times computed for the user's active Route DNA.
  - *Tier 2 (Private Assistance)*: Confidential dispatch for mobility escorts, medical aid, or personal safety. Requests route exclusively to the organizer triage screen and are hidden from all public feeds.
  - *Tier 3 (Escalation)*: Confirmed access to cached offline emergency contact numbers (venue medical lead, command desk, public services) that remain accessible during complete network disconnections.

---

### 2. Organizer Operations Command Center

- **Live Incident Triage Feed**:
  Incident cards display issue category, exact zone, live ticking detection stopwatches, affected attendee volume, confidence level (Low: 1–2 reports, Medium: 3–5 reports, High: 6+ reports or staff verified), and recommended operational actions.

- **Staff Task Dispatch**:
  Real-time assignment of pre-approved operations staff (Accessibility Lead, Security Marshal, Facilities Manager, Medical Lead) with active state tracking (`available`, `assigned`, `on_break`).

- **Verify-Loop Execution**:
  Resolving an incident requires a documented action note, updates the affected zone's capacity status, calculates the duration delta (e.g., "Reduced from RED to GREEN in 4 min"), and logs the complete audit entry to the Barrier Ledger.

- **Time-Series Signal Volume Trends**:
  Responsive data visualization powered by Recharts plotting real report volume across 10-minute buckets over rolling 50-minute periods to identify queue backlogs before corridor gridlock occurs.

- **Immutable Barrier Ledger**:
  Comprehensive post-event compliance and audit table displaying Ticket ID, issue title, zone, timestamps (detection, acknowledgement, resolution), resolution duration, staff officer, and delta metrics. Features client-side CSV and JSON data export.

---

## Security, Access Control, and Persistence

- **Role-Based Authentication**:
  - *Attendee Access*: Check-in via name and event pass code (`MFC-2026`). Persists session to local storage.
  - *Organizer Access*: Authenticated email and password verification against a directory of authorized event staff, featuring quick-fill profiles for evaluation.
  - *Route Protection*: Strict boundaries ensure attendees cannot inspect operational command views, and unauthenticated sessions remain on the public landing page.
- **Data Persistence**:
  All entities (zones, facilities, sessions, reports, incidents, staff, barrier ledger, preferences, and authentication sessions) are persisted using Firestore-ready data structures backed by browser local storage. Changes survive full browser reloads and restarts.
- **Offline Reliability Layer**:
  The application monitors `navigator.onLine` and updates a real-time connectivity status indicator. Critical life-safety data, emergency phone numbers, and cached zone floorplans remain functional during cellular congestion or venue Wi-Fi failure.

---

## Design System & Accessibility Standards

- **Minimalist Aesthetic**: Flat 1px borders, zero box shadows, zero decorative gradients, and zero background blurs.
- **Color Discipline**: Neutral monochrome base (near-black, near-white, and neutral grays). Status colors (Green `#16a34a`, Yellow `#ca8a04`, Orange `#ea580c`, Red `#dc2626`) appear exclusively as 3px left-border accents or status indicator dots on data surfaces.
- **Typography**: Display serif (Newsreader) for editorial headlines; clean system sans-serif (Inter / system-ui) for interface controls; monospace (JetBrains Mono) reserved strictly for numeric data, ticket identifiers, timestamps, and acoustic measurements.
- **Accessibility & Responsiveness**:
  - Touch targets meet or exceed 44px x 44px.
  - Full keyboard accessibility with visible focus rings across interactive elements (`Tab`, `Enter`, `Escape`).
  - Tested and verified at 375px viewport widths with zero horizontal overflow.
  - Dark mode supported with automatic persistence and system preference detection.

---

## Technical Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Iconography**: Lucide React
- **Verification**: Node.js automated test harness

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd promptwars
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://127.0.0.1:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## Verification & Automated Testing

A dedicated test suite validates data models, algorithmic recommendations, report merging logic, and offline safety layers:

```bash
node test_kshetra.js
```

### Test Coverage

- **Ticket Generation**: Validates `PO-XXXX` format stability across random distributions.
- **Route DNA Calibration**: Verifies mathematical variation of session recommendations across all four profiles.
- **Facility Walk Time Computation**: Ensures dynamic detour logic is enforced when physical obstacles are detected.
- **Report Merging & Zone Aggregation**: Validates that reports submitted to the same zone within the rolling time window increment affected counts without creating duplicate incident cards.
- **Barrier Ledger Verify-Loop**: Confirms resolution duration formatting and zone status transition logging.
- **Offline Cache Integrity**: Asserts availability of life-safety contact numbers and emergency locations under offline conditions.

---

## Demo Accounts (Organizer Desk)

For evaluation, the following pre-approved organizer credentials may be used, or selected directly via 1-click fill in the login modal:

| Name | Role | Email | Password |
|---|---|---|---|
| Anita Roy | Accessibility Lead | anita@mumbaifuture.org | ops |
| Rajesh Kadam | Security & Crowd Marshal | rajesh@mumbaifuture.org | ops |
| Priya Sharma | Facilities Manager | priya@mumbaifuture.org | ops |
| Dr. David Pinto | Medical Lead | david@mumbaifuture.org | ops |
| Command Officer | Operations Director | admin@kshetra.io | admin |

Attendee access can be initiated using any attendee name with pass code `MFC-2026`.
