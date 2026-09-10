import { describe, expect, it } from 'vitest';
import {
  PLAYBACK_MARKER_CIRCLE_GAP,
  getPlaybackMarkerGeometry,
  resolvePlaybackMarkerColor,
  updatePlaybackMarkerElement,
} from './useTrailPlaybackCamera';
import { getContainedSize } from '@/utils/imageFit';

describe('playback marker presentation', () => {
  it('uses each journey track color while the marker color remains linked to the active track', () => {
    expect(resolvePlaybackMarkerColor('#C1652F', '#c1652f', '#3B82F6')).toBe('#3B82F6');
    expect(resolvePlaybackMarkerColor('#111111', '#C1652F', '#3B82F6')).toBe('#111111');
  });

  it('keeps the label in the marker element and treats imported names as text', () => {
    const element = document.createElement('div');
    updatePlaybackMarkerElement(
      element,
      '<span data-testid="marker-center"></span>',
      { color: '#3B82F6', text: '<img src=x onerror=alert(1)>' },
    );

    expect(element.querySelector('[data-testid="marker-center"]')).not.toBeNull();
    expect(element.querySelector('.tr-marker-label')?.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(element.querySelector('.tr-marker-label img')).toBeNull();
  });
});

describe('playback marker circle geometry', () => {
  // Aspect ratios of the shipped PNG/SVG artwork plus deliberately extreme
  // ones, since users can point the marker at any icon.
  const aspectRatios = [0.25, 0.71, 0.92, 1, 1.14, 1.28, 1.496, 2, 4];
  const markerSizes = [0.5, 0.75, 1, 1.5, 2];

  it('keeps the icon fully inside the glow circle at every size and aspect ratio', () => {
    markerSizes.forEach((markerSize) => {
      const { circleSize, iconSize } = getPlaybackMarkerGeometry(markerSize);

      aspectRatios.forEach((aspectRatio) => {
        const drawn = getContainedSize(
          { width: aspectRatio, height: 1 },
          { width: iconSize, height: iconSize },
        );
        // The icon's furthest point from the marker centre is a corner of the
        // rectangle it actually renders into.
        const cornerDistance = Math.hypot(drawn.width, drawn.height) / 2;
        expect(cornerDistance).toBeLessThanOrEqual(circleSize / 2);
      });
    });
  });

  it('leaves a visible gap between a square icon and the circle', () => {
    const { circleSize, iconSize } = getPlaybackMarkerGeometry(1);
    // A square icon is the worst case: it reaches furthest into the corners.
    const cornerDistance = Math.hypot(iconSize, iconSize) / 2;
    expect(circleSize / 2 - cornerDistance).toBeGreaterThanOrEqual(PLAYBACK_MARKER_CIRCLE_GAP - 0.5);
  });

  it('scales the icon and circle together with the marker size setting', () => {
    const single = getPlaybackMarkerGeometry(1);
    const double = getPlaybackMarkerGeometry(2);
    expect(double.iconSize).toBe(single.iconSize * 2);
    expect(double.circleSize / double.iconSize).toBeCloseTo(single.circleSize / single.iconSize, 1);
  });
});
