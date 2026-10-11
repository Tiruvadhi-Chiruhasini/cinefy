import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_ACCENT, formatMonth, truncate } from '../utils/format';

const TICK = { fontSize: 12, fill: '#5F6B73' };
const TOOLTIP = { contentStyle: { border: '1px solid #E1E5E4', borderRadius: 6, fontSize: 13, boxShadow: 'none' } };

/** Horizontal bars: one row per category (genres, movie titles). */
export function HorizontalBars({ data, nameKey, valueKey, valueLabel, label, height = 280, domain, format, nameWidth = 112 }) {
  return (
    <div role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 0 }}>
          <CartesianGrid horizontal={false} stroke="#E1E5E4" />
          <XAxis type="number" domain={domain} tick={TICK} axisLine={false} tickLine={false} allowDecimals={Boolean(domain)} />
          <YAxis
            type="category"
            dataKey={nameKey}
            width={nameWidth}
            tick={{ ...TICK, fill: '#1E2227' }}
            tickFormatter={(v) => truncate(v, 18)}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <Tooltip {...TOOLTIP} cursor={{ fill: '#F5F6F4' }} formatter={(v) => [format ? format(v) : v, valueLabel]} />
          <Bar dataKey={valueKey} fill={CHART_ACCENT} radius={[0, 3, 3, 0]} barSize={14}>
            <LabelList dataKey={valueKey} position="right" style={{ fontSize: 12, fill: '#1E2227' }} formatter={format} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Vertical columns for the 1-5 star distribution. */
export function RatingColumns({ data, height = 240 }) {
  return (
    <div role="img" aria-label="Number of ratings for each star value from 1 to 5">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 16, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#E1E5E4" />
          <XAxis dataKey="rating" tick={TICK} tickFormatter={(v) => `${v}★`} axisLine={false} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
          <Tooltip {...TOOLTIP} cursor={{ fill: '#F5F6F4' }} labelFormatter={(v) => `${v} star`} formatter={(v) => [v, 'Ratings']} />
          <Bar dataKey="count" fill={CHART_ACCENT} radius={[3, 3, 0, 0]} maxBarSize={44}>
            <LabelList dataKey="count" position="top" style={{ fontSize: 12, fill: '#1E2227' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Monthly line chart. valueKey is "count" or "averageRating". */
export function TrendLine({ data, valueKey, valueLabel, label, height = 240, domain }) {
  return (
    <div role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#E1E5E4" />
          <XAxis dataKey="month" tick={TICK} tickFormatter={formatMonth} axisLine={false} tickLine={false} minTickGap={16} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} domain={domain} width={36} allowDecimals={Boolean(domain)} />
          <Tooltip {...TOOLTIP} labelFormatter={formatMonth} formatter={(v) => [v, valueLabel]} />
          <Line type="monotone" dataKey={valueKey} stroke={CHART_ACCENT} strokeWidth={2} dot={{ r: 3, fill: CHART_ACCENT }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
