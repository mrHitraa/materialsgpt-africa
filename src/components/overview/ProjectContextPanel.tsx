import { projectContext } from "@/lib/project-context";

export function ProjectContextPanel() {
  const { salt, temperatureC, materials, objective } = projectContext;
  return (
    <section className="rounded-lg border bg-card">
      <div className="border-b px-5 py-3">
        <h2 className="text-sm font-semibold">Project context</h2>
        <p className="text-xs text-muted-foreground">Scope definition for the current study</p>
      </div>
      <dl className="divide-y text-sm">
        <div className="px-5 py-4">
          <dt className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Salt composition</dt>
          <dd className="space-y-2">
            {salt.components.map((c) => (
              <div key={c.compound}>
                <div className="flex justify-between">
                  <span>{c.label} <span className="font-mono text-muted-foreground">{c.compound}</span></span>
                  <span className="font-mono">{c.wtPercent} wt%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.wtPercent}%` }} />
                </div>
              </div>
            ))}
          </dd>
        </div>
        <div className="flex justify-between px-5 py-4">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Temperature</dt>
          <dd className="font-mono text-heat">≈ {temperatureC} °C</dd>
        </div>
        <div className="px-5 py-4">
          <dt className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Candidate materials</dt>
          <dd>
            <ul className="space-y-1.5">
              {materials.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-2">
                  <div>
                    <div>{m.name}</div>
                    {"note" in m && m.note && <div className="text-xs text-muted-foreground">{m.note}</div>}
                  </div>
                  <span
                    className={
                      m.status === "conditional"
                        ? "shrink-0 rounded bg-warning px-1.5 py-0.5 font-mono text-[10px] text-warning-foreground"
                        : "shrink-0 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] text-accent-foreground"
                    }
                  >
                    {m.status}
                  </span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="px-5 py-4">
          <dt className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Objective</dt>
          <dd className="leading-relaxed text-muted-foreground">{objective}</dd>
        </div>
      </dl>
    </section>
  );
}
