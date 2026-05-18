'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toPng } from 'html-to-image';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  Download,
  FileDown,
  Filter,
  ShieldCheck,
  TrendingUp,
  Users,
  Users2,
} from 'lucide-react';
import { toast } from 'sonner';

import { StatCard } from '@/components/admin/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAnalytics } from '@/lib/hooks/use-admin';
import type {
  AdminAnalyticsParams,
  AnalyticsCountDatum,
  AnalyticsTrendDatum,
  DepartmentLeaderboardDatum,
} from '@/lib/types';

const CHART_COLORS = ['#8e4dff', '#12b7ea', '#ff5500', '#2a003b', '#d64045', '#18a058'];

const compactFormatter = new Intl.NumberFormat('en-NG', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat('en-NG');

function formatNumber(value?: number) {
  return numberFormatter.format(value ?? 0);
}

function formatLabel(value: string) {
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  try {
    return format(parseISO(value), 'd MMM');
  } catch {
    return value;
  }
}

function buildCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0] ?? {});
  const escapeCell = (value: string | number) => {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCell(row[header] ?? '')).join(','))].join('\n');
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  const csv = buildCsv(rows);
  if (!csv) {
    toast.error('There is no data to export yet.');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toMetricRows(rows: AnalyticsCountDatum[]) {
  return rows.map((row) => ({ metric: formatLabel(row.label), value: row.value }));
}

function toTrendRows(rows: AnalyticsTrendDatum[]) {
  return rows.map((row) => ({
    date: row.date,
    registrations: row.registrations ?? 0,
    submissions: row.submissions ?? 0,
  }));
}

function toLeaderboardRows(rows: DepartmentLeaderboardDatum[]) {
  return rows.map((row) => ({
    department: row.department,
    registrations: row.registrations,
    teams: row.teams,
    submissions: row.submissions,
    completionRate: `${row.completionRate}%`,
  }));
}

function filterSummary(params: AdminAnalyticsParams) {
  const parts = [
    params.department ?? 'All departments',
    params.stage ? `Stage ${params.stage}` : 'All stages',
    params.startDate && params.endDate
      ? `${params.startDate} to ${params.endDate}`
      : params.startDate
        ? `From ${params.startDate}`
        : params.endDate
          ? `Until ${params.endDate}`
          : 'All time',
  ];

  return parts.join(' • ');
}

interface ChartPanelProps {
  title: string;
  description: string;
  csvFilename: string;
  csvRows: Array<Record<string, string | number>>;
  children: React.ReactNode;
}

function ChartPanel({ title, description, csvFilename, csvRows, children }: ChartPanelProps) {
  return (
    <section className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/90 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-normal text-[var(--brand-plum)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--brand-plum-soft)]/70">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadCsv(csvFilename, csvRows)}>
          <FileDown className="h-4 w-4" />
          CSV
        </Button>
      </div>
      <div className="h-80 min-h-0">{children}</div>
    </section>
  );
}

