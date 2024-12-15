import { Badge } from "~/components/ui/badge";

export const ComboBadge = ({
  fullCombo,
  allJustice,
}: {
  fullCombo?: boolean;
  allJustice?: boolean;
}) => {
  if (allJustice) {
    return (
      <Badge className="rounded-full" variant="secondary">
        AJ
      </Badge>
    );
  }
  if (fullCombo) {
    return (
      <Badge className="rounded-full" variant="secondary">
        FC
      </Badge>
    );
  }
  return null;
};
