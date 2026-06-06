interface ShowcaseCardProps {
  children: React.ReactNode;
  className?: string;
}

function ShowcaseCard({ children, className = "" }: ShowcaseCardProps) {
  return (
    <div
      className={[
        "w-full rounded-3xl border border-brand-border/70 bg-brand-surface p-6 sm:p-7 card-float-lg",
        "transition-transform duration-300 ease-out hover:scale-[1.02]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function ProductShowcase() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mt-8 max-w-6xl px-4 sm:mt-10 sm:px-6 lg:px-8"
    >
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-6 xl:gap-8 lg:perspective-[1400px]">
        <ShowcaseCard className="lg:-rotate-6 lg:translate-x-1 lg:translate-y-3">
          <p className="text-xs font-semibold text-brand">Search query</p>
          <div className="mt-4 rounded-2xl border border-brand-border/50 bg-brand-bg/50 p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-brand-muted">
              Multi-tenant SaaS starter with Next.js, Stripe, and Supabase auth
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {["nextjs", "saas", "stripe", "supabase"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-bg px-3 py-1 text-xs font-medium text-brand"
              >
                {tag}
              </span>
            ))}
          </div>
        </ShowcaseCard>

        <ShowcaseCard className="relative z-10 lg:rotate-3 lg:translate-y-6 lg:scale-[1.03]">
          <p className="text-xs font-semibold text-brand">AI analysis</p>
          <div className="mt-5 space-y-3.5">
            {[
              { label: "Understanding requirements", done: true },
              { label: "Searching GitHub", done: true },
              { label: "Evaluating repositories", active: true },
            ].map((step) => (
              <div
                key={step.label}
                className={[
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm",
                  step.active
                    ? "bg-brand text-white shadow-md shadow-brand/15"
                    : "bg-brand-bg/60 text-brand-muted",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                    step.active
                      ? "bg-white/20"
                      : step.done
                        ? "bg-brand/10 text-brand"
                        : "bg-brand-secondary/50",
                  ].join(" ")}
                >
                  {step.done ? "✓" : "·"}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </ShowcaseCard>

        <ShowcaseCard className="lg:rotate-6 lg:-translate-x-1 lg:translate-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-muted">Top match</p>
              <p className="mt-1.5 text-sm font-semibold text-brand">
                nextjs-saas-starter
              </p>
            </div>
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              92%
            </span>
          </div>
          <ul className="mt-5 space-y-2.5 text-sm text-brand-muted">
            <li className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              Stripe + Supabase integrated
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">✓</span>
              Multi-tenant architecture
            </li>
            <li className="flex gap-2">
              <span className="text-brand-secondary">−</span>
              No built-in admin dashboard
            </li>
          </ul>
          <div className="mt-5 flex gap-2.5">
            <span className="rounded-lg bg-brand-bg px-2.5 py-1 text-xs text-brand">
              Next.js
            </span>
            <span className="rounded-lg bg-brand-bg px-2.5 py-1 text-xs text-brand">
              TypeScript
            </span>
          </div>
        </ShowcaseCard>
      </div>
    </div>
  );
}
