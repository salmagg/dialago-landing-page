import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  computeSwipeTransform,
  DOUBLE_TAP_MS,
  getSwipeIntent,
  SWIPE_EXIT_MS,
  TAP_MOVE_TOLERANCE_PX,
} from './swipeGesture';
import type { SwipeDragState, SwipeOutcome } from './types';

type Options = {
  enabled?: boolean;
  requireFlippedToSwipe?: boolean;
  flipped: boolean;
  onReveal: () => void;
  onFlipBack: () => void;
  onHintPulse: () => void;
  onSwipeCommit: (outcome: SwipeOutcome) => void;
};

const IDLE_DRAG: SwipeDragState = { offsetX: 0, offsetY: 0, rotation: 0, intent: null };

export function useSwipeGesture({
  enabled = true,
  requireFlippedToSwipe = true,
  flipped,
  onReveal,
  onFlipBack,
  onHintPulse,
  onSwipeCommit,
}: Options) {
  const [drag, setDrag] = useState<SwipeDragState>(IDLE_DRAG);
  const [exiting, setExiting] = useState<SwipeOutcome | null>(null);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const lastTapAt = useRef(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetDrag = useCallback(() => setDrag(IDLE_DRAG), []);

  const commitExit = useCallback(
    (outcome: SwipeOutcome) => {
      if (requireFlippedToSwipe && !flipped) {
        resetDrag();
        return;
      }
      setExiting(outcome);
      const direction = outcome === 'known' ? 1 : -1;
      setDrag({
        offsetX: direction * 420,
        offsetY: 0,
        rotation: direction * 16,
        intent: outcome,
      });
      if (exitTimer.current) clearTimeout(exitTimer.current);
      exitTimer.current = setTimeout(() => {
        onSwipeCommit(outcome);
        setExiting(null);
        resetDrag();
      }, SWIPE_EXIT_MS);
    },
    [flipped, onSwipeCommit, requireFlippedToSwipe, resetDrag],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || exiting) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerStart.current = { x: event.clientX, y: event.clientY };
      dragging.current = false;
    },
    [enabled, exiting],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || exiting || !pointerStart.current) return;
      const dx = event.clientX - pointerStart.current.x;
      const dy = event.clientY - pointerStart.current.y;
      if (!dragging.current && Math.hypot(dx, dy) > TAP_MOVE_TOLERANCE_PX) {
        dragging.current = true;
        if (singleTapTimer.current) {
          clearTimeout(singleTapTimer.current);
          singleTapTimer.current = null;
        }
      }
      if (!dragging.current) return;
      const { rotation } = computeSwipeTransform(dx);
      setDrag({
        offsetX: dx,
        offsetY: dy * 0.15,
        rotation,
        intent: getSwipeIntent(dx),
      });
    },
    [enabled, exiting],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || exiting) return;
      event.currentTarget.releasePointerCapture(event.pointerId);

      const start = pointerStart.current;
      pointerStart.current = null;

      if (!start) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const moved = Math.hypot(dx, dy);

      if (dragging.current) {
        dragging.current = false;
        const intent = getSwipeIntent(dx);
        if (intent) {
          commitExit(intent);
        } else {
          resetDrag();
        }
        return;
      }

      if (moved > TAP_MOVE_TOLERANCE_PX) {
        resetDrag();
        return;
      }

      const now = Date.now();
      if (now - lastTapAt.current <= DOUBLE_TAP_MS) {
        lastTapAt.current = 0;
        if (singleTapTimer.current) {
          clearTimeout(singleTapTimer.current);
          singleTapTimer.current = null;
        }
        if (flipped) onFlipBack();
        else onHintPulse();
        return;
      }
      lastTapAt.current = now;

      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
      singleTapTimer.current = setTimeout(() => {
        singleTapTimer.current = null;
        if (!flipped) onReveal();
      }, DOUBLE_TAP_MS);
    },
    [commitExit, enabled, exiting, flipped, onFlipBack, onHintPulse, onReveal, resetDrag],
  );

  const onPointerCancel = useCallback(() => {
    pointerStart.current = null;
    dragging.current = false;
    if (singleTapTimer.current) {
      clearTimeout(singleTapTimer.current);
      singleTapTimer.current = null;
    }
    if (!exiting) resetDrag();
  }, [exiting, resetDrag]);

  return {
    drag,
    exiting,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  };
}
