import { SectionHeader } from "@/components/landing/SectionHeader";

const FEATURES = [
  {
    title: "Natural language",
    description:
      "Describe your SaaS, CLI, or library idea — no GitHub search syntax or boolean operators needed.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.84 1.641l.332 1.659c.089.445.445.764.89.764.053 0 .106-.005.159-.015l1.659-.332c.601-.1 1.194-.408 1.641-.84C7.976 19.141 9.895 20.25 12 20.25Z"
      />
    ),
  },
  {
    title: "AI-powered ranking",
    description:
      "Each repo is scored on tech fit, completeness, and how well it matches your goals and requirements.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    ),
  },
  {
    title: "Actionable insights",
    description:
      "See detected technologies, strengths, gaps, and why each repo is recommended before you commit.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
      />
    ),
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-24 bg-section-alt-gradient py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Features"
          title="Built for developers who value their time"
          description="Everything you need to evaluate open-source options quickly, without tab-hopping through dozens of repos."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group gradient-border card-float rounded-3xl transition-shadow hover:card-float-lg"
            >
              <div className="gradient-border-inner rounded-3xl p-8">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-icon-gradient text-brand transition-all group-hover:bg-icon-gradient-active group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3
                id={feature.title === "Natural language" ? "features-heading" : undefined}
                className="text-lg font-semibold text-brand"
              >
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-brand-muted">
                {feature.description}
              </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
