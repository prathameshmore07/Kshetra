import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useEvent } from '../../context/EventContext';
import { StatusDot } from '../common/StatusIndicator';

// Time-series trend over the last 60 minutes (10-minute buckets)
const TREND_DATA = [
  { time: '11:15', foodCourt: 4, mainStage: 2, workshops: 1, rampBlock: 0 },
  { time: '11:25', foodCourt: 6, mainStage: 3, workshops: 2, rampBlock: 0 },
  { time: '11:35', foodCourt: 9, mainStage: 2, workshops: 2, rampBlock: 1 },
  { time: '11:45', foodCourt: 14, mainStage: 4, workshops: 3, rampBlock: 2 },
  { time: '11:55', foodCourt: 18, mainStage: 3, workshops: 4, rampBlock: 2 }, // Peak friction
  { time: '12:05', foodCourt: 16, mainStage: 3, workshops: 3, rampBlock: 2 },
];

export function TrendChart() {
  const { incidents, zones } = useEvent();

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Crowd & Friction Signal Trends (Last 60 Min)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time report volume and queue backlog across key venue zones
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <span className="w-2.5 h-0.5 bg-orange-600 inline-block" />
            <span>Food Court (Orange Threshold &ge;5)</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <span className="w-2.5 h-0.5 bg-red-600 inline-block" />
            <span>Ramp Obstruction (Red)</span>
          </div>
        </div>
      </div>

      {/* Minimalist Chart Container */}
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND_DATA} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              {/* Minimal 1px grid */}
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              
              <XAxis
                dataKey="time"
                stroke="#71717a"
                tick={{ fontSize: 11, fontFamily: 'Inter' }}
                tickLine={false}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fontSize: 11, fontFamily: 'Inter' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '4px',
                  color: '#fafafa',
                  fontSize: '11px',
                  boxShadow: 'none',
                  padding: '8px',
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />

              {/* Strict solid lines - no gradients, no glows */}
              <Line
                type="monotone"
                dataKey="foodCourt"
                name="Food Court Queue/Spillover"
                stroke="#ea580c"
                strokeWidth={2}
                dot={{ r: 3, fill: '#ea580c' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="rampBlock"
                name="Ramp 2 West Barrier"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 3, fill: '#dc2626' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="mainStage"
                name="Main Stage Flow"
                stroke="#16a34a"
                strokeWidth={1.5}
                dot={{ r: 2, fill: '#16a34a' }}
              />
              <Line
                type="monotone"
                dataKey="workshops"
                name="Workshop Corridors"
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Insight Callout */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
          <StatusDot status="orange" className="mt-1 shrink-0" />
          <p>
            <strong>Spillover Alert Triggered:</strong> At 11:45, Food Court signal rate crossed the medium threshold (5+ reports/10 min). Correlated reports auto-merged into single triage card (#102), raising zone status to Orange.
          </p>
        </div>
      </div>
    </div>
  );
}
