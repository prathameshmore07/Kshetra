import React from 'react';
import { useEvent } from '../../context/EventContext';
import { ROUTE_DNA_PROFILES } from '../../utils/recommendation';
import { calculateFacilityWalkTime } from '../../utils/routeDna';
import { StatusDot, getStatusBorderClass } from '../common/StatusIndicator';
import { CardSkeleton, Skeleton } from '../common/Skeleton';
import {
  Clock,
  Compass,
  MapPin,
  VolumeX,
  Send,
  Check,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function AttendeeHome() {
  const {
    isLoading,
    storeError,
    sessions,
    zones,
    facilities,
    preferences,
    setRouteDna,
    openReportModal,
    setQuietModalOpen,
  } = useEvent();

  const activeDnaKey = preferences.routeDna || 'mobility-friendly';
  const activeDna = ROUTE_DNA_PROFILES[activeDnaKey];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (storeError) {
    return (
      <div role="alert" className="p-6 border border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20 text-center space-y-2">
        <AlertCircle className="w-5 h-5 text-red-600 mx-auto" />
        <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">State Storage Error</h3>
        <p className="text-xs text-red-700 dark:text-red-400">{storeError}</p>
      </div>
    );
  }

  const nextSession = sessions[0];
  const nextSessionZone = zones.find(z => z.id === nextSession?.zoneId);

  return (
    <div className="space-y-6">
      {/* 1-Tap Friction Reporter Primary Banner */}
      <div className="p-4 border border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wide block">
            Rapid Feedback Loop
          </span>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Encountered Friction or a Barrier?
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            5-second tap flow to dispatch marshals and update venue flow in real time.
          </p>
        </div>

        <button
          onClick={() => openReportModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shrink-0 min-h-[44px] min-w-[44px]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Report Friction (1-Tap)</span>
        </button>
      </div>

      {/* Next Session Card */}
      {nextSession ? (
        <div className={`p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${getStatusBorderClass(nextSessionZone?.status || 'green')} space-y-3`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              NEXT UP ON YOUR AGENDA
            </span>
            <span className="text-xs font-mono px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              Starts in 25 min
            </span>
          </div>

          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {nextSession.title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              {nextSession.speaker}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{nextSession.room}</span>
              {nextSessionZone && (
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <StatusDot status={nextSessionZone.status} />
                  <span className="capitalize">{nextSessionZone.status}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{nextSession.startTime} – {nextSession.endTime}</span>
            </div>
          </div>

          {/* Route DNA Dynamic Personalized Advice */}
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs flex items-start gap-2">
            <Compass className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Personalized {activeDna.label} Routing:
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                {activeDnaKey === 'mobility-friendly' && (
                  nextSessionZone?.status === 'red'
                    ? 'Caution: Target area has active barrier reports. Rerouting via North Skywalk elevators.'
                    : 'Verified step-free access via North elevators. Avoids Ramp 2 West (active obstacle).'
                )}
                {activeDnaKey === 'low-sensory' && 'Directs through acoustic buffer corridors (< 42 dB). Bypasses Chai Concourse.'}
                {activeDnaKey === 'fast' && 'Shortest line via central atrium staircase (3 min walk).'}
                {activeDnaKey === 'safety-first' && 'Well-lit central route passing the staffed Help Desk and Medical Tent.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
          <Calendar className="w-6 h-6 text-zinc-400 mx-auto" />
          <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">No Scheduled Sessions</h3>
          <p className="text-xs text-zinc-500">Check the Sessions tab to discover and bookmark upcoming talks.</p>
        </div>
      )}

      {/* Route DNA Profile Selector */}
      <section aria-labelledby="route-dna-heading" className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div>
          <h3 id="route-dna-heading" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Route DNA Profile
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Dynamically recalibrates navigation paths, facility walk times, and session recommendation scores
          </p>
        </div>

        <div role="radiogroup" aria-label="Route DNA Profiles" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.values(ROUTE_DNA_PROFILES).map(profile => {
            const isSelected = activeDnaKey === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setRouteDna(profile.id)}
                className={`p-3 text-left border transition-colors min-h-[56px] focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                  isSelected
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {profile.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {profile.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quiet Mode Contextual Sanctuary Banner (Single Source of Truth) */}
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 border-l-[3px] border-l-[#16a34a] bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Need Sensory Decompression?
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Route to the nearest acoustic sanctuary (&lt; 38 dB) avoiding loud crowded corridors.
          </p>
        </div>

        <button
          onClick={() => setQuietModalOpen(true)}
          className="px-3.5 py-2.5 text-xs border border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto shrink-0 min-h-[44px] flex items-center justify-center"
        >
          Take me somewhere calm
        </button>
      </div>

      {/* Nearby Facilities with Live Computed Walk Times */}
      <section aria-labelledby="facilities-heading" className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="facilities-heading" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Nearby Facilities (Live Walk Time)
          </h3>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Computed for {activeDna.label} DNA
          </span>
        </div>

        {facilities.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500">
            No facility data available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {facilities.map(facility => {
              const timeInfo = calculateFacilityWalkTime(facility, activeDnaKey, zones);
              const zone = zones.find(z => z.id === facility.zoneId);

              return (
                <div
                  key={facility.id}
                  tabIndex={0}
                  role="region"
                  aria-label={`${facility.name}, estimated ${timeInfo.minutes} minute walk`}
                  className="p-3 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-2 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block truncate">
                      {facility.name}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
                      {zone?.name}
                      {zone && <StatusDot status={zone.status} />}
                    </span>
                    {timeInfo.hasDetour && (
                      <span className="text-[10px] text-orange-600 dark:text-orange-400 block mt-0.5 font-semibold">
                        {timeInfo.note}
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                      {timeInfo.minutes} min
                    </span>
                    <span className="text-[10px] text-zinc-400">walk</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
