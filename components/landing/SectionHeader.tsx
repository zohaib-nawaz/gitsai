interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={[
            "mt-4 text-lg leading-relaxed text-brand-muted",
            isCentered ? "mx-auto" : "",
          ].join(" ")}
        >
          {description}
        </p>
      )}
    </div>
  );
}
