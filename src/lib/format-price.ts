export function formatPriceDisplay(value: string | number): string {
  const raw = String(value ?? '').trim();

  if (!raw) return '$0';

  if (/^\d+(\.\d+)?$/.test(raw)) {
    return `$${raw}`;
  }

  const bundleMatch = raw.match(/^(\d+)\s*for\s*\$?\s*(\d+(?:\.\d+)?)$/i);
  if (bundleMatch) {
    const [, qty, total] = bundleMatch;
    return `${qty} for $${total}`;
  }

  return raw;
}
