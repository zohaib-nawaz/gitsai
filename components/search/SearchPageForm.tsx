import { SearchForm } from "@/components/search/SearchForm";
import { SEARCH_PAGE_WIDTH } from "@/lib/search-layout";

const SEARCH_TIPS = [
  {
    title: "Be specific",
    description: "Name frameworks, databases, and integrations you need.",
  },
  {
    title: "Describe the product",
    description: "SaaS, CLI, API, dashboard — context helps ranking.",
  },
  {
    title: "Mention constraints",
    description: "Auth, payments, multi-tenant, deployment preferences.",
  },
] as const;

const STEPS = [
  "AI extracts keywords from your description",
  "GitHub is searched for relevant repositories",
  "Top matches are scored and ranked for you",
] as const;

export function SearchPageForm() {
  return (
    <div className={`py-10 sm:py-14 ${SEARCH_PAGE_WIDTH}`}>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
          Search
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
          Find the right GitHub repo
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
          Describe what you want to build. We&apos;ll search GitHub, analyze
          candidates with AI, and return ranked recommendations.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="card-float-lg rounded-3xl border border-brand-border/70 bg-brand-surface p-6 sm:p-8">
            <SearchForm size="large" showExamples />
          </div>
        </div>

        <aside className="flex flex-col gap-5 lg:col-span-2">
          <div className="rounded-3xl border border-brand-border/70 bg-brand-surface p-6">
            <p className="text-sm font-semibold text-brand">Tips for better results</p>
            <ul className="mt-4 space-y-4">
              {SEARCH_TIPS.map((tip) => (
                <li key={tip.title}>
                  <p className="text-sm font-medium text-brand">{tip.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-brand-muted">
                    {tip.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-brand-border/70 bg-brand-surface p-6">
            <p className="text-sm font-semibold text-brand">What happens next</p>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 text-sm leading-relaxed text-brand-muted"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-bg text-xs font-bold text-brand">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
