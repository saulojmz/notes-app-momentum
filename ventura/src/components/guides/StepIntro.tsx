import type { ReactNode } from "react";

/** Eyebrow + display headline that opens each booking step. */
export const StepIntro = ({ eyebrow, title, description }: { eyebrow?: string; title: ReactNode; description?: ReactNode }) => (
  <div className="space-y-2">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className="text-display text-[34px]">{title}</h2>
    {description && <p className="text-[15px] text-muted-foreground">{description}</p>}
  </div>
);

export const Field = ({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-baseline justify-between">
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="meta">{hint}</p>}
    </div>
    {children}
  </div>
);
