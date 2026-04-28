import { Link } from "react-router-dom";
import { ArrowRight, Bell, MessageCircle, Shield, Users, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLang } from "@/i18n/LangProvider";

export default function Landing() {
  const { t } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link to="/login"><Button variant="ghost" size="sm">{t.common.login}</Button></Link>
            <Link to="/register"><Button size="sm">{t.common.register}</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero">
        <div className="container py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium text-muted-foreground mb-6 shadow-sm">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Tibbiy ma'lumotlar himoyalangan · WCAG AA
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              {t.landing.hero1}
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
                {t.landing.hero2}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">{t.landing.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 shadow-elegant">
                  {t.landing.ctaStart}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">{t.landing.ctaLogin}</Button>
              </Link>
            </div>
          </div>

          {/* Mock dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative bg-card rounded-3xl border border-border shadow-elegant p-6 fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Bugun</div>
                  <div className="text-xl font-bold">Salom, Aziza!</div>
                </div>
                <div className="h-12 w-12 rounded-full gradient-primary grid place-items-center text-primary-foreground font-bold">A</div>
              </div>
              <div className="space-y-2.5">
                {[
                  { time: "08:00", name: "Isoniazid 300mg", taken: true },
                  { time: "08:00", name: "Rifampicin 600mg", taken: true },
                  { time: "14:00", name: "Pyrazinamide 1500mg", taken: false },
                ].map((d, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${d.taken ? "bg-muted/40 border-border" : "bg-primary/5 border-primary/30"}`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`h-5 w-5 ${d.taken ? "text-risk-low" : "text-muted-foreground/40"}`} />
                      <div>
                        <div className="text-sm font-semibold">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.time}</div>
                      </div>
                    </div>
                    {!d.taken && <Button size="sm">Ichdim</Button>}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl gradient-greeting flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <div className="text-xs">🔥 5 kun ketma-ket — davom eting!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">{t.landing.featuresTitle}</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: MessageCircle, title: t.landing.f1Title, desc: t.landing.f1Desc, color: "text-primary bg-primary/10" },
            { icon: Bell, title: t.landing.f2Title, desc: t.landing.f2Desc, color: "text-accent bg-accent/10" },
            { icon: Users, title: t.landing.f3Title, desc: t.landing.f3Desc, color: "text-warm bg-warm/10" },
          ].map((f, i) => (
            <div key={i} className="bg-card rounded-3xl border border-border p-6 shadow-card hover:shadow-elegant transition-base">
              <div className={`h-12 w-12 rounded-2xl grid place-items-center ${f.color} mb-4`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why this matters */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.landing.whyTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: t.landing.stat1, desc: t.landing.stat1Desc },
              { stat: t.landing.stat2, desc: t.landing.stat2Desc },
              { stat: t.landing.stat3, desc: t.landing.stat3Desc },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-extrabold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{s.stat}</div>
                <div className="mt-3 text-muted-foreground max-w-xs mx-auto">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Bugun boshlang</h2>
        <p className="mt-3 text-muted-foreground">Bepul, oddiy va xavfsiz</p>
        <Link to="/register"><Button size="lg" className="mt-6 gap-2 shadow-elegant">{t.landing.ctaStart} <ArrowRight className="h-4 w-4" /></Button></Link>
      </section>

      <footer className="border-t border-border">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-sm text-muted-foreground">{t.landing.footer}</div>
        </div>
      </footer>
    </div>
  );
}
