import Link from "next/link";

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-section-alt-gradient py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-cta-gradient px-8 py-16 text-center card-float-lg sm:px-16 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12) 0%, transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
            }}
          />

          <div className="relative">
            <h2
              id="cta-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Ready to find your next repo?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Describe your project above and let AI surface the most relevant
              open-source options on GitHub.
            </p>
            <Link
              href="/search"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-badge-gradient px-8 py-3.5 text-sm font-semibold text-brand shadow-lg transition-transform hover:scale-[1.02]"
            >
              Start searching
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
