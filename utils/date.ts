const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

export function formatRepositoryDate(isoDate: string): string {
  const parsedDate = new Date(isoDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS).format(parsedDate);
}

export function formatRelativeUpdatedDate(isoDate: string): string {
  const parsedDate = new Date(isoDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  const now = Date.now();
  const diffMs = now - parsedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Updated today";
  }
  if (diffDays === 1) {
    return "Updated yesterday";
  }
  if (diffDays < 30) {
    return `Updated ${diffDays} days ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Updated ${months} month${months === 1 ? "" : "s"} ago`;
  }

  return formatRepositoryDate(isoDate);
}
