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
  Check,
  Building,
  VolumeX,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';

export function LandingPage() {
  const { openLogin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Interactive demo zone selector right in the hero preview
  const [selectedDemoZone, setSelectedDemoZone] = useState('food-court');

  const demoZones = {
    'food-court': {
      name: 'Food Court (Chai Concourse)',
      status: 'orange',
      reason: '18 reports in 8 min — chai counter queue spilling into central walkway',
      wait: '18m wait',
      action: 'Marshal Rajesh dispatched to deploy stanchions and route queue into eastern alcove',
      affected: 18,
    },
    'ramp-west': {
      name: 'Ramp 2 West (Workshop A Connector)',
      status: 'red',
      reason: 'Wheelchair ramp blocked by delivery crates — step-free access halted',
      wait: 'Blocked',
      action: 'Accessibility Lead Anita deployed to clear crates and verify incline clearance',
      affected: 2,
    },
    'quiet-room': {
      name: 'Quiet Room (Zen Haven)',
      status: 'green',
      reason: 'Acoustic sanctuary operating nominal — ambient noise 34 dB',
      wait: '0m wait',
      action: 'No intervention needed — low-sensory sanctuary open',
      affected: 0,
    },
    'main-stage': {
      name: 'Main Stage (Grand Pavilion)',
      status: 'green',
      reason: 'Flow nominal — seating at 62% capacity, 0 queue delay',
      wait: '0m wait',
      action: 'Routine scan time < 8s at entry doors',
      affected: 0,
    }
  };

  const activeZoneData = demoZones[selectedDemoZone];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* Top Bar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-base text-zinc-900 dark:text-zinc-50">
              Kshetra
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 font-normal">|</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Mumbai Future Commons 2026
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="p-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-300 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            <button
              onClick={() => openLogin('attendee')}
              className="px-3.5 py-2 text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] flex items-center justify-center font-medium"
            >
              Attendee Sign-In
            </button>

            <button
              onClick={() => openLogin('organizer')}
              className="px-4 py-2 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 min-h-[44px] flex items-center justify-center"
            >
              Organizer Desk
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stream */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-16">
        {/* HERO: Asymmetric Split (Headline + Pitch Left | Live Interactive Map Card Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Strong Concrete Pitch */}
          <div className="lg:col-span-6 space-y-5">
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              When 18 people report a queue in 8 minutes, the venue shouldn't stay green.
            </h1>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              <p>
                Attendees flag blocked ramps, crowded halls, and sensory overload in 5 seconds.
                Reports in the same zone automatically merge into one timed incident ticket.
              </p>
              <p>
                Organizers get an explicit action, an assigned marshal, and a ticking stopwatch.
                When resolved, the zone recovers and the duration is logged into a permanent Barrier Ledger.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => openLogin('attendee')}
                className="px-5 py-3 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <span>Check In as Attendee</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openLogin('organizer')}
                className="px-5 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <span>Staff &amp; Dispatch Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Building className="w-3.5 h-3.5 shrink-0" />
              <span>Active live deployment: <strong>Mumbai Future Commons 2026</strong> (BKC)</span>
            </div>
          </div>

          {/* Right: Real Interactive UI Preview (Live Map Inspector) */}
          <div className="lg:col-span-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Live Venue Signal Monitor
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                  Tap room to inspect
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1"><StatusDot status="green" /> Nominal</span>
                <span className="flex items-center gap-1"><StatusDot status="orange" /> High</span>
                <span className="flex items-center gap-1"><StatusDot status="red" /> Blocked</span>
              </div>
            </div>

            {/* Interactive Zone Buttons (Real Map State Simulator) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(demoZones).map(([key, zone]) => {
                const isSelected = selectedDemoZone === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDemoZone(key)}
                    className={`p-2.5 text-left border transition-colors min-h-[48px] ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {zone.name.split('(')[0]}
                      </span>
                      <StatusDot status={zone.status} />
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                      {zone.status.toUpperCase()} • {zone.wait}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Zone Reason Output Card */}
            <div className={`p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 ${getStatusBorderClass(activeZoneData.status)} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {activeZoneData.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase">
                  Status: {activeZoneData.status}
                </span>
              </div>

              <div className="text-xs">
                <span className="text-zinc-400 text-[11px] block mb-0.5 font-semibold">
                  Why this color was triggered:
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono text-[11px]">
                  "{activeZoneData.reason}"
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/60 text-xs">
                <span className="text-zinc-400 text-[10px] uppercase font-mono block mb-0.5">
                  Suggested Action:
                </span>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {activeZoneData.action}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NARRATIVE SECTION 1: ATTENDEE 5-SECOND FLOW & TRANSPARENT ROUTE DNA */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              Product Walkthrough • Part 01
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              5-second tap flow. No forms. No accounts required to signal friction.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              An attendee encountering a blocked wheelchair ramp taps one category button.
              A real ticket ID is generated instantly, and every attendee with a mobility-friendly profile
              is immediately routed around the blockage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Real Ticket Output Preview */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#dc2626] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-semibold px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  PO-8492
                </span>
                <span className="text-zinc-500 font-mono">Reported 4m 12s ago</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                  Blocked Wheelchair Ramp (AV Delivery Crate)
                </span>
                <span className="text-xs text-zinc-500">Ramp 2 West • Workshop A Connector</span>
              </div>
              <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-[11px] text-zinc-500 block">Confidence Threshold:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  High Confidence (Urgent accessibility flag verified on floor)
                </span>
              </div>
            </div>

            {/* How Route DNA Responds */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Route DNA Navigation Impact</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Live Dynamic Detour
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Mobility-Friendly Profile:
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
                    "Rerouting via North Skywalk elevators (+3 min). Avoids Ramp 2 West blocked crate."
                  </p>
                </div>
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Fast Path Profile:
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
                    "Unchanged (uses central stairs, unaffected by wheelchair ramp obstruction)."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NARRATIVE SECTION 2: ORGANIZER VERIFY LOOP & BARRIER LEDGER */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              Product Walkthrough • Part 02
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              The Verify Loop: from detection to resolution delta.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              When an organizer clicks "Resolve Incident", Kshetra doesn't just dismiss a card.
              It auto-recomputes the zone status, recalculates remaining reports, and logs the
              exact start/ack/resolve timestamps to the Barrier Ledger.
            </p>
          </div>

          {/* Real Mini Ledger Output */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Barrier Ledger — Live Audit Trail Preview</span>
              </span>
              <span className="font-mono text-[11px] text-zinc-500">100% verified timestamps</span>
            </div>

            <table className="w-full text-left text-xs border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                  <th className="p-2.5">Ticket</th>
                  <th className="p-2.5">Zone</th>
                  <th className="p-2.5">Duration</th>
                  <th className="p-2.5">Resolution Delta</th>
                  <th className="p-2.5">Staff Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-normal">
                <tr>
                  <td className="p-2.5 font-mono font-semibold text-zinc-900 dark:text-zinc-100">PO-1082</td>
                  <td className="p-2.5 text-zinc-600 dark:text-zinc-400">Ramp 2 West</td>
                  <td className="p-2.5 font-mono">4m 12s</td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Reduced from RED to GREEN in 4 min
                  </td>
                  <td className="p-2.5 text-zinc-700 dark:text-zinc-300">Anita Roy</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-semibold text-zinc-900 dark:text-zinc-100">PO-3944</td>
                  <td className="p-2.5 text-zinc-600 dark:text-zinc-400">Food Court Concourse</td>
                  <td className="p-2.5 font-mono">7m 40s</td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Reduced from ORANGE to YELLOW in 7 min
                  </td>
                  <td className="p-2.5 text-zinc-700 dark:text-zinc-300">Rajesh Kadam</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* NARRATIVE SECTION 3: QUIET MODE REAL ACOUSTIC COMPARISON */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
              Product Walkthrough • Part 03
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Quiet Mode: route comparison without the sensory guessing game.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Neurodivergent attendees or those experiencing panic decompression don't need a vague map icon.
              They need a direct time vs decibel comparison and calm turn-by-turn guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Noisy Path */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Direct Central Path</span>
                <span className="font-mono text-zinc-500">3 min</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Cuts directly through Chai Concourse and main thoroughfare.
              </p>
              <span className="inline-block text-[11px] font-semibold text-orange-600 dark:text-orange-400 font-mono">
                High Noise: 85 dB (crowded queue friction)
              </span>
            </div>

            {/* Calm Route */}
            <div className="p-4 border border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#16a34a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Calm Sanctuary Route</span>
                </span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">5 min (+2m)</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Diverts via North Skywalk and tactile acoustic buffer corridor.
              </p>
              <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                Low-Sensory: &lt; 42 dB (dimmed lighting, step-free)
              </span>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-10 pb-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Ready to test live operations?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Choose your view to test attendee friction submissions or organizer dispatch workflows.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openLogin('attendee')}
              className="px-5 py-2.5 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 min-h-[44px]"
            >
              Attendee Check-In
            </button>
            <button
              onClick={() => openLogin('organizer')}
              className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px]"
            >
              Organizer Desk
            </button>
          </div>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 px-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Kshetra</span>
            <span>— The Event's Nervous System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>WCAG 2.1 AA Compliant</span>
            <span>No Camera Facial Tracking</span>
            <span>Algorithmic Transparency</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
