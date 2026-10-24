import { describe, expect, it } from 'vitest';
import { assertNever } from './assertNever';

describe('assertNever', () => {
  it('throws for unexpected values', () => {
    expect(() => assertNever('unexpected' as never)).toThrow(
      'Unhandled case: "unexpected"',
    );
  });
});
