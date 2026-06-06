interface TechnologyTagsProps {
  technologies: string[];
}

export function TechnologyTags({ technologies }: TechnologyTagsProps) {
  if (technologies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((technology) => (
        <span
          key={technology}
          className="rounded-lg bg-brand-bg px-2.5 py-1 text-xs font-medium text-brand"
        >
          {technology}
        </span>
      ))}
    </div>
  );
}
