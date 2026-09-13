import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { scoreSession } from '../../utils/recommendation';
import { StatusDot } from '../common/StatusIndicator';
import { CardSkeleton } from '../common/Skeleton';
import { Clock, MapPin, Bookmark, Filter, Check, CalendarX } from 'lucide-react';

export function SessionList() {
  const {
    sessions,
    zones,
    preferences,
    bookmarkedSessionIds,
    toggleBookmark,
    isLoading,
  } = useEvent();

  const [selectedTag, setSelectedTag] = useState('ALL');

  if (isLoading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // Unique tags
  const allTags = ['ALL', ...new Set(sessions.flatMap(s => s.tags || []))];

  // Score all sessions with transparent formula
  const scoredSessions = sessions.map(session => {
    const scoreData = scoreSession(session, preferences, zones);
    return {
      ...session,
      scoreData,
    };
  }).sort((a, b) => b.scoreData.score - a.scoreData.score);

  // Filter
  const filteredSessions = scoredSessions.filter(session => {
    if (selectedTag === 'ALL') return true;
    return session.tags?.includes(selectedTag);
  });

  return (
    <div className="space-y-4">
      {/* Header & Tag Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Sessions &amp; Algorithmic Recommendations
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Transparent scoring formula: <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5">0.45×I + 0.25×A + 0.15×T + 0.15×C</code>
          </p>
        </div>

        {/* Tag Filters */}
        <div role="group" aria-label="Filter sessions by tag" className="flex flex-wrap gap-1.5 text-xs">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              aria-pressed={selectedTag === tag}
              className={`px-3 py-2 border transition-colors min-h-[44px] flex items-center justify-center ${
                selectedTag === tag
                  ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Explicit Empty State */}
      {filteredSessions.length === 0 ? (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-3">
          <CalendarX className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No Sessions Match "{selectedTag}"
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            Try choosing a different topic tag or select "ALL" to view the full event schedule.
          </p>
          <button
            onClick={() => setSelectedTag('ALL')}
            className="px-4 py-2 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold min-h-[44px]"
          >
            Show All Sessions
          </button>
        </div>
      ) : (
        /* Session Cards */
        <div className="space-y-3">
          {filteredSessions.map(session => {
            const { score, interest, accessibility, time, crowd, formulaBreakdown, rationale } = session.scoreData;
            const isSaved = bookmarkedSessionIds.includes(session.id);
            const zone = zones.find(z => z.id === session.zoneId);

            return (
              <article
                key={session.id}
                tabIndex={0}
                aria-labelledby={`session-title-${session.id}`}
                className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
              >
                {/* Top Row: Title, Time, Match Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {session.category}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.startTime} - {session.endTime}
                      </span>
                    </div>

                    <h3 id={`session-title-${session.id}`} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {session.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {session.speaker}
                    </p>
                  </div>

                  {/* Score Box */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex flex-col items-end border border-zinc-300 dark:border-zinc-700 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/40">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Match Score
                      </span>
                      <span className="text-base font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                        {score}<span className="text-xs font-normal text-zinc-400">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {session.description}
                </p>

                {/* 4 Normalized Sub-Scores Grid */}
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1.5 gap-1">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Transparent Scoring Breakdown
                    </span>
                    <span className="font-mono text-[10px]">{formulaBreakdown}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="border border-zinc-200 dark:border-zinc-700 p-1.5 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-400 block text-[10px]">0.45 × Interest</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {interest} <span className="font-normal text-zinc-400">({Math.round(interest * 100)}%)</span>
                      </span>
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-700 p-1.5 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-400 block text-[10px]">0.25 × Accessibility</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {accessibility} <span className="font-normal text-zinc-400">({Math.round(accessibility * 100)}%)</span>
                      </span>
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-700 p-1.5 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-400 block text-[10px]">0.15 × Time / Walk</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {time} <span className="font-normal text-zinc-400">({Math.round(time * 100)}%)</span>
                      </span>
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-700 p-1.5 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-400 block text-[10px]">0.15 × Crowd Flow</span>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {crowd} <span className="font-normal text-zinc-400">({Math.round(crowd * 100)}%)</span>
                      </span>
                    </div>
                  </div>

                  {/* One-Line Rationale */}
                  <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Recommended because: </span>
                    <span>{rationale}</span>
                  </div>
                </div>

                {/* Bottom Meta & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{session.room}</span>
                    {zone && (
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <StatusDot status={zone.status} />
                        <span className="capitalize">{zone.status}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmark(session.id)}
                    aria-pressed={isSaved}
                    className={`px-3.5 py-2 text-xs border transition-colors min-h-[44px] flex items-center gap-1.5 ${
                      isSaved
                        ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 font-semibold'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Saved to Schedule' : 'Save Session'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
