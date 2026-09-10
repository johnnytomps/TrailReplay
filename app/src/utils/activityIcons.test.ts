import { describe, expect, it } from 'vitest';
import {
  ACTIVITY_ICONS,
  PNG_ACTIVITY_ICON_VALUES,
  SVG_ACTIVITY_ICON_VALUES,
  getActivityIconMarkerHtml,
  getActivityIconOption,
} from './activityIcons';

// The video exporter redraws the playback marker onto the recording canvas by
// reading this markup back out of the DOM (see `useVideoExportRecorder`), so
// the shape of the marker element is a contract between the two, not just
// presentation.
describe('playback marker markup for PNG activity icons', () => {
  const markerHtml = getActivityIconMarkerHtml(PNG_ACTIVITY_ICON_VALUES.packraft, 48, '#ff0000');

  function parseMarker(html: string): HTMLElement {
    const host = document.createElement('div');
    host.innerHTML = html;
    return host.firstElementChild as HTMLElement;
  }

  it('wraps the artwork in a sized span the exporter can measure', () => {
    const span = parseMarker(markerHtml);
    expect(span.tagName).toBe('SPAN');
    expect(span.style.width).toBe('48px');
    expect(span.style.height).toBe('48px');
  });

  it('renders the artwork as an <img> pointing at the icon file', () => {
    const image = parseMarker(markerHtml).querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe(
      getActivityIconOption(PNG_ACTIVITY_ICON_VALUES.packraft)?.content,
    );
  });

  it('carries no mask, so the exporter draws it in full color instead of tinting it', () => {
    const span = parseMarker(markerHtml);
    expect(span.style.maskImage).toBe('');
    expect(span.style.webkitMaskImage).toBe('');
  });

  it('keeps every PNG icon pointing at a file the export can load', () => {
    const pngIcons = ACTIVITY_ICONS.filter((icon) => icon.kind === 'png');
    expect(pngIcons.length).toBeGreaterThan(0);
    pngIcons.forEach((icon) => {
      expect(icon.content).toMatch(/^\/media\/images\/activity-icons\/[\w-]+\.png$/);
    });
  });

  it('still masks SVG icons, which the exporter tints with the marker color', () => {
    const span = parseMarker(getActivityIconMarkerHtml(SVG_ACTIVITY_ICON_VALUES.running, 48, '#ff0000'));
    expect(span.querySelector('img')).toBeNull();
    expect(span.style.maskImage || span.style.webkitMaskImage).toContain('running.svg');
  });
});
