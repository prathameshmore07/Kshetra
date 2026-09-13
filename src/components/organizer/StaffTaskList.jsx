import React from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusDot } from '../common/StatusIndicator';
import { Users, UserCheck } from 'lucide-react';

export function StaffTaskList() {
  const { staff, incidents } = useEvent();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Staff Roster &amp; Task Assignments
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            On-site marshals, accessibility coordinators, and medical rapid responders
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Available:</span>
          <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
            {staff.filter(s => s.status === 'available').length} / {staff.length}
          </span>
        </div>
      </div>

      {/* Explicit Empty State */}
      {staff.length === 0 ? (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
          <Users className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            No Staff Members Registered
          </h3>
          <p className="text-xs text-zinc-500">
            On-site operations personnel will appear here once connected.
          </p>
        </div>
      ) : (
        /* Staff Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {staff.map(member => {
            const activeTask = incidents.find(i => i.id === member.currentTaskId);
            const isAvailable = member.status === 'available';

            return (
              <div
                key={member.id}
                tabIndex={0}
                aria-label={`Staff ${member.name}, ${member.role}, status: ${member.status}`}
                className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 focus-visible:ring-2 focus-visible:ring-zinc-900"
              >
                {/* Name & Role */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {member.name}
                    </h3>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {member.role}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 border border-zinc-200 dark:border-zinc-700">
                    <StatusDot status={isAvailable ? 'green' : 'yellow'} />
                    <span className="capitalize text-zinc-700 dark:text-zinc-300 font-semibold">
                      {member.status}
                    </span>
                  </div>
                </div>

                {/* Specialty */}
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span className="text-zinc-400">Specialty: </span>
                  <span>{member.specialty}</span>
                </div>

                {/* Current Active Assignment */}
                <div className="p-2.5 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                  {activeTask ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          Active Dispatch:
                        </span>
                        <span className="font-mono text-zinc-500 font-semibold">
                          {activeTask.ticketId || activeTask.id.slice(-4)}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-[11px] truncate">
                        {activeTask.issueTitle}
                      </p>
                      <span className="text-[10px] text-zinc-500 block">
                        Zone: {activeTask.zoneName}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Standing by for floor dispatch</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
