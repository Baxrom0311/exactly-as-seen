import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Pill } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApi } from "@/api/mockApi";
import { useLang } from "@/i18n/LangProvider";
import { cn } from "@/lib/utils";

const freqMap: Record<string, string[]> = {
  "1x": ["08:00"],
  "2x": ["08:00", "20:00"],
  "3x": ["08:00", "14:00", "20:00"],
  "4x": ["06:00", "12:00", "18:00", "00:00"],
};

export default function AddMedication() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [d, setD] = useState({
    name: "", dosage: "", unit: "mg", disease: "TB", instructions: "",
    frequency: "2x", times: freqMap["2x"],
    startDate: new Date().toISOString().slice(0, 10), endDate: "", ongoing: true,
  });

  const setFreq = (f: string) => setD({ ...d, frequency: f, times: freqMap[f] ?? d.times });
  const setTime = (i: number, v: string) => {
    const arr = [...d.times]; arr[i] = v;
    setD({ ...d, times: arr });
  };

  const submit = async () => {
    await mockApi.addMedication({ ...d, dosage: d.dosage + d.unit });
    toast.success("Dori qo'shildi");
    navigate("/medications");
  };

  const next = () => {
    if (step === 1 && (!d.name || !d.dosage)) return toast.error("Barcha maydonlarni to'ldiring");
    setStep((s) => Math.min(3, s + 1));
  };

  return (
    <div className="container max-w-2xl py-6 lg:py-10">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Button>
      <h1 className="text-2xl lg:text-3xl font-extrabold mb-6">{t.meds.addTitle}</h1>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={cn("h-2 flex-1 rounded-full transition-base", step >= n ? "bg-primary" : "bg-muted")} />
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        {step === 1 && (
          <div className="space-y-4 fade-in-up">
            <h2 className="font-semibold">1. {t.meds.summary}</h2>
            <div>
              <Label>{t.meds.name}</Label>
              <Input className="mt-1.5" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Isoniazid" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>{t.meds.dosage}</Label>
                <Input className="mt-1.5" value={d.dosage} onChange={(e) => setD({ ...d, dosage: e.target.value })} placeholder="300" />
              </div>
              <div>
                <Label>&nbsp;</Label>
                <Select value={d.unit} onValueChange={(v) => setD({ ...d, unit: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="tablet">tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{t.meds.disease}</Label>
              <Select value={d.disease} onValueChange={(v) => setD({ ...d, disease: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TB">TB (Sil)</SelectItem>
                  <SelectItem value="Hypertension">Gipertoniya</SelectItem>
                  <SelectItem value="Diabetes">Diabet</SelectItem>
                  <SelectItem value="Other">Boshqa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.meds.instructions}</Label>
              <Textarea className="mt-1.5" value={d.instructions} onChange={(e) => setD({ ...d, instructions: e.target.value })} placeholder="Ovqatdan oldin" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 fade-in-up">
            <h2 className="font-semibold">2. {t.meds.schedule}</h2>
            <div>
              <Label>{t.meds.frequency}</Label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {["1x", "2x", "3x", "4x"].map((f) => (
                  <button key={f} onClick={() => setFreq(f)}
                    className={cn("py-2.5 rounded-xl border-2 text-sm font-semibold transition-base",
                      d.frequency === f ? "border-primary bg-primary/10 text-primary" : "border-border")}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>{t.meds.times}</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {d.times.map((tm, i) => (
                  <Input key={i} type="time" value={tm} onChange={(e) => setTime(i, e.target.value)} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.meds.startDate}</Label>
                <Input type="date" className="mt-1.5" value={d.startDate} onChange={(e) => setD({ ...d, startDate: e.target.value })} />
              </div>
              <div>
                <Label>{t.meds.endDate}</Label>
                <Input type="date" className="mt-1.5" value={d.endDate} disabled={d.ongoing} onChange={(e) => setD({ ...d, endDate: e.target.value })} />
                <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={d.ongoing} onChange={(e) => setD({ ...d, ongoing: e.target.checked })} />
                  {t.meds.ongoing}
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 fade-in-up">
            <h2 className="font-semibold">3. {t.meds.summary}</h2>
            <div className="rounded-2xl bg-secondary/40 border border-border p-5">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Pill className="h-6 w-6" /></div>
                <div>
                  <div className="font-bold text-lg">{d.name || "Dori"} {d.dosage}{d.unit}</div>
                  <div className="text-sm text-muted-foreground">{d.disease} · {d.instructions || "—"}</div>
                  <div className="text-sm mt-2">⏰ Har kuni {d.times.join(", ")}</div>
                  <div className="text-xs text-muted-foreground mt-1">{d.startDate} {d.ongoing ? `— ${t.meds.ongoing}` : `— ${d.endDate || "..."}`}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-2"><ArrowLeft className="h-4 w-4" /> {t.common.back}</Button>}
          {step < 3 ? (
            <Button onClick={next} className="ml-auto gap-2">{t.common.next} <ArrowRight className="h-4 w-4" /></Button>
          ) : (
            <Button onClick={submit} className="ml-auto gap-2"><Check className="h-4 w-4" /> {t.common.save}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
