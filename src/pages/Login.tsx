import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLang } from "@/i18n/LangProvider";
import { useAuth, homeForRole } from "@/hooks/useAuth";

export default function Login() {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("901111111");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 9) { toast.error("9 raqamli telefon kiriting"); return; }
    if (password.length < 6) { toast.error("Parol kamida 6 belgi"); return; }
    setLoading(true);
    try {
      const user = await login("+998" + phone, password);
      toast.success("Xush kelibsiz, " + user.full_name);
      navigate(homeForRole(user.role));
    } catch {
      toast.error("Kirishda xatolik");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="container flex items-center justify-between h-16">
        <Link to="/"><Logo /></Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 grid place-items-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl border border-border shadow-elegant p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold">{t.auth.welcomeBack}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t.auth.welcomeBackSub}</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="phone">{t.auth.phone}</Label>
                <div className="mt-1.5 flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring overflow-hidden">
                  <span className="pl-3 pr-2 text-muted-foreground flex items-center gap-2 border-r border-border">
                    <Phone className="h-4 w-4" /> +998
                  </span>
                  <Input
                    id="phone"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    className="border-0 focus-visible:ring-0"
                    placeholder="90 111 11 11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pwd">{t.auth.password}</Label>
                <div className="mt-1.5 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pwd"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                  {t.auth.remember}
                </label>
                <button type="button" className="text-sm text-primary hover:underline">{t.auth.forgotPwd}</button>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.common.login}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                {t.auth.noAccount}{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">{t.auth.registerLink}</Link>
              </p>
            </form>
          </div>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            {t.auth.demoHint}
            <br />
            <span className="text-[10px]">(suffix 22 → family · 33 → doctor)</span>
          </p>
        </div>
      </main>
    </div>
  );
}
