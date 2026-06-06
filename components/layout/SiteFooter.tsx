import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#use-cases", label: "Use Cases" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#search", label: "Start searching" },
  { href: "/search", label: "Search page" },
] as const;

const RESOURCE_LINKS = [
  {
    href: "https://docs.github.com/en/rest/search",
    label: "GitHub Search API",
    external: true,
  },
  {
    href: "https://github.com/search",
    label: "Explore GitHub",
    external: true,
  },
] as const;

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "text-sm text-brand-muted transition-colors hover:text-brand";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="max-w-md">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-brand"
            >
              GitSearch<span className="text-brand-light">AI</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Describe your project in plain English and discover the most
              relevant open-source GitHub repositories — ranked by AI for your
              stack, features, and goals.
            </p>
            <Link
              href="/#search"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get started for free
            </Link>
          </div>

          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
        </div>
      </div>

      <div className="border-t border-brand-border bg-brand-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-sm text-brand-muted">
            © {year} GitSearch AI. All rights reserved.
          </p>
          <p className="text-sm text-brand-muted">
            Built for developers discovering open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
