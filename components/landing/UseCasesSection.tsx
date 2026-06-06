import { SectionHeader } from "@/components/landing/SectionHeader";

const USE_CASES = [
  {
    label: "SaaS starter",
    query:
      "Multi-tenant SaaS starter with Next.js, Stripe billing, and Supabase auth",
  },
  {
    label: "CLI tool",
    query: "Python CLI for batch image optimization with progress bars and config files",
  },
  {
    label: "UI library",
    query:
      "React component library with Tailwind CSS, accessibility, and Storybook docs",
  },
  {
    label: "API backend",
    query:
      "REST API boilerplate in Go with JWT auth, PostgreSQL, and Docker deployment",
  },
] as const;

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className="scroll-mt-24 border-t border-brand-border bg-section-gradient py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Use cases"
          title="Works for any kind of project"
          description="Whether you're bootstrapping a product, evaluating a framework, or finding a reference implementation — start with a clear description."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {USE_CASES.map((useCase) => (
            <figure
              key={useCase.label}
              className="gradient-border card-float rounded-3xl"
            >
              <div className="gradient-border-inner rounded-3xl p-6">
              <figcaption className="text-xs font-semibold uppercase tracking-[0.15em] gradient-text">
                {useCase.label}
              </figcaption>
              <div className="mt-4 flex gap-4">
                <div
                  className="w-1 shrink-0 rounded-full bg-gradient-to-b from-brand via-brand-light to-brand-secondary"
                  aria-hidden="true"
                />
                <blockquote
                  id={useCase.label === "SaaS starter" ? "use-cases-heading" : undefined}
                  className="text-base leading-relaxed text-brand-muted"
                >
                  &ldquo;{useCase.query}&rdquo;
                </blockquote>
              </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
