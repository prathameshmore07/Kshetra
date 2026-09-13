import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusDot } from '../common/StatusIndicator';
import {
  Compass,
  Zap,
  FileCheck2,
  VolumeX,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
  Building,
} from 'lucide-react';

export function LandingPage() {
  const { openLogin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* Public Top Bar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight text-base text-zinc-900 dark:text-zinc-50">
              Kshetra
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Mumbai Future Commons 2026
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
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

      {/* Main Hero Section */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-14 sm:py-20 text-center space-y-6">
          {/* Spatial Nervous System Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
            <StatusDot status="green" />
            <span>The Event's Nervous System • Spatial Operational Infrastructure</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Kshetra
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Every attendee, a personal route. Every incident, a timed fix.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Eliminating physical bottlenecks, inaccessible barriers, and sensory overload through algorithmic transparency and real-time floor marshalling.
          </p>

          {/* Primary Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => openLogin('attendee')}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>I'm an Attendee</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => openLogin('organizer')}
              className="w-full sm:w-auto px-6 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>I'm an Organizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Seed Event Context */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Building className="w-3.5 h-3.5" />
            <span>Currently powering: <strong>Mumbai Future Commons 2026</strong> (Jio World Convention Centre)</span>
          </div>
        </section>

        {/* 4 Feature Pillars (Flat 1px Borders, No Shadows, Strict 4-Status Accents) */}
        <section aria-labelledby="features-title" className="max-w-5xl mx-auto px-4 pb-16">
          <h2 id="features-title" className="sr-only">Core Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Route DNA */}
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#16a34a] space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Route DNA Profiles
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Navigation tailored to mobility devices, low-sensory needs, transit speed, or physical security.
              </p>
            </div>

            {/* 2. Friction-to-Action */}
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#ea580c] space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Friction-to-Action
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                5-second 1-tap attendee signals correlated by zone and category into live staff dispatches.
              </p>
            </div>

            {/* 3. Barrier Ledger */}
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#ca8a04] space-y-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Barrier Ledger
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Immutable audit trail logging start, acknowledgment, and physical resolution deltas.
              </p>
            </div>

            {/* 4. Quiet Mode */}
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 border-l-[3px] border-l-[#16a34a] space-y-2">
              <div className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Quiet Mode Routing
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Real-time acoustic mapping guiding neurodivergent attendees to calm sensory sanctuaries.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 px-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Kshetra</span>
            <span>— The Event's Nervous System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>WCAG 2.1 AA Compliant</span>
            <span>Zero Camera Facial Tracking</span>
            <span>Algorithmic Transparency</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
