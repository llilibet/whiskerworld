const ASSET_BASE = import.meta.env.VITE_ASSET_URL || '';

export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${ASSET_BASE}${normalizedPath}`;
}
