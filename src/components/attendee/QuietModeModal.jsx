import React, { useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { getCalmSanctuaryRoute } from '../../utils/routeDna';
import { StatusDot } from '../common/StatusIndicator';
import { X, VolumeX, Check } from 'lucide-react';

export function QuietModeModal() {
  const { quietModalOpen, setQuietModalOpen, zones } = useEvent();

  // Escape key listener
  useEffect(() => {
    if (!quietModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuietModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quietModalOpen, setQuietModalOpen]);

  if (!quietModalOpen) return null;

  const routeData = getCalmSanctuaryRoute(zones);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiet-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 animate-in fade-in duration-100"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <h2 id="quiet-modal-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Quiet Sanctuary Routing
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sensory relief pathway comparison
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuietModalOpen(false)}
            aria-label="Close quiet routing modal"
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Card */}
        <div className="py-4 space-y-4">
          <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 border-l-[3px] border-l-[#16a34a] bg-zinc-50/50 dark:bg-zinc-800/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {routeData.destination.name}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                {routeData.destination.currentNoiseLevel}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              {routeData.destination.type}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {routeData.destination.features.map((feat, i) => (
                <span
                  key={i}
                  className="text-[10px] px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Route Comparison */}
          <div>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-2">
              Route Comparison:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Direct Path */}
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {routeData.directPath.name}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {routeData.directPath.timeMinutes} min
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {routeData.directPath.sensoryExposure}
                </p>
                <span className="inline-block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                  {routeData.directPath.crowdRisk}
                </span>
              </div>

              {/* Calm Route (Recommended) */}
              <div className="p-3 border border-zinc-900 dark:border-zinc-100 border-l-[3px] border-l-[#16a34a] space-y-1.5 bg-zinc-50/40 dark:bg-zinc-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    <span>{routeData.calmPath.name}</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                  <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {routeData.calmPath.timeMinutes} min
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {routeData.calmPath.sensoryExposure}
                </p>
                <span className="inline-block text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Recommended • {routeData.calmPath.deltaMinutes}
                </span>
              </div>
            </div>
          </div>

          {/* Calm Steps */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-2">
              Calm Turn-by-Turn Directions:
            </span>
            <ol className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {routeData.calmPath.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => setQuietModalOpen(false)}
            className="px-5 py-2.5 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold min-h-[44px]"
          >
            I Am En Route
          </button>
        </div>
      </div>
    </div>
  );
}
