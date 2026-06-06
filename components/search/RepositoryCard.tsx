import { MatchScoreBadge } from "@/components/search/MatchScoreBadge";
import { TechnologyTags } from "@/components/search/TechnologyTags";
import type { RankedRepository } from "@/types/search";
import { formatRelativeUpdatedDate } from "@/utils/date";
import { formatStarCount, stripListMarkerPrefix } from "@/utils/format";

interface RepositoryCardProps {
  repository: RankedRepository;
  rank: number;
}

export function RepositoryCard({ repository, rank }: RepositoryCardProps) {
  return (
    <article className="card-float rounded-3xl border border-brand-border/70 bg-brand-surface p-6 transition-shadow hover:card-float-lg sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-icon-gradient text-sm font-bold text-brand">
              {rank}
            </span>
            <h3 className="text-xl font-semibold text-brand">
              {repository.name}
            </h3>
          </div>
          <p className="text-sm text-brand-muted">{repository.fullName}</p>
        </div>
        <MatchScoreBadge score={repository.matchScore} />
      </div>

      {repository.summary && (
        <p className="mt-5 leading-relaxed text-brand-muted">
          {repository.summary}
        </p>
      )}

      {repository.strengths.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-brand">
            Why it matches
          </h4>
          <ul className="space-y-2">
            {repository.strengths.map((strength) => (
              <li
                key={strength}
                className="flex items-start gap-2.5 text-sm text-brand-muted"
              >
                <span
                  className="mt-0.5 text-emerald-600"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {stripListMarkerPrefix(strength)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {repository.missingRequirements.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3 text-sm font-semibold text-brand">Gaps</h4>
          <ul className="space-y-2">
            {repository.missingRequirements.map((gap) => (
              <li
                key={gap}
                className="flex items-start gap-2.5 text-sm text-brand-muted"
              >
                <span className="mt-0.5 text-brand-secondary" aria-hidden="true">
                  −
                </span>
                {stripListMarkerPrefix(gap)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <TechnologyTags technologies={repository.technologiesDetected} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-muted">
        <span aria-label={`${repository.stars} stars`}>
          ★ {formatStarCount(repository.stars)} stars
        </span>
        {repository.language && <span>{repository.language}</span>}
        <span>{formatRelativeUpdatedDate(repository.updatedAt)}</span>
      </div>

      {repository.recommendationReason && (
        <p className="mt-5 rounded-2xl border border-brand-border/50 bg-brand-bg/50 px-4 py-3 text-sm italic leading-relaxed text-brand-muted">
          {repository.recommendationReason}
        </p>
      )}

      <a
        href={repository.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-brand mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        View on GitHub →
      </a>
    </article>
  );
}
