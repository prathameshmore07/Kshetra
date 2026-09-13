import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusDot, StatusLabel, getStatusBorderClass } from '../common/StatusIndicator';
import { CardSkeleton } from '../common/Skeleton';
import { Send, MapPin, AlertCircle, Info } from 'lucide-react';

export function VenueMap2D() {
  const { zones, facilities, openReportModal, incidents, isLoading } = useEvent();
  const [selectedZoneId, setSelectedZoneId] = useState('zone-food-court');

  if (isLoading) {
    return <CardSkeleton />;
  }

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const activeZoneIncidents = incidents.filter(i => i.zoneId === selectedZoneId && i.status !== 'resolved');

  // SVG coordinate positions for clean 2D architectural layout
  // Scale: 1000 x 650 viewBox
  const zoneLayouts = {
    'zone-entrance-north': { x: 40, y: 40, width: 220, height: 130, label: 'Gate 1 (North Entrance)' },
    'zone-main-stage': { x: 300, y: 40, width: 440, height: 210, label: 'Main Stage (Grand Pavilion)' },
    'zone-ramp-west': { x: 40, y: 200, width: 90, height: 200, label: 'Ramp 2 West' },
    'zone-workshop-a': { x: 160, y: 200, width: 200, height: 180, label: 'Workshop A (Urban AI)' },
    'zone-workshop-b': { x: 390, y: 280, width: 170, height: 180, label: 'Workshop B (Civic Sensors)' },
    'zone-workshop-c': { x: 590, y: 280, width: 180, height: 180, label: 'Workshop C (Inclusive Design)' },
    'zone-food-court': { x: 40, y: 430, width: 320, height: 170, label: 'Food Court (Chai Concourse)' },
    'zone-quiet-room': { x: 390, y: 490, width: 170, height: 110, label: 'Quiet Room (Zen Haven)' },
    'zone-medical-tent': { x: 590, y: 490, width: 180, height: 110, label: 'Medical Tent' },
    'zone-entrance-south': { x: 800, y: 430, width: 160, height: 170, label: 'Gate 2 (South Metro Link)' },
  };

  return (
    <div className="space-y-4">
      {/* Map Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Venue Architectural Map (2D)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Interactive floorplan • Select any zone to inspect live flow and friction signals
          </p>
        </div>

        {/* Strict 4-Status Minimal Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <StatusLabel status="green" label="Green: Nominal" />
          <StatusLabel status="yellow" label="Yellow: Moderate" />
          <StatusLabel status="orange" label="Orange: High Crowd" />
          <StatusLabel status="red" label="Red: Blocked" />
        </div>
      </div>

      {/* Mobile pan hint */}
      <div className="sm:hidden text-[11px] text-zinc-500 flex items-center gap-1">
        <Info className="w-3.5 h-3.5" />
        <span>Swipe horizontally to pan floorplan • Tap any zone to inspect</span>
      </div>

      {/* Map SVG Container */}
      <div 
        tabIndex={0}
        aria-label="Interactive venue floorplan map. Use tab and arrow keys to navigate rooms."
        className="relative border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 p-2 overflow-x-auto focus-visible:outline-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-auto min-w-[650px] select-none"
          role="region"
          aria-label="Floorplan of Mumbai Future Commons"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-zinc-200 dark:text-zinc-900" />
            </pattern>
          </defs>
          <rect width="1000" height="650" fill="url(#grid)" />

          {/* Major Walkway Arteries (Dashed guidelines) */}
          <path
            d="M 150 105 L 300 105 M 260 290 L 390 290 M 560 370 L 590 370 M 200 400 L 200 430 M 475 460 L 475 490 M 680 460 L 680 490 M 770 515 L 800 515"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-zinc-300 dark:text-zinc-800"
          />

          {/* Render Architectural Zones */}
          {zones.map(zone => {
            const layout = zoneLayouts[zone.id];
            if (!layout) return null;

            const isSelected = zone.id === selectedZoneId;
            const statusColor = {
              green: '#16a34a',
              yellow: '#ca8a04',
              orange: '#ea580c',
              red: '#dc2626',
            }[zone.status] || '#16a34a';

            // Find incidents for this zone to compute dynamic label
            const zoneIncidents = incidents.filter(i => i.zoneId === zone.id && i.status !== 'resolved');
            const totalReportsInZone = zoneIncidents.reduce((sum, inc) => sum + inc.affectedCount, 0);

            return (
              <g
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className="cursor-pointer focus:outline-none"
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${zone.name}, status ${zone.status}, ${zone.reasonString}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedZoneId(zone.id);
                  }
                }}
              >
                {/* Zone Base Box - Flat, 1px border, NO gradient, NO shadow */}
                <rect
                  x={layout.x}
                  y={layout.y}
                  width={layout.width}
                  height={layout.height}
                  rx="4"
                  className={`transition-colors ${
                    isSelected
                      ? 'fill-zinc-200/80 dark:fill-zinc-800/90 stroke-zinc-900 dark:stroke-zinc-100 stroke-[2px]'
                      : 'fill-white dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700 stroke-[1px] hover:stroke-zinc-500'
                  }`}
                />

                {/* 3px Status Accent Border on left edge of zone */}
                <line
                  x1={layout.x}
                  y1={layout.y + 4}
                  x2={layout.x}
                  y2={layout.y + layout.height - 4}
                  stroke={statusColor}
                  strokeWidth="3.5"
                />

                {/* Status Dot in top right */}
                <circle
                  cx={layout.x + layout.width - 16}
                  cy={layout.y + 16}
                  r="4.5"
                  fill={statusColor}
                />

                {/* Zone Label */}
                <text
                  x={layout.x + 16}
                  y={layout.y + 24}
                  className="text-[12px] font-semibold fill-zinc-900 dark:fill-zinc-100 pointer-events-none"
                >
                  {layout.label}
                </text>

                {/* Zone Status summary (dynamically computed) */}
                <text
                  x={layout.x + 16}
                  y={layout.y + 42}
                  className="text-[10px] font-normal fill-zinc-500 dark:fill-zinc-400 pointer-events-none"
                >
                  {zone.status.toUpperCase()} • {zone.currentWaitTime ? `${zone.currentWaitTime}m wait` : 'Nominal flow'}
                </text>

                {/* Dynamic signal notice based on live data */}
                {totalReportsInZone > 0 && (
                  <text
                    x={layout.x + 16}
                    y={layout.y + 70}
                    className={`text-[10px] font-semibold pointer-events-none ${
                      zone.status === 'red' ? 'fill-red-600' : 'fill-orange-600'
                    }`}
                  >
                    {totalReportsInZone} report{totalReportsInZone > 1 ? 's' : ''} active
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Zone Inspection Panel (Dynamic computed numbers) */}
      {selectedZone && (
        <section
          aria-labelledby="zone-inspection-title"
          className={`p-4 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 ${getStatusBorderClass(selectedZone.status)}`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusDot status={selectedZone.status} />
                <h3 id="zone-inspection-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedZone.name}
                </h3>
                <span className="text-xs px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 uppercase">
                  {selectedZone.type}
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {selectedZone.reasonString}
              </p>
            </div>

            <button
              onClick={() => openReportModal(selectedZone.id)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 self-start md:self-auto min-h-[44px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Report Friction in this Zone</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Current Status</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                {selectedZone.status}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Wait Time</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedZone.currentWaitTime} min
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Sensory Level</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                {selectedZone.sensoryLevel || 'Medium'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Active Incidents</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                {activeZoneIncidents.length}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
