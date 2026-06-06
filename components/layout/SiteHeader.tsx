import Link from "next/link";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#use-cases", label: "Use Cases" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/search", label: "Search" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/60 bg-header-gradient backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-brand"
        >
          GitSearch<span className="gradient-text">AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-muted transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#search"
          className="btn-brand shrink-0 rounded-full px-5 py-2 text-sm font-semibold"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