interface PublicityCardProps {
  id: string;
  title: string;
  eyebrow: string;
  value: string;
  subtitle: string;
  filters: string;
  generatedAt?: string;
  csvRows: Array<Record<string, string | number>>;
  getCard: (id: string) => HTMLDivElement | null;
  registerCard: (id: string, node: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

function PublicityCard({
  id,
  title,
  eyebrow,
  value,
  subtitle,
  filters,
  generatedAt,
  csvRows,
  getCard,
  registerCard,
  children,
}: PublicityCardProps) {
  const downloadCard = async () => {
    const node = getCard(id);
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `pidec-${id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error('Could not export this image. Please try again.');
    }
  };

  return (
    <section className="space-y-3">
      <div
        ref={(node) => {
          registerCard(id, node);
        }}
        className="aspect-[4/5] overflow-hidden rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white p-7 text-[var(--brand-plum)] shadow-[0_18px_44px_rgba(42,0,59,0.07)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-cyan)]">
              {eyebrow}
            </p>
            <h3 className="mt-3 font-heading text-2xl font-semibold tracking-normal">{title}</h3>
          </div>
          <Badge className="bg-[var(--brand-plum)] text-white">PIDEC 1.0</Badge>
        </div>

        <div className="mt-8">
          <p className="font-heading text-6xl font-semibold tracking-normal">{value}</p>
          <p className="mt-2 text-lg font-medium text-[var(--brand-plum-soft)]">{subtitle}</p>
        </div>

        <div className="mt-8 h-52">{children}</div>

        <div className="mt-8 border-t border-[rgba(42,0,59,0.1)] pt-4 text-xs font-medium text-[var(--brand-plum-soft)]/70">
          <p>{filters}</p>
          <p className="mt-1">
            Generated {generatedAt ? format(parseISO(generatedAt), 'd MMM yyyy, h:mm a') : 'just now'}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={downloadCard}>
          <Download className="h-4 w-4" />
          PNG
        </Button>
        <Button variant="outline" size="sm" onClick={() => downloadCsv(`pidec-${id}-${Date.now()}.csv`, csvRows)}>
          <FileDown className="h-4 w-4" />
          CSV
        </Button>
      </div>
    </section>
  );
}

export default function AdminAnalyticsPage() {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const registerCard = useCallback((id: string, node: HTMLDivElement | null) => {
    cardRefs.current[id] = node;
  }, []);
  const getCard = useCallback((id: string) => cardRefs.current[id] ?? null, []);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('all');
  const [stage, setStage] = useState('all');

  const params = useMemo<AdminAnalyticsParams>(() => {
    const nextParams: AdminAnalyticsParams = {};
    if (startDate) nextParams.startDate = startDate;
    if (endDate) nextParams.endDate = endDate;
    if (department !== 'all') nextParams.department = department;
    if (stage !== 'all') nextParams.stage = Number(stage);
    return nextParams;
  }, [department, endDate, stage, startDate]);

  const { data, isPending, isError, refetch } = useAdminAnalytics(params);
  const currentFilters = filterSummary(params);
  const departments = data?.departments ?? [];
  const topDepartments = data?.registrations.byDepartment
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) ?? [];
  const submissionDepartments = data?.submissions.byDepartment
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) ?? [];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/90 p-6 shadow-[0_18px_44px_rgba(42,0,59,0.07)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan)]">
            Admin Analytics
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-normal text-[var(--brand-plum)]">
            Numbers dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--brand-plum-soft)]/72">
            Track registrations, departments, teams, submissions, and verification outcomes. Every
            chart respects the active filters and can be downloaded for reporting or publicity.
          </p>
        </div>
        <Badge variant="outline" className="border-[rgba(42,0,59,0.12)] bg-white px-3 py-1">
          {currentFilters}
        </Badge>
      </section>

      <section className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/90 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--brand-plum)]">
          <Filter className="h-4 w-4 text-[var(--brand-purple)]" />
          Filters
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="analytics-start">Start date</Label>
            <Input
              id="analytics-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="analytics-end">End date</Label>
            <Input
              id="analytics-end"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Stage</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger>
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                <SelectItem value="1">Stage 1</SelectItem>
                <SelectItem value="2">Stage 2</SelectItem>
                <SelectItem value="3">Stage 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setDepartment('all');
                setStage('all');
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      {isError ? (
        <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Analytics could not be loaded.{' '}
          <button className="font-semibold underline" onClick={() => refetch()}>
            Try again
          </button>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Registrations"
          value={data?.overview.registrations}
          icon={Users}
          isLoading={isPending}
        />
        <StatCard
          label="Verified"
          value={data?.overview.verifiedStudents}
          icon={ShieldCheck}
          isLoading={isPending}
        />
        <StatCard
          label="Teams"
          value={data?.overview.teams}
          icon={Users2}
          isLoading={isPending}
        />
        <StatCard
          label="Submissions"
          value={data?.overview.submissions}
          icon={BarChart3}
          isLoading={isPending}
        />
        <StatCard
          label="Completion"
          value={data ? `${data.overview.completionRate}%` : undefined}
          icon={TrendingUp}
          isLoading={isPending}
        />
      </div>

      {isPending ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : data ? (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            <ChartPanel
              title="Registration and submission trend"
              description="Daily movement across the selected date and department filters."
              csvFilename="pidec-trend.csv"
              csvRows={toTrendRows(data.trends)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,0,59,0.08)" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => compactFormatter.format(Number(value))} tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={(value) => formatDate(String(value))} />
                  <Legend />
                  <Area type="monotone" dataKey="registrations" stroke="#8e4dff" fill="#8e4dff" fillOpacity={0.18} />
                  <Area type="monotone" dataKey="submissions" stroke="#12b7ea" fill="#12b7ea" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Registrations by department"
              description="Department distribution for the current registration pool."
              csvFilename="pidec-registration-departments.csv"
              csvRows={toMetricRows(data.registrations.byDepartment)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDepartments} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,0,59,0.08)" />
                  <XAxis type="number" tickFormatter={(value) => compactFormatter.format(Number(value))} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="label" type="category" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#8e4dff" />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Verification status"
              description="How student verification currently breaks down."
              csvFilename="pidec-verification.csv"
              csvRows={toMetricRows(data.verification.byStatus)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.verification.byStatus} dataKey="value" nameKey="label" innerRadius={64} outerRadius={104} paddingAngle={3}>
                    {data.verification.byStatus.map((entry, index) => (
                      <Cell key={entry.label} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [formatNumber(Number(value)), formatLabel(String(name))]} />
                  <Legend formatter={(value) => formatLabel(String(value))} />
                </PieChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Submissions by stage"
              description="Submission volume across the competition stages."
              csvFilename="pidec-submission-stages.csv"
              csvRows={toMetricRows(data.submissions.byStage)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.submissions.byStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,0,59,0.08)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => compactFormatter.format(Number(value))} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#ff5500" />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>

          <section className="rounded-2xl border border-[rgba(42,0,59,0.1)] bg-white/90 p-5 shadow-[0_18px_44px_rgba(42,0,59,0.07)]">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-normal text-[var(--brand-plum)]">
                  Department leaderboard
                </h2>
                <p className="mt-1 text-sm text-[var(--brand-plum-soft)]/70">
                  Registrations, teams, submissions, and completion rate per department.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv(`pidec-department-leaderboard-${Date.now()}.csv`, toLeaderboardRows(data.departmentLeaderboard))}
              >
                <FileDown className="h-4 w-4" />
                CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]/60">
                  <tr className="border-b border-[rgba(42,0,59,0.08)]">
                    <th className="py-3 pr-4">Department</th>
                    <th className="py-3 pr-4">Registrations</th>
                    <th className="py-3 pr-4">Teams</th>
                    <th className="py-3 pr-4">Submissions</th>
                    <th className="py-3 pr-4">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {data.departmentLeaderboard.map((row) => (
                    <tr key={row.department} className="border-b border-[rgba(42,0,59,0.06)] last:border-0">
                      <td className="py-3 pr-4 font-medium text-[var(--brand-plum)]">{row.department}</td>
                      <td className="py-3 pr-4">{formatNumber(row.registrations)}</td>
                      <td className="py-3 pr-4">{formatNumber(row.teams)}</td>
                      <td className="py-3 pr-4">{formatNumber(row.submissions)}</td>
                      <td className="py-3 pr-4">{row.completionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan)]">
                Publicity Exports
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-normal text-[var(--brand-plum)]">
                Downloadable image cards
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              <PublicityCard
                id="registrations"
                title="Registrations"
                eyebrow="Competition reach"
                value={formatNumber(data.overview.registrations)}
                subtitle="students registered"
                filters={currentFilters}
                generatedAt={data.generatedAt}
                csvRows={toMetricRows(data.registrations.byDepartment)}
                getCard={getCard}
                registerCard={registerCard}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDepartments.slice(0, 5)} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="label" type="category" width={118} tick={{ fontSize: 10 }} />
                    <Bar dataKey="value" fill="#8e4dff" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </PublicityCard>

              <PublicityCard
                id="verification"
                title="Verification"
                eyebrow="Student status"
                value={formatNumber(data.overview.verifiedStudents)}
                subtitle="verified students"
                filters={currentFilters}
                generatedAt={data.generatedAt}
                csvRows={toMetricRows(data.verification.byStatus)}
                getCard={getCard}
                registerCard={registerCard}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.verification.byStatus} dataKey="value" nameKey="label" innerRadius={42} outerRadius={76}>
                      {data.verification.byStatus.map((entry, index) => (
                        <Cell key={entry.label} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend formatter={(value) => formatLabel(String(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </PublicityCard>

              <PublicityCard
                id="submissions"
                title="Submissions"
                eyebrow="Competition progress"
                value={formatNumber(data.overview.submissions)}
                subtitle={`${data.overview.completionRate}% completion rate`}
                filters={currentFilters}
                generatedAt={data.generatedAt}
                csvRows={toMetricRows(data.submissions.byDepartment)}
                getCard={getCard}
                registerCard={registerCard}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionDepartments.slice(0, 5)}>
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis hide />
                    <Bar dataKey="value" fill="#ff5500" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </PublicityCard>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
