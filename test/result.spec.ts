import { safeParsePositiveInt, safeParsePositiveIntAsync } from '../src/result';

/** Shape expected for Ok: has ok=true and value. */
function isOk(r: unknown): r is { ok: true; value: number } {
  return typeof r === 'object' && r !== null && (r as { ok?: boolean }).ok === true && 'value' in r;
}

/** Shape expected for Err: has ok=false and error. */
function isErr(r: unknown): r is { ok: false; error: string } {
  return typeof r === 'object' && r !== null && (r as { ok?: boolean }).ok === false && 'error' in r;
}

describe('Result type (sync)', () => {
  it('safeParsePositiveInt returns Ok(number) for valid positive string', () => {
    const result = safeParsePositiveInt('42');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBe(42);
    }
  });

  it('safeParsePositiveInt returns Ok for zero', () => {
    const result = safeParsePositiveInt('0');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBe(0);
    }
  });

  it('safeParsePositiveInt returns Err for negative string', () => {
    const result = safeParsePositiveInt('-5');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toMatch(/negative|invalid|invalid input/i);
    }
  });

  it('safeParsePositiveInt returns Err for non-numeric string', () => {
    const result = safeParsePositiveInt('abc');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(typeof result.error).toBe('string');
    }
  });

  it('safeParsePositiveInt never throws', () => {
    expect(() => safeParsePositiveInt('')).not.toThrow();
    expect(() => safeParsePositiveInt('x')).not.toThrow();
    expect(() => safeParsePositiveInt('999')).not.toThrow();
  });
});

describe('Result type (async)', () => {
  it('safeParsePositiveIntAsync returns Promise<Ok(number)> for valid string', async () => {
    const result = await safeParsePositiveIntAsync('7');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBe(7);
    }
  });

  it('safeParsePositiveIntAsync returns Promise<Err> for invalid string', async () => {
    const result = await safeParsePositiveIntAsync('nope');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(typeof result.error).toBe('string');
    }
  });

  it('safeParsePositiveIntAsync never throws', async () => {
    await expect(safeParsePositiveIntAsync('')).resolves.toBeDefined();
    await expect(safeParsePositiveIntAsync('-1')).resolves.toBeDefined();
  });
});
