import { useState } from "react";
import { Bell, Check, Send, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLang } from "@/i18n/LangProvider";
import { Lang } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const { user } = useAuth();
  const [tg, setTg] = useState(false);
  const [notif, setNotif] = useState({ missed: true, risk: true, weekly: false });

  const langOpts: { v: Lang; label: string }[] = [
    { v: "uz", label: "O'zbek" },
    { v: "ru", label: "Русский" },
    { v: "en", label: "English" },
  ];

  return (
    <div className="container max-w-2xl py-6 lg:py-10 space-y-5">
      <h1 className="text-2xl lg:text-3xl font-extrabold">{t.settings.title}</h1>

      {/* Profile */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold flex items-center gap-2 mb-4"><UserIcon className="h-5 w-5" /> {t.settings.profile}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Ism</span><span className="font-medium">{user?.full_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Telefon</span><span className="font-medium">{user?.phone}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Rol</span><span className="font-medium capitalize">{user?.role}</span></div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold mb-4">{t.settings.language}</h2>
        <div className="grid grid-cols-3 gap-2">
          {langOpts.map((l) => (
            <button
              key={l.v}
              onClick={() => setLang(l.v)}
              className={cn("py-3 rounded-2xl border-2 font-semibold text-sm transition-base",
                lang === l.v ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Telegram */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold flex items-center gap-2 mb-1"><Send className="h-5 w-5" /> {t.settings.telegram}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t.settings.telegramConnect}</p>
        {tg ? (
          <div className="flex items-center gap-2 text-risk-low text-sm font-semibold"><Check className="h-4 w-4" /> {t.settings.connected}</div>
        ) : (
          <Button onClick={() => { setTg(true); toast.success("Telegram ulandi"); }} className="gap-2">
            <Send className="h-4 w-4" /> {t.settings.connect}
          </Button>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-card">
        <h2 className="font-bold flex items-center gap-2 mb-4"><Bell className="h-5 w-5" /> {t.settings.notifications}</h2>
        <div className="space-y-3">
          {[
            { k: "missed" as const, label: t.settings.notifyMissed },
            { k: "risk" as const, label: t.settings.notifyRisk },
            { k: "weekly" as const, label: t.settings.notifyWeekly },
          ].map((it) => (
            <div key={it.k} className="flex items-center justify-between py-1">
              <span className="text-sm">{it.label}</span>
              <Switch checked={notif[it.k]} onCheckedChange={(v) => setNotif({ ...notif, [it.k]: v })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
