export function getLoading(data: unknown, fallback: unknown): boolean {
  if (data && typeof data === "object") {
    if (Array.isArray(data) || Object.keys(data).length > 0) {
      return !!(data as any)?._loading;
    }
  }
  return data === null || data === fallback;
}
