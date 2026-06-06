interface MatchScoreBadgeProps {
  score: number;
}

function getScoreStyles(score: number): string {
  if (score >= 80) {
    return "bg-brand text-white shadow-md shadow-brand/15";
  }
  if (score >= 60) {
    return "bg-amber-100 text-amber-800";
  }
  return "bg-brand-bg text-brand-muted";
}

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-sm font-bold ${getScoreStyles(score)}`}
    >
      {score}% match
    </span>
  );
}
