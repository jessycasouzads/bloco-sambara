import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins multiple classes with spaces', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('skips falsy values (false, null, undefined)', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns empty string when no inputs given', () => {
    expect(cn()).toBe('');
  });

  it('returns empty string when all inputs are falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('preserves order of inputs', () => {
    expect(cn('z', 'a', 'm')).toBe('z a m');
  });
});
