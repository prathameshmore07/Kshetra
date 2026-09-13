import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusDot } from '../common/StatusIndicator';
import {
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Compass,
  Check,
  Building,
  VolumeX,
  FileCheck2,
  AlertTriangle,
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
      tag: 'Accessibility barrier',
      reportCount: 2,
      reason: 'Unloading crate left in wheelchair path',
      action: 'Anita Roy dispatched to clear ramp and verify slope',
      waitTime: 'Blocked',
    },
    'food-court': {
      name: 'Food Court',
      status: 'orange',
      tag: 'Queue spillover',
      reportCount: 18,
      reason: '18 reports in 8 min — chai line spilling into walkway',
      action: 'Rajesh Kadam deployed with stanchions to divert line',
      waitTime: '18 min',
    },
    'quiet-room': {
      name: 'Quiet Room',
      status: 'green',
      tag: 'Sensory sanctuary',
      reportCount: 0,
      reason: 'Noise level steady at 34 dB, 32 seats open',
      action: 'No staff needed — calm conditions verified',
      waitTime: '0 min',
    },
    'main-stage': {
      name: 'Main Stage',
      status: 'green',
      tag: 'Auditorium',
      reportCount: 0,
      reason: 'Seating at 62% capacity, doors clear',
      action: 'Entry flow normal, scan time under 8s',
      waitTime: '0 min',
    },
  };

  const selectedZone = demoZones[activeZoneKey];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors antialiased">
      {/* 1. MINIMAL NAV (Quiet, zero box chrome) */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-none sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
              Kshetra
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Mumbai Future Commons 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            <button
              onClick={() => openLogin('attendee')}
              className="px-3.5 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium min-h-[44px] flex items-center justify-center"
            >
              Attendee Sign-In
            </button>

            <button
              onClick={() => openLogin('organizer')}
              className="px-4 py-2 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Organizer Desk
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO: COMMANDING TYPOGRAPHY & FRAMED LIVE SOFTWARE ANCHOR */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Editorial Display Headline (No border box around hero!) */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="font-display text-5xl sm:text-7xl lg:text-[76px] font-normal tracking-[-0.03em] leading-[0.94] text-zinc-950 dark:text-zinc-50">
                When 18 people report a queue in 8 minutes, the venue shouldn’t stay green.
              </h1>

              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal max-w-lg">
                Attendees flag friction in 5 seconds. Reports merge by zone. Organizers fix them against a timer.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => openLogin('attendee')}
                  className="px-6 py-3.5 bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[46px] flex items-center justify-center gap-2"
                >
                  <span>Check In as Attendee</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openLogin('organizer')}
                  className="px-6 py-3.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[46px] flex items-center justify-center gap-2"
                >
                  <span>Organizer Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Proof Line */}
              <div className="pt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Currently powering: <strong>Mumbai Future Commons 2026</strong> (BKC, Mumbai)</span>
              </div>
            </div>

            {/* Right: Framed Live Software Window (Visual Anchor) */}
            <div className="lg:col-span-6 lg:pt-2">
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                {/* Subtle Window Chrome */}
                <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-tight">
                    kshetra.live/mfc-2026/triage
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Live</span>
                  </div>
                </div>

                {/* Software Body */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <span className="text-zinc-500 font-normal">
                      Floorplan Signals • Tap room to inspect
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400"><StatusDot status="green" /> Flow</span>
                      <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400"><StatusDot status="orange" /> Crowd</span>
                      <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400"><StatusDot status="red" /> Barrier</span>
                    </div>
                  </div>

                  {/* 4 Architectural Rooms */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(demoZones).map(([key, zone]) => {
                      const isSelected = activeZoneKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveZoneKey(key)}
                          className={`p-3 text-left border transition-all ${
                            isSelected
                              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/70 dark:bg-zinc-800/80'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 bg-white dark:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                              {zone.name}
                            </span>
                            <StatusDot status={zone.status} />
                          </div>
                          <span className="text-[11px] text-zinc-500 font-mono block">
                            {zone.waitTime}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Room Details (Real Data Card) */}
                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedZone.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                        {selectedZone.tag}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      "{selectedZone.reason}"
                    </p>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-start gap-1">
                      <span className="text-zinc-400 shrink-0">Action:</span>
                      <span className="text-zinc-700 dark:text-zinc-300">{selectedZone.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE RESOLUTION MOMENT (THE ONE HERO PROOF MOMENT — VISUAL WEIGHT & BREATHING ROOM) */}
        <section className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-20 pb-24">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="max-w-xl space-y-3">
              <span className="text-xs text-zinc-500 font-normal">
                The core loop
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-[-0.02em] leading-tight text-zinc-950 dark:text-zinc-50">
                A blocked ramp clears in 4 minutes. Here is what happens under the hood.
              </h2>
            </div>

            {/* Asymmetric Timeline: Step 1 Dominant, Steps 2-4 Tapered Flow */}
            <div className="space-y-6">
              {/* STEP 1 (DOMINANT VISUAL WEIGHT: Real Interactive Report Flow) */}
              <div className="p-6 sm:p-8 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-400">01</span>
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      Attendee taps "Accessibility Issue" on Ramp 2 West
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500">Takes under 5 seconds</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Category options */}
                  <div className="lg:col-span-7 grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-center">
                      Blocked Path
                    </div>
                    <div className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-center">
                      Long Queue
                    </div>
                    <div className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-center">
                      Crowded Zone
                    </div>
                    <div className="p-2.5 border border-zinc-950 dark:border-zinc-50 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-center font-semibold">
                      Accessibility
                    </div>
                    <div className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-center">
                      Lost
                    </div>
                    <div className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-center">
                      Medical Aid
                    </div>
                  </div>

                  {/* Immediate Ticket Output */}
                  <div className="lg:col-span-5 p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 border-l-[3px] border-l-[#dc2626] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        PO-8492
                      </span>
                      <span className="text-[11px] text-zinc-500">Immediate dispatch</span>
                    </div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      Ramp 2 West blocked by crate
                    </p>
                    <span className="text-[11px] text-zinc-500 block">
                      Affected: 2 attendees • Confidence: High
                    </span>
                  </div>
                </div>
              </div>

              {/* STEPS 2-4 (TAPERED FLOW: CLEAN HORIZONTAL CADENCE) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 2: Route DNA reroute */}
                <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-zinc-400">02</span>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Route DNA re-routes
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    Attendees with mobility-friendly profiles are redirected via North elevators (+3m), bypassing the blocked crate.
                  </p>
                </div>

                {/* Step 3: Stopwatch & Dispatch */}
                <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400">03</span>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Marshal dispatched
                      </h4>
                    </div>
                    <span className="font-mono text-zinc-400 text-[11px]">04m 12s</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    Anita Roy (Accessibility Lead) is assigned directly. A ticking stopwatch tracks elapsed time since detection.
                  </p>
                </div>

                {/* Step 4: Verify Loop & Barrier Ledger */}
                <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400">04</span>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Resolved &amp; logged
                      </h4>
                    </div>
                    <StatusDot status="green" />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    On resolve, Ramp 2 West recovers to Green. The 4-minute resolution delta is logged permanently to the Barrier Ledger.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL BARRIER LEDGER LOG (QUIET DATA AUDIT) */}
        <section className="border-t border-zinc-200/80 dark:border-zinc-800/80 pt-20 pb-20">
          <div className="max-w-6xl mx-auto px-6 space-y-8">
            <div className="max-w-xl space-y-2">
              <span className="text-xs text-zinc-500 font-normal">
                Post-event audit
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-normal tracking-[-0.02em] text-zinc-950 dark:text-zinc-50">
                The Barrier Ledger: every fix timestamped and exported.
              </h2>
            </div>

            {/* Audit Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[580px] text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 font-normal text-[11px]">
                    <th className="p-3">Ticket</th>
                    <th className="p-3">Zone</th>
                    <th className="p-3">Detected</th>
                    <th className="p-3">Resolved</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Resolution Delta</th>
                    <th className="p-3">Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">PO-8492</td>
                    <td className="p-3 text-zinc-700 dark:text-zinc-300 font-sans">Ramp 2 West</td>
                    <td className="p-3 text-zinc-500">11:55:10</td>
                    <td className="p-3 text-zinc-500">11:59:22</td>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">4m 12s</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-sans">
                      Reduced from RED to GREEN in 4 min
                    </td>
                    <td className="p-3 text-zinc-700 dark:text-zinc-300 font-sans">Anita Roy</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">PO-3944</td>
                    <td className="p-3 text-zinc-700 dark:text-zinc-300 font-sans">Food Court Concourse</td>
                    <td className="p-3 text-zinc-500">11:38:00</td>
                    <td className="p-3 text-zinc-500">11:45:40</td>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">7m 40s</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-sans">
                      Reduced from ORANGE to YELLOW in 7 min
                    </td>
                    <td className="p-3 text-zinc-700 dark:text-zinc-300 font-sans">Rajesh Kadam</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION STRIP */}
        <section className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-20 bg-white dark:bg-zinc-900/40">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-zinc-950 dark:text-zinc-50">
              Ready to test live operations?
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Check in as an attendee to test 1-tap friction signals or open the organizer desk to triage tickets.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openLogin('attendee')}
                className="px-6 py-3.5 bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 min-h-[46px] flex items-center justify-center"
              >
                Attendee Check-In
              </button>
              <button
                onClick={() => openLogin('organizer')}
                className="px-6 py-3.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[46px] flex items-center justify-center"
              >
                Organizer Desk
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. SIMPLE, NON-DECORATIVE FOOTER */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 py-8 px-6 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Kshetra</span>
            <span>— The event’s nervous system.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>Mumbai Future Commons 2026</span>
            <span>•</span>
            <span>WCAG 2.1 AA</span>
            <span>•</span>
            <span>No camera crowd surveillance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
