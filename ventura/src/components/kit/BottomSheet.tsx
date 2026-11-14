import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
}

/**
 * Modal sheet that rises from the bottom edge. Sits above the floating dock.
 */
export const BottomSheet = ({ open, onClose, children, className, label }: BottomSheetProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-scrim/40 animate-fade-only" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[61] mx-auto max-h-[92vh] max-w-xl overflow-y-auto rounded-t-3xl bg-card shadow-lg animate-slide-up",
          className,
        )}
      >
        <div className="sticky top-0 z-10 flex justify-center pb-1 pt-2.5">
          <div className="h-1 w-10 rounded-full bg-foreground/15" />
        </div>
        {children}
      </div>
    </>
  );
};
