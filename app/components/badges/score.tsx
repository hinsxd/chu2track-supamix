import { useMemo } from "react";

import { Badge } from "~/components/ui/badge";

export const ScoreBadge = ({ score }: { score: number }) => {
  const text = useMemo(() => {
    if (score >= 1_009_000) return "SSS+";
    if (score >= 1_007_500) return "SSS";
    if (score >= 1_005_000) return "SS+";
    if (score >= 1_000_000) return "SS";
    if (score >= 990_000) return "S+";
    if (score >= 975_000) return "S";
    return "-";
  }, [score]);
  // TODO: colors for badges
  return (
    <Badge className="rounded-full" variant="secondary">
      {text}
    </Badge>
  );
};
