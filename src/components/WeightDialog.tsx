"use client";

import { useRef, useState, type FormEvent, type RefObject } from "react";
import { Minus, Plus } from "lucide-react";

import { weightButtonId } from "@/components/ExerciseItem";
import { useLevel } from "@/components/LevelTheme";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { LoggedWeight } from "@/hooks/useWorkoutProgress";
import { formatKg, formatShortDate } from "@/lib/format";
import { isValidWeight, MAX_WEIGHT_KG } from "@/lib/storage";

const STEP_KG = 2.5;

type WeightDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The exercise being edited; kept after closing so the close animation has content. */
  exercise: { id: string; name: string; session: number } | null;
  weight: LoggedWeight | null;
  onSave: (kg: number | null) => void;
};

/** Accepts "42.5" and "42,5" (comma-decimal keyboards). `null` if not a valid weight. */
function parseKg(value: string): number | null {
  const kg = Number(value.trim().replace(",", "."));
  if (value.trim() === "" || !isValidWeight(kg)) return null;
  return Math.round(kg * 100) / 100;
}

export function WeightDialog({ open, onOpenChange, exercise, weight, onSave }: WeightDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const level = useLevel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-level={level}
        showCloseButton={false}
        className="rounded-3xl border-border bg-card p-6 sm:max-w-sm"
        onOpenAutoFocus={(event) => {
          // Focus the number field (opening the keypad) instead of the first stepper.
          event.preventDefault();
          inputRef.current?.focus();
          inputRef.current?.select();
        }}
        onCloseAutoFocus={(event) => {
          // There's no DialogTrigger (a long press can open it too), so Radix has
          // nowhere to return focus. Send it back to the row's weight button.
          if (!exercise) return;
          event.preventDefault();
          document.getElementById(weightButtonId(exercise.id))?.focus();
        }}
      >
        {exercise && (
          <WeightForm
            // A fresh form per opening, so a cancelled edit never leaks into the next one.
            key={exercise.session}
            name={exercise.name}
            weight={weight}
            inputRef={inputRef}
            onCancel={() => onOpenChange(false)}
            onSave={(kg) => {
              onSave(kg);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type WeightFormProps = {
  name: string;
  weight: LoggedWeight | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onCancel: () => void;
  onSave: (kg: number | null) => void;
};

function WeightForm({ name, weight, inputRef, onCancel, onSave }: WeightFormProps) {
  const [value, setValue] = useState(weight ? formatKg(weight.kg) : "");
  const [error, setError] = useState(false);
  const errorId = "weight-error";

  const step = (delta: number) => {
    const next = (parseKg(value) ?? 0) + delta;
    if (next <= 0 || next > MAX_WEIGHT_KG) return;
    setValue(formatKg(next));
    setError(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const kg = parseKg(value);
    if (kg === null) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    onSave(kg);
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <DialogHeader className="text-left">
        <DialogTitle className="text-xl leading-tight font-black tracking-tight">{name}</DialogTitle>
        <DialogDescription>
          {weight
            ? `Last logged ${formatShortDate(weight.updatedAt)}: ${formatKg(weight.kg)} kg.`
            : "Log the weight you lifted so you can match or beat it next time."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          aria-label={`Decrease by ${STEP_KG} kg`}
          onClick={() => step(-STEP_KG)}
          className="size-12 shrink-0 rounded-xl"
        >
          <Minus aria-hidden />
        </Button>
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            aria-label="Weight in kilograms"
            aria-invalid={error || undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder="0"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(false);
            }}
            className="h-14 rounded-xl pr-12 text-center text-2xl font-black tabular-nums md:text-2xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
          >
            kg
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          aria-label={`Increase by ${STEP_KG} kg`}
          onClick={() => step(STEP_KG)}
          className="size-12 shrink-0 rounded-xl"
        >
          <Plus aria-hidden />
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="-mt-3 text-sm text-destructive">
          Enter a weight above 0 and up to {MAX_WEIGHT_KG} kg.
        </p>
      )}

      <div className="grid gap-2">
        <Button type="submit" className="h-12 rounded-xl text-base font-bold">
          Save weight
        </Button>
        <div className={weight ? "grid grid-cols-2 gap-2" : "grid"}>
          {weight && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSave(null)}
              className="h-11 rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-destructive"
            >
              Remove weight
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-11 rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
