import { createElement } from 'react';
import type { CSSProperties, ReactElement } from 'react';

export const PNG_ACTIVITY_ICON_VALUES = {
  packraft: 'png-packraft',
  bike: 'png-bike',
  ctabus: 'png-ctabus',
  ctatrain: 'png-ctatrain',
  metratrain: 'png-metratrain',
  pacebus: 'png-pacebus',
} as const;

export const SVG_ACTIVITY_ICON_VALUES = {
  walking: 'svg-walking',
  running: 'svg-running',
  biking: 'svg-biking',
  swimming: 'svg-swimming',
} as const;

export const DEFAULT_ACTIVITY_ICON = SVG_ACTIVITY_ICON_VALUES.walking;

type ActivityIconOption = {
  value: string;
  labelKey: string;
  kind: 'emoji' | 'svg' | 'png';
  content: string;
};

const svgIconBasePath = '/media/images/activity-icons';

export const ACTIVITY_ICONS: ActivityIconOption[] = [
  { value: PNG_ACTIVITY_ICON_VALUES.packraft, labelKey: 'Packraft', kind: 'png', content: `${svgIconBasePath}/packraft.png` },
  { value: PNG_ACTIVITY_ICON_VALUES.bike, labelKey: 'Bike', kind: 'png', content: `${svgIconBasePath}/bike.png` },
  { value: PNG_ACTIVITY_ICON_VALUES.ctabus, labelKey: 'CTA Bus', kind: 'png', content: `${svgIconBasePath}/cta-bus.png` },
  { value: PNG_ACTIVITY_ICON_VALUES.ctatrain, labelKey: 'CTA Train', kind: 'png', content: `${svgIconBasePath}/cta-train.png` },
  { value: PNG_ACTIVITY_ICON_VALUES.metratrain, labelKey: 'Metra Train', kind: 'png', content: `${svgIconBasePath}/metra-train.png` },
  { value: PNG_ACTIVITY_ICON_VALUES.pacebus, labelKey: 'Pace', kind: 'png', content: `${svgIconBasePath}/pace-bus.png` },
  { value: SVG_ACTIVITY_ICON_VALUES.walking, labelKey: 'activities.walking', kind: 'svg', content: `${svgIconBasePath}/walking.svg` },
  { value: SVG_ACTIVITY_ICON_VALUES.running, labelKey: 'activities.running', kind: 'svg', content: `${svgIconBasePath}/running.svg` },
  { value: SVG_ACTIVITY_ICON_VALUES.biking, labelKey: 'activities.cycling', kind: 'svg', content: `${svgIconBasePath}/biking.svg` },
  { value: SVG_ACTIVITY_ICON_VALUES.swimming, labelKey: 'activities.swimming', kind: 'svg', content: `${svgIconBasePath}/swimming.svg` },
  { value: '🏃', labelKey: 'activities.running', kind: 'emoji', content: '🏃' },
  { value: '🏃‍♂️', labelKey: 'activities.runner', kind: 'emoji', content: '🏃‍♂️' },
  { value: '🚴', labelKey: 'activities.cycling', kind: 'emoji', content: '🚴' },
  { value: '🚴‍♂️', labelKey: 'activities.cyclist', kind: 'emoji', content: '🚴‍♂️' },
  { value: '🥾', labelKey: 'activities.hiking', kind: 'emoji', content: '🥾' },
  { value: '🚶', labelKey: 'activities.walking', kind: 'emoji', content: '🚶' },
  { value: '🚶‍♂️', labelKey: 'activities.walker', kind: 'emoji', content: '🚶‍♂️' },
  { value: '⛷️', labelKey: 'activities.skiing', kind: 'emoji', content: '⛷️' },
  { value: '🏊', labelKey: 'activities.swimming', kind: 'emoji', content: '🏊' },
  { value: '🧗', labelKey: 'activities.climbing', kind: 'emoji', content: '🧗' },
  { value: '🏇', labelKey: 'activities.horse', kind: 'emoji', content: '🏇' },
  { value: '🛶', labelKey: 'activities.kayak', kind: 'emoji', content: '🛶' },
  { value: '🛹', labelKey: 'activities.skate', kind: 'emoji', content: '🛹' },
  { value: '🎿', labelKey: 'activities.ski', kind: 'emoji', content: '🎿' },
  { value: '🏂', labelKey: 'activities.snowboard', kind: 'emoji', content: '🏂' },
  { value: '🏍️', labelKey: 'activities.motorcycle', kind: 'emoji', content: '🏍️' },
  { value: '🚗', labelKey: 'activities.car', kind: 'emoji', content: '🚗' },
  { value: '✈️', labelKey: 'activities.plane', kind: 'emoji', content: '✈️' },
  { value: '🚂', labelKey: 'activities.train', kind: 'emoji', content: '🚂' },
];

