import { useCallback, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type MultiSelectProps = React.ComponentProps<typeof DropdownMenu> & {
  triggerLabel: string;
  label: string;
  options: { label: string; value: string }[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};
export function MultiSelect({
  triggerLabel,
  label,
  options,
  value: controlledValue = [],
  defaultValue = [],
  onValueChange,
}: MultiSelectProps) {
  const isControlled = !!controlledValue;
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const value = isControlled ? controlledValue : selectedValues;

  const onValueChangeRef = useRef(onValueChange);

  const onToggle = useCallback(
    (field: string) => {
      const newValue = value.includes(field)
        ? value.filter((item) => item !== field)
        : [...value, field];

      onValueChangeRef.current?.(newValue);
      setSelectedValues(newValue);
    },
    [value]
  );

  const isSelected = useCallback(
    (field: string) => value.includes(field),
    [value]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value.length >= 2
            ? `${value.length} selected`
            : value.length
              ? `${value[0]}`
              : triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {options.map((option) => {
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected(option.value)}
              onCheckedChange={() => onToggle(option.value)}
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
