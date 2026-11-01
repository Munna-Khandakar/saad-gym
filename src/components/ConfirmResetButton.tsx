"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmResetButtonProps = {
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  disabled?: boolean;
  size?: "default" | "sm";
  onConfirm: () => void;
};

/** A low-key reset button that asks for confirmation before doing anything. */
export function ConfirmResetButton({
  label,
  title,
  description,
  confirmLabel,
  disabled = false,
  size = "default",
  onConfirm,
}: ConfirmResetButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className={cn(
            "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
            size === "sm" ? "h-9 rounded-lg px-2.5 text-xs" : "h-11 rounded-xl px-4",
          )}
        >
          <RotateCcw aria-hidden className={size === "sm" ? "size-3.5" : undefined} />
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11 rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction className="h-11 rounded-xl font-semibold" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
