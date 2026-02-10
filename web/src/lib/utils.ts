import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely awaits a Promise and returns a tuple with either the result or an error.
 *
 * @example
 * ```typescript
 * const [data, error] = await safeAwait(fetch('/api/data'));
 * if (error) {
 *   console.error('Request failed:', error.message);
 *   return;
 * }
 *
 * console.log('Data:', data);
 * ```
 */
export async function safeAwait<T>(
  promise: Promise<T> | T,
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return [null, err];
    }
    if (typeof err === "string") {
      return [null, new Error(err)];
    }
    return [null, new Error(String(err))];
  }
}
