import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Calendar, LayoutDashboard, LogOut, MessageCircle, Pill, Settings, Users, Stethoscope } from "lucide-react";
import Logo from "@/components/shared/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LangProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavItem { to: string; label: string; icon: any; }

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const items: NavItem[] = (() => {
    if (user?.role === "doctor") return [
      { to: "/doctor-dashboard", label: t.nav.patients, icon: Stethoscope },
      { to: "/settings", label: t.nav.settings, icon: Settings },
    ];
    if (user?.role === "family") return [
      { to: "/family-dashboard", label: t.nav.family, icon: Users },
      { to: "/chat", label: t.nav.chat, icon: MessageCircle },
      { to: "/settings", label: t.nav.settings, icon: Settings },
    ];
    return [
      { to: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
      { to: "/medications", label: t.nav.medications, icon: Pill },
      { to: "/adherence", label: t.nav.adherence, icon: Calendar },
      { to: "/chat", label: t.nav.chat, icon: MessageCircle },
      { to: "/settings", label: t.nav.settings, icon: Settings },
    ];
  })();

  const initials = (user?.full_name ?? "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur-sm">
        <div className="px-6 py-5 border-b border-border">
          <Logo />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-base ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <it.icon className="h-4.5 w-4.5" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {t.common.logout}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 lg:px-8 h-16 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="lg:hidden"><Logo size="sm" /></div>
          <div className="hidden lg:block text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("uz-UZ", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{user?.full_name}</div>
                  <div className="text-xs text-muted-foreground font-normal">{user?.phone}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>{t.common.settings}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>{t.common.logout}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md">
          <div className="grid grid-cols-5">
            {items.slice(0, 5).map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <it.icon className="h-5 w-5" />
                {it.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
