import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Loader2 } from "lucide-react";

export function PageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  phaseNote,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  phaseNote?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-dashed bg-card px-6 py-14 text-center">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {phaseNote && (
          <span className="mt-4 rounded-full border bg-muted px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {phaseNote}
          </span>
        )}
      </div>
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground" role="status">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="flex-1">
        <div className="font-medium text-destructive">Something went wrong</div>
        <div className="mt-1 text-muted-foreground">{message}</div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="rounded-md border bg-card px-3 py-1 text-xs hover:bg-muted">
          Retry
        </button>
      )}
    </div>
  );
}
