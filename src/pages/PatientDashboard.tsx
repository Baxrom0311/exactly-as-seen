import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Clock, Flame, MessageCircle, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LangProvider";
import { useAuth } from "@/hooks/useAuth";
import { mockApi } from "@/api/mockApi";
import { DoseLog, RiskInfo } from "@/api/types";
import RiskGauge from "@/components/shared/RiskGauge";
import { cn } from "@/lib/utils";

const moods: { id: string; emoji: string; key: keyof ReturnType<typeof useLang>["t"]["dashboard"]["moods"] }[] = [
  { id: "great", emoji: "😄", key: "great" },
  { id: "ok", emoji: "🙂", key: "ok" },
  { id: "meh", emoji: "😐", key: "meh" },
  { id: "tired", emoji: "😕", key: "tired" },
  { id: "sick", emoji: "😢", key: "sick" },
];

export default function PatientDashboard() {
  const { t } = useLang();
  const { user } = useAuth();
  const [doses, setDoses] = useState<DoseLog[]>([]);
  const [risk, setRisk] = useState<RiskInfo | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [moodReply, setMoodReply] = useState<string>("");
  const streak = 5;

  useEffect(() => {
    mockApi.todayMeds().then(setDoses);
    mockApi.risk().then(setRisk);
  }, []);

  const takeDose = async (id: string) => {
    await mockApi.logAdherence(id);
    setDoses((arr) => arr.map((d) => d.id === id ? { ...d, status: "taken", takenAt: new Date().toTimeString().slice(0, 5) } : d));
    toast.success(t.dashboard.celebrate);
  };

  const selectMood = async (id: string) => {
    setMood(id);
    const r = await mockApi.checkIn(id);
    setMoodReply(r.reply);
  };

  const taken = doses.filter((d) => d.status === "taken").length;
  const total = doses.length;
  const firstName = user?.full_name.split(" ")[0] ?? "";

  const riskLevelLabel = (lvl: string) => {
    if (lvl === "low") return t.dashboard.riskLow;
    if (lvl === "medium") return t.dashboard.riskMedium;
    if (lvl === "high") return t.dashboard.riskHigh;
    return t.dashboard.riskCritical;
  };

  return (
    <div className="container max-w-6xl py-6 lg:py-10 space-y-5">
      {/* Crisis banner */}
      {risk && (risk.level === "high" || risk.level === "critical") && (
        <div className="rounded-2xl border border-risk-high/40 bg-risk-high/10 p-4 flex items-start gap-3 fade-in-up">
          <AlertTriangle className="h-5 w-5 text-risk-high mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-sm">⚠️ {t.dashboard.crisis}</div>
            <Link to="/chat"><Button size="sm" variant="outline" className="mt-2 border-risk-high/40">{t.dashboard.talk}</Button></Link>
          </div>
        </div>
      )}

      {/* Greeting + mood */}
      <div className="rounded-3xl gradient-greeting border border-border p-6 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold">{t.dashboard.greeting}, {firstName}!</h1>
        <p className="mt-1 text-muted-foreground">{t.dashboard.moodAsk}</p>
        <div className="mt-5 grid grid-cols-5 gap-2 max-w-md">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => selectMood(m.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl bg-card border-2 p-3 transition-base hover:scale-105",
                mood === m.id ? "border-primary shadow-elegant" : "border-transparent shadow-sm"
              )}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{t.dashboard.moods[m.key]}</span>
            </button>
          ))}
        </div>
        {moodReply && (
          <div className="mt-4 rounded-2xl bg-card border border-border p-3 max-w-md flex gap-2 fade-in-up">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm">{moodReply}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Risk */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-card flex flex-col items-center text-center">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t.dashboard.risk}</h3>
          {risk && <RiskGauge score={risk.score} label={riskLevelLabel(risk.level)} />}
          {risk && (
            <details className="mt-4 w-full text-sm">
              <summary className="cursor-pointer text-primary font-medium">{t.dashboard.aiAnalysis}</summary>
              <ul className="mt-2 text-left space-y-1.5 text-muted-foreground">
                {risk.factors.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg bg-secondary/40">
                    <span>{f.label}</span>
                    <span className="font-mono font-semibold text-foreground">+{f.weight}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        {/* Streak */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t.dashboard.streak}</h3>
          <div className="flex items-baseline gap-2">
            <Flame className="h-7 w-7 text-warm" />
            <span className="text-5xl font-extrabold">{streak}</span>
            <span className="text-muted-foreground">{t.dashboard.days}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{t.dashboard.bestStreak}: 12 {t.dashboard.days}</div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {[1, 1, 1, 0, 1, 1, 1].map((v, i) => (
              <div key={i} className={cn("aspect-square rounded-lg grid place-items-center text-xs font-bold",
                v ? "bg-risk-low/20 text-risk-low" : "bg-muted text-muted-foreground/40")}>
                {v ? "✓" : "·"}
              </div>
            ))}
          </div>
        </div>

        {/* Family */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> {t.dashboard.family}</h3>
          <div className="flex -space-x-2">
            {["B", "O"].map((c, i) => (
              <div key={i} className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground font-semibold border-2 border-card">{c}</div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">2 {t.dashboard.familySupport}</p>
          <div className="mt-2 text-xs space-y-1">
            <div>Bobur (er)</div>
            <div>Olim (o'g'il)</div>
          </div>
        </div>
      </div>

      {/* Today's medications */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">{t.dashboard.todayMeds}</h2>
          <span className="text-sm text-muted-foreground">{taken}/{total} {t.dashboard.taken}</span>
        </div>
        <div className="space-y-2.5">
          {doses.map((d) => (
            <div
              key={d.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-base",
                d.status === "taken" && "bg-secondary/30 border-border opacity-80",
                d.status === "upcoming" && "bg-primary/5 border-primary/30 pulse-ring",
                d.status === "missed" && "bg-destructive/5 border-destructive/30"
              )}
            >
              <div className={cn("h-12 w-12 rounded-2xl grid place-items-center shrink-0",
                d.status === "taken" ? "bg-risk-low/20 text-risk-low" : "bg-primary/10 text-primary")}>
                {d.status === "taken" ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-semibold text-muted-foreground">{d.scheduledTime}</span>
                  <span className="font-semibold">{d.medName} {d.dosage}</span>
                </div>
                {d.instructions && <div className="text-xs text-muted-foreground mt-0.5">{d.instructions}</div>}
                {d.status === "taken" && d.takenAt && <div className="text-xs text-risk-low mt-0.5">✓ {d.takenAt}</div>}
              </div>
              {d.status !== "taken" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => takeDose(d.id)} className="gap-1.5">
                    <Check className="h-4 w-4" /> {t.dashboard.tookIt}
                  </Button>
                  <Button size="sm" variant="ghost" className="hidden sm:inline-flex">{t.dashboard.snooze}</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAB - mobile */}
      <Link to="/chat" className="lg:hidden fixed bottom-20 right-4 z-40">
        <Button size="lg" className="rounded-full shadow-elegant pulse-ring gap-2 h-14 px-5">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{t.dashboard.aiChat}</span>
        </Button>
      </Link>
    </div>
  );
}
