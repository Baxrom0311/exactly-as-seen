import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pill, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockApi } from "@/api/mockApi";
import { Medication } from "@/api/types";
import { useLang } from "@/i18n/LangProvider";

export default function Medications() {
  const { t } = useLang();
  const [meds, setMeds] = useState<Medication[]>([]);
  const [tab, setTab] = useState<"active" | "finished">("active");

  useEffect(() => { mockApi.medications().then(setMeds); }, []);
  const filtered = meds.filter((m) => (tab === "active" ? m.active : !m.active));

  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold">{t.meds.title}</h1>
        <Link to="/medications/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> {t.meds.addNew}</Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="active">{t.meds.active}</TabsTrigger>
          <TabsTrigger value="finished">{t.meds.finished}</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center py-16 rounded-3xl border-2 border-dashed border-border">
          <Pill className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <p className="mt-4 text-muted-foreground">{t.meds.empty}</p>
          <Link to="/medications/new"><Button className="mt-4 gap-2"><Plus className="h-4 w-4" /> {t.meds.addNew}</Button></Link>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-card rounded-3xl border border-border p-5 shadow-card hover:shadow-elegant transition-base">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Pill className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg">{m.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-risk-low/15 text-risk-low font-semibold">🟢 {t.meds.active}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{m.dosage} · {m.times.join(", ")}</div>
                  <div className="text-xs text-muted-foreground">{m.disease} · {m.instructions}</div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{t.meds.adherenceMonth}</span>
                      <span className="font-semibold">{m.adherence30d}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary" style={{ width: `${m.adherence30d}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">{t.common.details}</Button>
                    <Button size="sm" variant="ghost">{t.common.edit}</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
