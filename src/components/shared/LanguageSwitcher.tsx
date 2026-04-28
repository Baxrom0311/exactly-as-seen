import { useLang } from "@/i18n/LangProvider";
import { Lang } from "@/i18n/translations";
import { Globe } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const labels: Record<Lang, string> = { uz: "O'zbek", ru: "Русский", en: "English" };

export default function LanguageSwitcher({ minimal = false }: { minimal?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={minimal ? "icon" : "sm"} className="gap-2">
          <Globe className="h-4 w-4" />
          {!minimal && <span className="text-sm font-medium">{lang.toUpperCase()}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(["uz", "ru", "en"] as Lang[]).map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLang(l)} className={lang === l ? "font-semibold text-primary" : ""}>
            {labels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
