import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { parseDate, formatDate } from "@/lib/interestCalculations";
import { WheelDatePicker } from "./WheelDatePicker";

interface DateFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateField({ id, value, onChange }: DateFieldProps) {
  const selected = parseDate(value) ?? undefined;
  const [view, setView] = useState<"wheel" | "grid">("wheel");

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
            <div className="flex gap-1 border-b border-border/60 p-2">
              {(["wheel", "grid"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    view === v
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {v === "wheel" ? "Roll" : "Calendar"}
                </button>
              ))}
            </div>
            {view === "wheel" ? (
              <WheelDatePicker
                value={selected}
                onChange={(date) => onChange(formatDate(date))}
              />
            ) : (
              <Calendar
                mode="single"
                selected={selected}
                defaultMonth={selected}
                captionLayout="dropdown-buttons"
                fromYear={1970}
                toYear={new Date().getFullYear() + 30}
                onSelect={(date) => date && onChange(formatDate(date))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
