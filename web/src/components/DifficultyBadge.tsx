import { difficultyConfig } from "@/lib/colors";

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: "beginner" | "intermediate" | "advanced";
}) {
  const config = difficultyConfig[difficulty];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeClass}`}
    >
      <span>{config.stars}</span>
      <span>{config.label}</span>
    </span>
  );
}
