import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { parseDate, formatDate } from "@/lib/interestCalculations";
import { WheelDatePicker } from "./WheelDatePicker";

interface DateFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateField({ id, value, onChange }: DateFieldProps) {
  const selected = parseDate(value) ?? undefined;

  return (
    <div className="relative">
      <Input
        id={id}
        placeholder="DD/MM/YYYY"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open calendar"
            className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50 bg-popover" align="end">
          <div className="pointer-events-auto">
            <WheelDatePicker
              value={selected}
              onChange={(date) => onChange(formatDate(date))}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
