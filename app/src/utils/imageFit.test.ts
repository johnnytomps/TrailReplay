import { describe, expect, it } from 'vitest';
import { getContainedSize } from './imageFit';

describe('getContainedSize', () => {
  it('leaves an image that already matches the box untouched', () => {
    expect(getContainedSize({ width: 100, height: 100 }, { width: 60, height: 60 }))
      .toEqual({ width: 60, height: 60 });
  });

  it('letterboxes a wide image instead of stretching it', () => {
    // packraft.png's real dimensions: 1.496:1 in a square marker box.
    const fitted = getContainedSize({ width: 953, height: 637 }, { width: 60, height: 60 });
    expect(fitted.width).toBeCloseTo(60, 5);
    expect(fitted.height).toBeCloseTo(40.1, 1);
  });

  it('pillarboxes a tall image instead of stretching it', () => {
    const fitted = getContainedSize({ width: 637, height: 953 }, { width: 60, height: 60 });
    expect(fitted.height).toBeCloseTo(60, 5);
    expect(fitted.width).toBeCloseTo(40.1, 1);
  });

  it('preserves the source aspect ratio for any box', () => {
    const source = { width: 1024, height: 768 };
    const fitted = getContainedSize(source, { width: 200, height: 50 });
    expect(fitted.width / fitted.height).toBeCloseTo(source.width / source.height, 5);
    expect(fitted.width).toBeLessThanOrEqual(200);
    expect(fitted.height).toBeLessThanOrEqual(50);
  });

  it('returns an empty size for degenerate input rather than NaN', () => {
    expect(getContainedSize({ width: 0, height: 100 }, { width: 60, height: 60 }))
      .toEqual({ width: 0, height: 0 });
    expect(getContainedSize({ width: 100, height: 100 }, { width: 0, height: 60 }))
      .toEqual({ width: 0, height: 0 });
  });
});
