import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, Stethoscope, User, Users } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLang } from "@/i18n/LangProvider";
import { useAuth, homeForRole } from "@/hooks/useAuth";
import { Role } from "@/api/types";
import { cn } from "@/lib/utils";

export default function Register() {
  const { t, lang } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [d, setD] = useState({
    full_name: "", phone: "", password: "", confirm: "",
    role: "patient" as Role, age: "", gender: "" as "" | "M" | "F",
    language: lang,
    terms: false,
  });

  const next = () => {
    if (step === 1) {
      if (!d.full_name) return toast.error("Ismingizni kiriting");
      if (d.phone.length !== 9) return toast.error("9 raqamli telefon");
      if (d.password.length < 6) return toast.error("Parol kamida 6 belgi");
      if (d.password !== d.confirm) return toast.error("Parollar mos emas");
    }
    if (step === 2) {
      if (!d.role) return toast.error("Rol tanlang");
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const submit = async () => {
    if (!d.terms) return toast.error("Shartlarga rozilik bering");
    setLoading(true);
    try {
      const u = await register({
        full_name: d.full_name,
        phone: "+998" + d.phone,
        password: d.password,
        role: d.role,
        age: d.age ? Number(d.age) : undefined,
        gender: d.gender || undefined,
        language: d.language,
      });
      toast.success("Ro'yxatdan o'tdingiz!");
      navigate(homeForRole(u.role));
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setLoading(false); }
  };

  const roleOptions: { value: Role; label: string; icon: any }[] = [
    { value: "patient", label: t.auth.rolePatient, icon: User },
    { value: "family", label: t.auth.roleFamily, icon: Users },
    { value: "doctor", label: t.auth.roleDoctor, icon: Stethoscope },
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="container flex items-center justify-between h-16">
        <Link to="/"><Logo /></Link>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 grid place-items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-3xl border border-border shadow-elegant p-8">
            <h1 className="text-2xl font-extrabold text-center">{t.auth.registerTitle}</h1>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-2 my-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={cn("h-8 w-8 rounded-full grid place-items-center text-sm font-bold transition-base",
                    step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {step > n ? <Check className="h-4 w-4" /> : n}
                  </div>
                  {n < 3 && <div className={cn("h-0.5 w-8 transition-base", step > n ? "bg-primary" : "bg-muted")} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 fade-in-up">
                <h2 className="font-semibold">{t.auth.step1}</h2>
                <div>
                  <Label>{t.auth.fullName}</Label>
                  <Input className="mt-1.5" value={d.full_name} onChange={(e) => setD({ ...d, full_name: e.target.value })} />
                </div>
                <div>
                  <Label>{t.auth.phone}</Label>
                  <div className="mt-1.5 flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring overflow-hidden">
                    <span className="px-3 text-muted-foreground border-r border-border">+998</span>
                    <Input value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value.replace(/\D/g, "").slice(0, 9) })} className="border-0 focus-visible:ring-0" placeholder="90 111 11 11" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t.auth.password}</Label>
                    <Input type="password" className="mt-1.5" value={d.password} onChange={(e) => setD({ ...d, password: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.auth.confirmPwd}</Label>
                    <Input type="password" className="mt-1.5" value={d.confirm} onChange={(e) => setD({ ...d, confirm: e.target.value })} />
                  </div>
                </div>
                {d.password && (
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full transition-base" style={{
                      width: `${Math.min(100, d.password.length * 12)}%`,
                      backgroundColor: d.password.length < 6 ? "hsl(var(--destructive))" : d.password.length < 10 ? "hsl(var(--risk-medium))" : "hsl(var(--risk-low))",
                    }} />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 fade-in-up">
                <h2 className="font-semibold">{t.auth.step2}</h2>
                <div>
                  <Label>{t.auth.role}</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {roleOptions.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setD({ ...d, role: r.value })}
                        className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-base",
                          d.role === r.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}
                      >
                        <r.icon className={cn("h-6 w-6", d.role === r.value ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-xs font-semibold">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t.auth.age}</Label>
                    <Input type="number" className="mt-1.5" value={d.age} onChange={(e) => setD({ ...d, age: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t.auth.gender}</Label>
                    <div className="mt-1.5 grid grid-cols-3 gap-1">
                      {[{ v: "M", l: t.auth.male }, { v: "F", l: t.auth.female }, { v: "", l: t.auth.skip }].map((g) => (
                        <button
                          key={g.v}
                          type="button"
                          onClick={() => setD({ ...d, gender: g.v as any })}
                          className={cn("py-2 rounded-lg border text-xs font-medium",
                            d.gender === g.v ? "border-primary bg-primary/10 text-primary" : "border-border")}
                        >{g.l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 fade-in-up">
                <h2 className="font-semibold">{t.auth.step3}</h2>
                <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-1.5 text-sm">
                  <div><span className="text-muted-foreground">{t.auth.fullName}:</span> <span className="font-medium">{d.full_name}</span></div>
                  <div><span className="text-muted-foreground">{t.auth.phone}:</span> <span className="font-medium">+998 {d.phone}</span></div>
                  <div><span className="text-muted-foreground">{t.auth.role}:</span> <span className="font-medium">{roleOptions.find(r => r.value === d.role)?.label}</span></div>
                  {d.age && <div><span className="text-muted-foreground">{t.auth.age}:</span> <span className="font-medium">{d.age}</span></div>}
                </div>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <Checkbox checked={d.terms} onCheckedChange={(v) => setD({ ...d, terms: !!v })} className="mt-0.5" />
                  <span className="text-muted-foreground">{t.auth.terms}</span>
                </label>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> {t.common.back}
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={next} className="ml-auto gap-2">
                  {t.common.next} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={loading} className="ml-auto gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t.auth.submit} <Check className="h-4 w-4" /></>}
                </Button>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-center text-muted-foreground">
            <Link to="/login" className="text-primary font-semibold hover:underline">{t.common.login}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
