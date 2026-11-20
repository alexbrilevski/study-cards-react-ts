import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (e: PointerEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: PointerEvent) => {
      const element = ref.current;
      if (element && !element.contains(e.target as Node)) {
        handlerRef.current(e);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [ref, enabled]);
}
