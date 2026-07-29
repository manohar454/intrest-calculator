import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ITEM_H = 40;

let audioCtx: AudioContext | null = null;
function playTick() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1400, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    /* audio unavailable */
  }
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface WheelColumnProps {
  values: number[];
  labels?: string[];
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  width?: string;
}

function WheelColumn({ values, labels, value, onChange, ariaLabel, width }: WheelColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const lastTickIndex = useRef<number>(-1);
  const index = Math.max(0, values.indexOf(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) {
      el.scrollTo({ top: target, behavior: "auto" });
    }
  }, [index]);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const current = Math.min(
      values.length - 1,
      Math.max(0, Math.round(el.scrollTop / ITEM_H)),
    );
    if (current !== lastTickIndex.current) {
      lastTickIndex.current = current;
      playTick();
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const i = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.min(values.length - 1, Math.max(0, i));
      if (values[clamped] !== value) onChange(values[clamped]);
      el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
    }, 90);
  };

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={handleScroll}
      className={cn(
        "relative h-[200px] overflow-y-auto snap-y snap-mandatory no-scrollbar text-center",
        width ?? "w-16",
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <div style={{ height: ITEM_H * 2 }} />
      {values.map((v, i) => (
        <button
          key={v}
          type="button"
          role="option"
          aria-selected={v === value}
          onClick={() => onChange(v)}
          className={cn(
            "flex w-full snap-center items-center justify-center text-sm transition-all",
            v === value
              ? "font-semibold text-primary"
              : Math.abs(i - index) === 1
                ? "text-foreground/60"
                : "text-muted-foreground/50 scale-95",
          )}
          style={{ height: ITEM_H }}
        >
          {labels ? labels[i] : v}
        </button>
      ))}
      <div style={{ height: ITEM_H * 2 }} />
    </div>
  );
}

interface WheelDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  fromYear?: number;
  toYear?: number;
}

export function WheelDatePicker({
  value,
  onChange,
  fromYear = 1970,
  toYear = new Date().getFullYear() + 30,
}: WheelDatePickerProps) {
  const base = value ?? new Date();
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const emit = (y: number, m: number, d: number) => {
    const max = new Date(y, m + 1, 0).getDate();
    onChange(new Date(y, m, Math.min(d, max)));
  };

  return (
    <div className="p-3">
      <div className="relative flex items-center justify-center gap-1 rounded-xl border border-border/60 bg-card px-2">
        {/* selection band */}
        <div
          className="pointer-events-none absolute inset-x-2 z-0 rounded-lg border-y border-primary/30 bg-primary/5"
          style={{ height: ITEM_H, top: `calc(50% - ${ITEM_H / 2}px)` }}
        />
        {/* fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-card to-transparent" />

        <WheelColumn
          ariaLabel="Day"
          values={days}
          value={Math.min(day, daysInMonth)}
          onChange={(d) => emit(year, month, d)}
        />
        <WheelColumn
          ariaLabel="Month"
          values={months}
          labels={MONTH_NAMES.map((m) => m.slice(0, 3))}
          value={month}
          onChange={(m) => emit(year, m, day)}
          width="w-20"
        />
        <WheelColumn
          ariaLabel="Year"
          values={years}
          value={year}
          onChange={(y) => emit(y, month, day)}
          width="w-20"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onChange(new Date())}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          Today
        </button>
        <span className="text-xs text-muted-foreground">
          {String(Math.min(day, daysInMonth)).padStart(2, "0")} {MONTH_NAMES[month]} {year}
        </span>
      </div>
    </div>
  );
}
