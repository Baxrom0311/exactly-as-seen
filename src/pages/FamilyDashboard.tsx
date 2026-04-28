import { Bell, Calendar, MessageCircle, Phone, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLang } from "@/i18n/LangProvider";
import { todayDoses } from "@/api/mockData";
import { cn } from "@/lib/utils";

export default function FamilyDashboard() {
  const { t } = useLang();
  const status: "green" | "yellow" | "red" = "yellow";
  const statusInfo = {
    green: { color: "risk-low", icon: "✓", text: t.familyDash.allTaken },
    yellow: { color: "risk-medium", icon: "⚠️", text: `${t.familyDash.oneMissed} (08:00)` },
    red: { color: "risk-critical", icon: "🚨", text: t.familyDash.twoDays },
  }[status];

  return (
    <div className="container max-w-5xl py-6 lg:py-10 space-y-5">
      {/* Hero */}
      <div className="rounded-3xl gradient-warm border border-border p-6 lg:p-8 flex items-center gap-5">
        <Avatar className="h-20 w-20 border-4 border-card shadow-elegant">
          <AvatarFallback className="bg-warm/30 text-warm font-bold text-2xl">A</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-extrabold">Aziza opa — {t.familyDash.todayStatus}</h1>
          <div className={cn("mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-sm", `bg-${statusInfo.color}/15 text-${statusInfo.color}`)}>
            <span>{statusInfo.icon}</span> {statusInfo.text}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
          <div className="text-sm text-muted-foreground">{t.familyDash.weekAdh}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">85%</span>
            <span className="text-sm text-risk-low flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {t.familyDash.improving}</span>
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border p-5 shadow-card">
          <div className="text-sm text-muted-foreground">{t.familyDash.history7}</div>
          <div className="mt-3 flex gap-1.5">
            {[1, 1, 0, 1, 1, 1, 0.5].map((v, i) => (
              <div key={i} className="flex-1 h-8 rounded-md" style={{ backgroundColor: v === 1 ? "hsl(var(--risk-low))" : v === 0 ? "hsl(var(--destructive))" : "hsl(var(--risk-medium))" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Help suggestions */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold text-lg mb-4">💛 {t.familyDash.help}</h2>
        <div className="space-y-2">
          {[
            "Aziza opaga qo'ng'iroq qiling — sog'ligini so'rang",
            "Birga ovqatlanishga taklif qiling — dori vaqti ovqatdan keyin",
            "Eslatib turing — vaqtidan oldin xabar bering",
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-2xl bg-warm/10 border border-warm/30 text-sm">
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Calendar className="h-5 w-5" /> {t.familyDash.timeline}</h2>
        <div className="space-y-2">
          {todayDoses.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
              <span className="font-mono text-sm font-semibold text-muted-foreground w-12">{d.scheduledTime}</span>
              <span className={cn("text-lg", d.status === "taken" ? "text-risk-low" : "text-muted-foreground/50")}>{d.status === "taken" ? "✓" : "○"}</span>
              <span className="font-medium text-sm flex-1">{d.medName} {d.dosage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell className="h-5 w-5" /> {t.familyDash.notifications}</h2>
        <div className="space-y-2 text-sm">
          <div className="p-3 rounded-xl bg-risk-medium/10 border-l-4 border-risk-medium">14:15 — Tushki dozani o'tkazib yubordi</div>
          <div className="p-3 rounded-xl bg-secondary/50">08:05 — Ertalabki dozani ichdi ✓</div>
          <div className="p-3 rounded-xl bg-secondary/50">Kecha — barcha dozalar vaqtida</div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" className="gap-2"><Phone className="h-4 w-4" /> {t.familyDash.call}</Button>
        <Button size="lg" variant="outline" className="gap-2"><MessageCircle className="h-4 w-4" /> {t.familyDash.message}</Button>
      </div>
    </div>
  );
}
