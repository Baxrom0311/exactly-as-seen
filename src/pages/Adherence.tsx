import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockApi } from "@/api/mockApi";
import { DayAdherence } from "@/api/types";
import { useLang } from "@/i18n/LangProvider";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

function colorFor(rate: number): string {
  if (rate >= 1) return "hsl(var(--risk-low))";
  if (rate >= 0.8) return "hsl(var(--risk-low) / 0.7)";
  if (rate >= 0.5) return "hsl(var(--risk-medium))";
  if (rate > 0) return "hsl(var(--risk-high))";
  return "hsl(var(--destructive))";
}

export default function Adherence() {
  const { t } = useLang();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<DayAdherence[]>([]);

  useEffect(() => { mockApi.adherenceHistory(days).then(setData); }, [days]);

  const stats = useMemo(() => {
    const total = data.reduce((a, d) => a + d.scheduled, 0);
    const taken = data.reduce((a, d) => a + d.taken, 0);
    const missed = total - taken;
    const rate = total ? Math.round((taken / total) * 100) : 0;
    return { total, taken, missed, rate };
  }, [data]);

  const chartData = useMemo(() => data.slice(-14).map((d) => ({ date: d.date.slice(5), rate: Math.round(d.rate * 100) })), [data]);

  // Heatmap weeks
  const weeks: DayAdherence[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  return (
    <div className="container max-w-6xl py-6 lg:py-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl lg:text-3xl font-extrabold">{t.adherence.title}</h1>
        <div className="flex gap-1 p-1 bg-secondary rounded-xl">
          {[7, 30, 90].map((n) => (
            <Button key={n} size="sm" variant={days === n ? "default" : "ghost"} onClick={() => setDays(n)}>
              {n} {t.dashboard.days}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
          <div className="text-sm text-muted-foreground">{t.adherence.rate}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{stats.rate}%</span>
            <TrendingUp className="h-4 w-4 text-risk-low" />
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
          <div className="text-sm text-muted-foreground">{t.adherence.total}</div>
          <div className="mt-2 text-4xl font-extrabold tabular-nums">{stats.taken} / {stats.total}</div>
        </div>
        <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
          <div className="text-sm text-muted-foreground">{t.adherence.missed}</div>
          <div className="mt-2 text-4xl font-extrabold tabular-nums text-risk-high">{stats.missed}</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold mb-4">{t.adherence.heatmap}</h2>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((w, i) => (
            <div key={i} className="flex flex-col gap-1">
              {w.map((d) => (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.taken}/${d.scheduled}`}
                  className={cn("h-4 w-4 rounded-sm", d.scheduled === 0 && "bg-muted")}
                  style={d.scheduled > 0 ? { backgroundColor: colorFor(d.rate) } : undefined}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>0%</span>
          {[0, 0.5, 0.8, 1].map((r) => <div key={r} className="h-3 w-3 rounded-sm" style={{ backgroundColor: colorFor(r) }} />)}
          <span>100%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold mb-4">{t.adherence.byMed}</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
