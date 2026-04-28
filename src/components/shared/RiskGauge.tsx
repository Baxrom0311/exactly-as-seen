import { cn } from "@/lib/utils";

interface Props {
  score: number; // 0-100
  size?: number;
  label?: string;
}

export default function RiskGauge({ score, size = 160, label }: Props) {
  const r = (size - 18) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const level =
    score <= 30 ? "low" : score <= 60 ? "medium" : score <= 80 ? "high" : "critical";
  const colorVar = `var(--risk-${level})`;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--muted))" strokeWidth={12} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={`hsl(${colorVar})`}
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 0.7s ease, stroke 0.3s" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={cn("text-4xl font-extrabold tabular-nums")} style={{ color: `hsl(${colorVar})` }}>{score}</div>
          {label && <div className="text-xs text-muted-foreground mt-1 max-w-[120px] mx-auto">{label}</div>}
        </div>
      </div>
    </div>
  );
}
