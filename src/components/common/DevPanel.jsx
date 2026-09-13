import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { Play, Wifi, WifiOff, X, Terminal, RotateCcw, AlertTriangle } from 'lucide-react';

export function DevPanel() {
  const {
    triggerDemoScenario,
    toggleSimulatedOffline,
    isOnline,
    submitFrictionReport,
    zones,
  } = useEvent();

  const [isOpen, setIsOpen] = useState(false);

  // Check query param (?demo=1 or ?dev=1) or listen for Ctrl+Shift+D / Cmd+Shift+D
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1' || params.get('dev') === '1') {
      setIsOpen(true);
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Developer and Demo Control Panel"
      className="fixed bottom-4 left-4 z-50 bg-zinc-900 text-zinc-100 border border-zinc-700 p-3 max-w-xs text-xs space-y-2.5 font-mono"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span>Dev / Demo Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close Dev Panel"
          className="text-zinc-400 hover:text-zinc-100 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[10px] text-zinc-400 leading-tight">
        Hidden control panel for evaluations. Toggle anytime with <strong>Ctrl+Shift+D</strong> or <strong>?demo=1</strong>.
      </p>

      <div className="space-y-1.5 pt-1">
        <button
          onClick={triggerDemoScenario}
          className="w-full flex items-center justify-between p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-[11px] min-h-[44px]"
        >
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Scenario</span>
          </span>
          <span className="text-[9px] text-zinc-400">Ramp + Food Court</span>
        </button>

        <button
          onClick={toggleSimulatedOffline}
          className="w-full flex items-center justify-between p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-[11px] min-h-[44px]"
        >
          <span className="flex items-center gap-1.5">
            {isOnline ? <WifiOff className="w-3.5 h-3.5 text-red-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isOnline ? 'Simulate Offline' : 'Restore Online'}</span>
          </span>
          <span className="text-[9px] text-zinc-400">{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        <button
          onClick={() => {
            submitFrictionReport({
              category: 'long_queue',
              zoneId: zones[1]?.id || 'zone-workshop-a',
              customNote: 'Synthetic queue surge report',
              reporterType: 'staff',
            });
          }}
          className="w-full flex items-center justify-between p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-[11px] min-h-[44px]"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span>Inject Test Friction</span>
          </span>
          <span className="text-[9px] text-zinc-400">Workshop A</span>
        </button>
      </div>
    </div>
  );
}
