import { ExternalLink, FileText } from "lucide-react";
import {
  extractionChecklist,
  reviewCorpusFolder,
  screenedSources,
  sourceCorpusSummary,
  type SourceDisposition,
} from "@/lib/literature-corpus";

const dispositionLabels: Record<SourceDisposition, string> = {
  core: "Core evidence",
  context: "Context",
  excluded: "Excluded from comparison",
};

const dispositionClasses: Record<SourceDisposition, string> = {
  core: "bg-accent text-accent-foreground",
  context: "bg-muted text-muted-foreground",
  excluded: "bg-warning text-warning-foreground",
};

export function SourceCorpusPanel() {
  return (
    <section aria-labelledby="source-corpus-title" className="mb-6 rounded-lg border bg-card">
      <div className="border-b px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="source-corpus-title" className="text-sm font-semibold">
              Supplied literature set
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The full source set was screened by title, abstract, and citation metadata. Full-text
              extraction and verification audit documentation are still in progress. The original 22
              extracted records are marked verified based on team confirmation. New 316L
              verification statuses and limitations are summarized in the measurements section
              below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-[10px]">
            <span className="rounded bg-accent px-2 py-1 text-accent-foreground">
              {sourceCorpusSummary.core} core
            </span>
            <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
              {sourceCorpusSummary.context} context
            </span>
            <span className="rounded bg-warning px-2 py-1 text-warning-foreground">
              {sourceCorpusSummary.excluded} excluded
            </span>
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {sourceCorpusSummary.pdfFiles} local PDF files are consolidated into{" "}
          {sourceCorpusSummary.uniqueStudies} study records. Duplicate copies are grouped. The
          original PDFs remain in the supplied Downloads folder; they are not copied into or
          uploaded by this app.
        </p>
        <details className="mt-2 text-[11px] text-muted-foreground">
          <summary className="cursor-pointer">Supplied source folder</summary>
          <p className="mt-1 break-all font-mono">{reviewCorpusFolder}</p>
        </details>
        <details className="mt-3 border-t pt-3 text-xs">
          <summary className="cursor-pointer font-medium">
            Extraction checklist informed by this source set
          </summary>
          <ul className="mt-2 grid gap-1.5 text-muted-foreground md:grid-cols-2">
            {extractionChecklist.map((field) => (
              <li key={field} className="flex gap-2">
                <span aria-hidden="true" className="text-primary">
                  ·
                </span>
                {field}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            These are the fields used for extraction. Original verified records and newer 316L
            results with pending verification are shown in the measurements section below.
          </p>
        </details>
      </div>
      <div className="max-h-[34rem] divide-y overflow-y-auto">
        {screenedSources.map((source) => (
          <article key={source.id} className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="max-w-4xl text-sm font-medium leading-relaxed">{source.title}</h3>
              <span
                className={`shrink-0 rounded px-2 py-1 font-mono text-[10px] ${dispositionClasses[source.disposition]}`}
              >
                {dispositionLabels[source.disposition]}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{source.reference}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {source.doi && (
                <a
                  href={`https://doi.org/${source.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                >
                  DOI {source.doi} <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {source.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{source.rationale}</p>
            <details className="mt-2 text-[11px] text-muted-foreground">
              <summary className="cursor-pointer">
                Local source file{source.files.length === 1 ? "" : "s"}
              </summary>
              <ul className="mt-1 list-inside list-disc break-all">
                {source.files.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
