/**
 * Implement a Result type (Ok | Err) and use it instead of throwing.
 * Works for both sync and async: sync returns Result<T,E>, async returns Promise<Result<T,E>>.
 *
 * You must:
 * 1. Define your own Result type (discriminated union Ok | Err) and any helpers you need.
 * 2. Implement safeParsePositiveInt(s): parses string to positive integer (≥0); returns Ok(number) or Err(message); never throws.
 * 3. Implement safeParsePositiveIntAsync(s): same contract, async; returns Promise that resolves to Ok or Err; never throws or rejects.
 */

export function safeParsePositiveInt(_s: string): unknown {
  throw new Error('Implement me');
}

export async function safeParsePositiveIntAsync(_s: string): Promise<unknown> {
  throw new Error('Implement me');
}
