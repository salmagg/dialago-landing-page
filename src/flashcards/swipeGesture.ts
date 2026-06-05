/** Pure swipe math — portable to React Native / Capacitor. */

export const SWIPE_COMMIT_PX = 88;
export const SWIPE_MAX_ROTATE_DEG = 14;
export const SWIPE_EXIT_MS = 280;
export const DOUBLE_TAP_MS = 320;
export const TAP_MOVE_TOLERANCE_PX = 14;

export function computeSwipeTransform(offsetX: number): { rotation: number } {
  const rotation = Math.max(-SWIPE_MAX_ROTATE_DEG, Math.min(SWIPE_MAX_ROTATE_DEG, offsetX * 0.08));
  return { rotation };
}

export function getSwipeIntent(offsetX: number): 'known' | 'learning' | null {
  if (offsetX >= SWIPE_COMMIT_PX) return 'known';
  if (offsetX <= -SWIPE_COMMIT_PX) return 'learning';
  return null;
}

export function overlayOpacity(offsetX: number): { known: number; learning: number } {
  const known = Math.min(1, Math.max(0, offsetX / SWIPE_COMMIT_PX));
  const learning = Math.min(1, Math.max(0, -offsetX / SWIPE_COMMIT_PX));
  return { known, learning };
}
