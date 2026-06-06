import { CtaSection } from "@/components/landing/CtaSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { SearchForm } from "@/components/search/SearchForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-page-gradient">
      <section className="relative overflow-hidden bg-hero-gradient">
        <div
          className="pointer-events-none absolute inset-0 bg-mesh-gradient"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#6b5bb5]/25 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-gradient-to-bl from-[#1e185b]/15 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#ebe8ff]/80 to-transparent blur-2xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-border/80 bg-badge-gradient px-4 py-1.5 card-float">
              <span className="flex gap-0.5 text-amber-400" aria-hidden="true">
                {"★★★★★".split("").map((star, index) => (
                  <span key={index}>{star}</span>
                ))}
              </span>
              <span className="text-sm font-medium text-brand-muted">
                Trusted by developers
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:mt-7 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              <span className="gradient-text">AI-powered</span>{" "}
              <span className="text-brand">GitHub discovery</span>
              <br className="hidden sm:block" />
              <span className="text-brand-muted"> simplified with GitSearch</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-muted sm:mt-6 sm:text-xl">
              Describe what you want to build in plain English. We search GitHub,
              analyze repositories with AI, and rank the best matches for your
              stack and requirements.
            </p>

            <Link
              href="#search"
              className="btn-brand mt-7 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold sm:mt-8"
            >
              Get started for free
            </Link>
          </div>

          <ProductShowcase />

          <div className="relative mx-auto mt-10 max-w-3xl sm:mt-12">
            <div
              id="search"
              className="card-float-lg scroll-mt-24 rounded-3xl border border-brand-border/70 bg-brand-surface p-7 text-left sm:p-10"
            >
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <CtaSection />
    </div>
  );
}
