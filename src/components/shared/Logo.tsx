import { Heart } from "lucide-react";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dims} rounded-2xl gradient-primary grid place-items-center text-primary-foreground shadow-elegant`}>
        <Heart className="h-1/2 w-1/2" strokeWidth={2.5} fill="currentColor" />
      </div>
      <div className="leading-tight">
        <div className={`${text} font-extrabold tracking-tight`}>AI Hamroh</div>
      </div>
    </div>
  );
}
