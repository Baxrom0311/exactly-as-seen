import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/40",
  high: "bg-risk-high/15 text-risk-high border-risk-high/40",
  critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/40",
};

export default function RiskBadge({ level, score }: { level: "low" | "medium" | "high" | "critical"; score?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", colorMap[level])}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--risk-${level}))` }} />
      {level.toUpperCase()}{score !== undefined ? ` · ${score}` : ""}
    </span>
  );
}
