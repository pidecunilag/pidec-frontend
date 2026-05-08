/**
 * Recursively converts snake_case keys to camelCase on plain objects and arrays.
 * Used as a response interceptor so the frontend can stay camelCase end-to-end
 * even though the backend emits snake_case (Postgres-shaped JSON).
 *
 * Leaves primitives, dates-as-strings, and non-plain objects untouched.
 */

function toCamelKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function toCamelCase<T = unknown>(input: unknown): T {
  if (input === null || input === undefined) return input as T;

  if (Array.isArray(input)) {
    return input.map((item) => toCamelCase(item)) as unknown as T;
  }

  // Only walk plain objects. Skip Blob, FormData, File, URL, Date, etc.
  if (typeof input === 'object' && input.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      out[toCamelKey(key)] = toCamelCase(value);
    }
    return out as T;
  }

  return input as T;
}
