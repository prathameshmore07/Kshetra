import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusDot, getStatusBorderClass } from '../common/StatusIndicator';
import {
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Compass,
  AlertTriangle,
  Building,
  Check,
  Send,
  UserCheck,
} from 'lucide-react';

export function LandingPage() {
  const { openLogin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Interactive demo zone selector for hero map preview
  const [activeZoneKey, setActiveZoneKey] = useState('ramp-west');

  const demoZones = {
    'ramp-west': {
      name: 'Ramp 2 West',
      status: 'red',
      tag: 'Accessibility Issue',
      reportCount: 2,
      reason: 'Red: Unloading crate blocking wheelchair ramp',
      action: 'Deploy Anita Roy (Accessibility Lead) to clear path',
      waitTime: 'Blocked',
    },
    'food-court': {
      name: 'Food Court',
      status: 'orange',
      tag: 'Crowded Zone',
      reportCount: 18,
      reason: 'Orange: 18 reports in 8 min (queue spillover into walkway)',
      action: 'Dispatch Rajesh Kadam to deploy stanchions at Chai counter',
      waitTime: '18m wait',
    },
    'quiet-room': {
      name: 'Quiet Room',
      status: 'green',
      tag: 'Sensory Sanctuary',
      reportCount: 0,
      reason: 'Green: Calm sensory sanctuary, noise < 38 dB',
      action: 'Nominal flow — whisper quiet operating condition',
      waitTime: '0m wait',
    },
    'main-stage': {
      name: 'Main Stage',
      status: 'green',
      tag: 'Auditorium',
      reportCount: 0,
      reason: 'Green: Flow optimal, seating capacity at 62%',
      action: 'Door scan rate < 8s, 0 queue delay',
      waitTime: '0m wait',
    },
  };

  const selectedZone = demoZones[activeZoneKey];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* 1. NAV (Strict caveman: logo once, event name, sign-in buttons, dark toggle) */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-sm text-zinc-900 dark:text-zinc-100">
              Kshetra
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Mumbai Future Commons 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="p-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-300 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            <button
              onClick={() => openLogin('attendee')}
              className="px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] flex items-center justify-center font-medium"
            >
              Attendee Sign-In
            </button>

            <button
              onClick={() => openLogin('organizer')}
              className="px-3.5 py-2 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 min-h-[44px] flex items-center justify-center"
            >
              Organizer Desk
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO: ASYMMETRIC SPLIT (Left: Plain headline + subtext + CTAs | Right: Actual interactive map card) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: What it does (No vibes, no buzzwords) */}
          <div className="lg:col-span-6 space-y-4">
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Attendees flag venue friction. Organizers resolve it against a timer.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              A blocked wheelchair ramp re-routes mobility attendees immediately and alerts marshals with an assigned ticket.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => openLogin('attendee')}
                className="px-5 py-3 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <span>Attendee Check-In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openLogin('organizer')}
                className="px-5 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <span>Organizer Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Proof Line */}
            <div className="pt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Building className="w-3.5 h-3.5 shrink-0" />
              <span>Currently powering: <strong>Mumbai Future Commons 2026</strong> (Jio World Convention Centre, BKC)</span>
            </div>
          </div>

          {/* Right: Actual Mini-Preview of Venue Map w/ Status Colors */}
          <div className="lg:col-span-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                Venue Map Mini-Preview (Tap room to inspect)
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1"><StatusDot status="green" /> Green</span>
                <span className="flex items-center gap-1"><StatusDot status="orange" /> Orange</span>
                <span className="flex items-center gap-1"><StatusDot status="red" /> Red</span>
              </div>
            </div>

            {/* Real 4-Room Grid with Real Statuses */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(demoZones).map(([key, zone]) => {
                const isSelected = activeZoneKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveZoneKey(key)}
                    className={`p-2.5 text-left border transition-colors min-h-[48px] ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {zone.name}
                      </span>
                      <StatusDot status={zone.status} />
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                      {zone.status.toUpperCase()} • {zone.waitTime}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Zone Inspection Output */}
            <div className={`p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 ${getStatusBorderClass(selectedZone.status)} space-y-1.5`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedZone.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase">
                  {selectedZone.tag}
                </span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed">
                "{selectedZone.reason}"
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-700/60">
                Action: {selectedZone.action}
              </p>
            </div>
          </div>
        </section>

        {/* 3. BELOW THE FOLD: SHOW THE PRODUCT (Actual UI screens in sequence, NO 2x2 icon cards) */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-10">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-zinc-400">
              The 4-Step Operational Sequence
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              From attendee signal to verified ledger entry
            </h2>
          </div>

          <div className="space-y-6">
            {/* STEP 1: The 1-Tap Friction Report UI */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-zinc-500">01</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    1-Tap Friction Signal (Attendee UI)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  Attendee taps "Accessibility Issue" on Ramp 2 West. Ticket generated in under 5 seconds.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs pt-1">
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                  Blocked Path
                </div>
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                  Long Queue
                </div>
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                  Crowded Zone
                </div>
                <div className="p-2 border border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-center font-semibold">
                  ✓ Accessibility
                </div>
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                  Lost / Direction
                </div>
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                  Medical Aid
                </div>
              </div>

              {/* Generated Ticket Result */}
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                    PO-8492
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Blocked Wheelchair Ramp (AV Crate Left in Path)
                  </span>
                </div>
                <span className="font-mono text-zinc-500">
                  Ramp 2 West • Affected Count: 2
                </span>
              </div>
            </div>

            {/* STEP 2: Route DNA Personal Rerouting */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-zinc-500">02</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Route DNA Personal Reroute (Attendee Navigation)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  Dynamic detours recomputed for every mobility and sensory profile.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 border-l-[3px] border-l-[#16a34a] space-y-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Mobility-Friendly Route DNA:
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono text-[11px]">
                    "Rerouting via North Skywalk elevators (+3 min). Avoids Ramp 2 West blocked crate."
                  </p>
                </div>
                <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 border-l-[3px] border-l-[#16a34a] space-y-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Low-Sensory Route DNA:
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono text-[11px]">
                    "Bypasses Food Court concourse (85 dB Chai queue). Rerouting via quiet glass terrace."
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 3: Live Incident Card with Stopwatch & Staff Dispatch */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#dc2626] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-zinc-500">03</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Live Incident Triage Card (Organizer Dashboard)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  Organizer receives correlated count, confidence score, assigned marshal, and live stopwatch.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                    PO-8492
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Blocked Wheelchair Ramp | Ramp 2 West
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>04m 12s ago</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700">
                    In Progress
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-zinc-500 text-[11px]">Assigned Marshal: </span>
                  <strong className="text-zinc-900 dark:text-zinc-100">Anita Roy (Accessibility Lead)</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-mono">Affected Count: 2</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">High Confidence</span>
                </div>
              </div>
            </div>

            {/* STEP 4: Barrier Ledger on Resolve (The Verify Loop Output) */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-zinc-500">04</span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    The Barrier Ledger (Audit Log on Resolve)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  Resolving clears the blockage, drops zone status from Red to Green, and logs exact duration.
                </span>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-semibold text-[11px]">
                      <th className="p-2">Ticket</th>
                      <th className="p-2">Zone</th>
                      <th className="p-2">Detected</th>
                      <th className="p-2">Resolved</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Resolution Delta</th>
                      <th className="p-2">Officer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 font-semibold text-zinc-900 dark:text-zinc-100">PO-8492</td>
                      <td className="p-2 text-zinc-700 dark:text-zinc-300">Ramp 2 West</td>
                      <td className="p-2 text-zinc-500">11:55:10</td>
                      <td className="p-2 text-zinc-500">11:59:22</td>
                      <td className="p-2 font-semibold text-zinc-900 dark:text-zinc-100">4m 12s</td>
                      <td className="p-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                        Reduced from RED to GREEN in 4 min
                      </td>
                      <td className="p-2 text-zinc-700 dark:text-zinc-300">Anita Roy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FINAL CTA STRIP */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Ready to test live operations?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Sign in as an attendee to submit signals or as an organizer to triage tickets.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openLogin('attendee')}
              className="px-4 py-2 text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px]"
            >
              Attendee Sign-In
            </button>
            <button
              onClick={() => openLogin('organizer')}
              className="px-4 py-2 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 min-h-[44px]"
            >
              Organizer Desk
            </button>
          </div>
        </section>
      </main>

      {/* 5. FOOTER (Simple, not decorative, no fluff) */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 px-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Kshetra</span>
            <span>— The event's nervous system.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Mumbai Future Commons 2026</span>
            <span>•</span>
            <span>WCAG 2.1 AA</span>
            <span>•</span>
            <span>Zero Camera Facial Tracking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
