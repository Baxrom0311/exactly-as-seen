import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone, Search, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockApi } from "@/api/mockApi";
import { PatientSummary } from "@/api/types";
import RiskBadge from "@/components/shared/RiskBadge";
import { useLang } from "@/i18n/LangProvider";
import { cn } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const riskRank = { critical: 4, high: 3, medium: 2, low: 1 } as const;

export default function DoctorDashboard() {
  const { t } = useLang();
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");

  useEffect(() => { mockApi.patients().then((p) => { setPatients(p); setSelected(p[0]?.id ?? null); }); }, []);

  const filtered = useMemo(() => {
    return patients
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => filter === "all" || p.risk.level === filter)
      .sort((a, b) => riskRank[b.risk.level] - riskRank[a.risk.level]);
  }, [patients, search, filter]);

  const stats = useMemo(() => {
    const total = patients.length;
    const avg = total ? Math.round(patients.reduce((a, p) => a + p.adherence, 0) / total) : 0;
    const high = patients.filter((p) => p.risk.level === "high").length;
    const critical = patients.filter((p) => p.risk.level === "critical").length;
    return { total, avg, high, critical };
  }, [patients]);

  const current = patients.find((p) => p.id === selected);

  return (
    <div className="container max-w-7xl py-6 lg:py-10">
      <h1 className="text-2xl lg:text-3xl font-extrabold mb-6 flex items-center gap-3">
        <Stethoscope className="h-7 w-7 text-primary" /> {t.doctor.title}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: t.doctor.totalPatients, value: stats.total, color: "text-primary" },
          { label: t.doctor.avgAdh, value: `${stats.avg}%`, color: "text-foreground" },
          { label: t.doctor.highRisk, value: stats.high, color: "text-risk-high" },
          { label: t.doctor.critical, value: stats.critical, color: "text-risk-critical" },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={cn("text-3xl font-extrabold mt-1", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* List */}
        <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder={t.doctor.searchPatients} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 p-1 bg-secondary rounded-xl text-xs">
              {(["all", "critical", "high"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn("flex-1 py-1.5 rounded-lg font-semibold capitalize transition-base",
                    filter === f ? "bg-card shadow-sm" : "text-muted-foreground")}>
                  {f === "all" ? t.common.all : f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={cn("w-full flex items-center gap-3 p-3 rounded-2xl border-l-4 text-left transition-base",
                  selected === p.id ? "bg-primary/5 shadow-sm" : "hover:bg-secondary/50",
                )}
                style={{ borderLeftColor: `hsl(var(--risk-${p.risk.level}))` }}
              >
                <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center font-bold text-sm shrink-0">
                  {p.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.age}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{p.disease}</span> · <span>{p.adherence}%</span> · <span>{p.lastSeen}</span>
                  </div>
                </div>
                <div className="w-16 h-8 shrink-0">
                  <ResponsiveContainer>
                    <LineChart data={p.spark.map((v, i) => ({ i, v }))}>
                      <Line type="monotone" dataKey="v" stroke={`hsl(var(--risk-${p.risk.level}))`} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <RiskBadge level={p.risk.level} score={p.risk.score} />
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
          {current ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-xl font-extrabold">{current.name}</h2>
                  <div className="text-sm text-muted-foreground">{current.age} · {current.disease}</div>
                </div>
                <RiskBadge level={current.risk.level} score={current.risk.score} />
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="gap-2"><MessageCircle className="h-4 w-4" /> {t.doctor.sendMsg}</Button>
                <Button size="sm" variant="outline" className="gap-2"><Phone className="h-4 w-4" /> {t.doctor.schedule}</Button>
              </div>

              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">{t.doctor.overview}</TabsTrigger>
                  <TabsTrigger value="treatment">{t.doctor.treatment}</TabsTrigger>
                  <TabsTrigger value="interventions">{t.doctor.interventions}</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="h-32">
                    <ResponsiveContainer>
                      <LineChart data={current.spark.map((v, i) => ({ i, v }))}>
                        <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-2xl bg-secondary/50 p-4 text-sm">
                    <div className="font-semibold mb-1">AI tahlili</div>
                    <p className="text-muted-foreground">Bemorda oxirgi 7 kun ichida rioya darajasi pasaymoqda. Charchoq haqida ko'p xabarlar. Tushki dozalar tez-tez o'tkaziladi.</p>
                  </div>
                </TabsContent>

                <TabsContent value="treatment" className="space-y-3 mt-4 text-sm">
                  <div className="p-3 rounded-xl border border-border">💊 Isoniazid 300mg — 92%</div>
                  <div className="p-3 rounded-xl border border-border">💊 Rifampicin 600mg — 88%</div>
                  <div className="p-3 rounded-xl border border-border">💊 Pyrazinamide 1500mg — 78%</div>
                </TabsContent>

                <TabsContent value="interventions" className="space-y-2 mt-4 text-sm">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/30">📞 Bemor bilan telefon orqali bog'laning</div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/30">💊 Dori dozasini qayta ko'rib chiqing</div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/30">🧠 Psixolog maslahatini ko'rib chiqing</div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
              {t.doctor.selectPatient}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
