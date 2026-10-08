export function extractTableToken(scannedValue: string, baseUrl = window.location.origin): string | null {
  const value = scannedValue.trim();
  if (!value) return null;

  try {
    const url = new URL(value, baseUrl);
    const normalizedPath = url.pathname.replace(/\/+$/, '') || '/';
    if (normalizedPath !== '/dine-in/start') return null;
    const token = url.searchParams.get('t')?.trim();
    return token || null;
  } catch {
    return null;
  }
}