const activityIconMap = new Map(ACTIVITY_ICONS.map((icon) => [icon.value, icon]));

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function iconFrameStyle(size: number): CSSProperties {
  return {
    width: size,
    height: size,
    display: 'block',
    objectFit: 'contain',
  };
}

function svgMaskStyle(size: number, color: string, url: string): CSSProperties {
  return {
    width: size,
    height: size,
    display: 'block',
    backgroundColor: color,
    maskImage: `url(${url})`,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskImage: `url(${url})`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskSize: 'contain',
  };
}

export function getActivityIconOption(value: string): ActivityIconOption | undefined {
  return activityIconMap.get(value);
}

export function isSvgActivityIcon(value: string): boolean {
  return getActivityIconOption(value)?.kind === 'svg';
}

export function isPngActivityIcon(value: string): boolean {
  return getActivityIconOption(value)?.kind === 'png';
}

export function renderActivityIcon(
  value: string,
  options: { size?: number; className?: string; color?: string } = {},
): ReactElement {
  const { size = 24, className, color = 'currentColor' } = options;
  const icon = getActivityIconOption(value);

  if (icon?.kind === 'svg') {
    return createElement('span', {
      role: 'img',
      'aria-label': '',
      'aria-hidden': true,
      className,
      style: svgMaskStyle(size, color, icon.content),
    });
  }

  if (icon?.kind === 'png') {
    return createElement('img', {
      'aria-hidden': true,
      alt: '',
      className,
      src: icon.content,
      style: iconFrameStyle(size),
    });
  }

  return createElement(
    'span',
    {
      'aria-hidden': true,
      className,
      style: {
        ...iconFrameStyle(size),
        alignItems: 'center',
        display: 'inline-flex',
        color,
        fontSize: size,
        justifyContent: 'center',
        lineHeight: 1,
      } satisfies CSSProperties,
    },
    icon?.content ?? value,
  );
}

export function getActivityIconMarkerHtml(value: string, size: number, color: string): string {
  const icon = getActivityIconOption(value);

  if (icon?.kind === 'svg') {
    return `<span aria-hidden="true" style="width:${size}px;height:${size}px;display:block;background-color:${escapeHtml(color)};mask-image:url('${escapeHtml(icon.content)}');mask-repeat:no-repeat;mask-position:center;mask-size:contain;-webkit-mask-image:url('${escapeHtml(icon.content)}');-webkit-mask-repeat:no-repeat;-webkit-mask-position:center;-webkit-mask-size:contain;position:relative;z-index:10;"></span>`;
  }

  if (icon?.kind === 'png') {
    return `<span aria-hidden="true" style="width:${size}px;height:${size}px;display:block;position:relative;z-index:10;"><img src="${escapeHtml(icon.content)}" alt="" style="width:100%;height:100%;display:block;object-fit:contain;"></span>`;
  }

  return `<span style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;font-size:${size}px;line-height:1;position:relative;z-index:10;">${escapeHtml(icon?.content ?? value)}</span>`;
}
