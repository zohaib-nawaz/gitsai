export function formatStarCount(stars: number): string {
  if (stars >= 1_000_000) {
    return `${(stars / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (stars >= 1_000) {
    return `${(stars / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return stars.toLocaleString("en-US");
}

const LIST_MARKER_PREFIX =
  /^(\s*[\u2713\u2714\u2705\u2611\u2610\-–—•·*]\s*)+/u;

/** Removes leading bullets/checkmarks AI sometimes adds to list items. */
export function stripListMarkerPrefix(text: string): string {
  return text.replace(LIST_MARKER_PREFIX, "").trim();
}
