export type Size = { width: number; height: number };

/**
 * Mirrors CSS `object-fit: contain`: the largest box with the source's own
 * aspect ratio that still fits inside `box`.
 *
 * The live playback marker letterboxes its artwork with `object-fit: contain`,
 * so anything that redraws that marker onto a canvas (video export) has to
 * apply the same fit or non-square icons come out stretched.
 */
export function getContainedSize(source: Size, box: Size): Size {
  if (source.width <= 0 || source.height <= 0 || box.width <= 0 || box.height <= 0) {
    return { width: 0, height: 0 };
  }

  const scale = Math.min(box.width / source.width, box.height / source.height);
  return { width: source.width * scale, height: source.height * scale };
}
