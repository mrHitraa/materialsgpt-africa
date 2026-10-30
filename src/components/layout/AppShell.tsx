import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Atom, Menu, Thermometer, X } from "lucide-react";
import { navItems } from "@/lib/navigation";
import { projectContext } from "@/lib/project-context";
import { cn } from "@/lib/utils";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 px-3" aria-label="Main">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:[&>svg]:text-sidebar-primary"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-6 py-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Atom className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-sidebar-accent-foreground">{projectContext.name}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
          {projectContext.team} · Phase 1
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <SidebarNav />
        <div className="mt-auto border-t border-sidebar-border px-6 py-4 font-mono text-[10px] text-sidebar-foreground/50">
          Open · Traceable · Explainable
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-sidebar">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded p-1 text-sidebar-foreground hover:bg-sidebar-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur md:px-6">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm font-semibold">{projectContext.name}</div>
          <div className={cn("ml-auto flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs")}>
            <Thermometer className="h-3.5 w-3.5 text-heat" />
            <span className="text-muted-foreground">Environment:</span>
            <span className="font-mono font-medium">Solar salt · ~{projectContext.temperatureC} °C</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
