import { useCallback, KeyboardEvent } from 'react';

/**
 * Hook for handling keyboard navigation on interactive elements
 * Supports Enter and Space key activation
 */
export const useKeyboardActivation = (onClick?: () => void) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick]
  );

  return {
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: 'button' as const,
  };
};

/**
 * Hook for arrow key navigation within a group of elements
 */
export const useArrowNavigation = (
  itemsCount: number,
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  options?: {
    horizontal?: boolean;
    loop?: boolean;
    onSelect?: (index: number) => void;
  }
) => {
  const { horizontal = true, loop = true, onSelect } = options || {};

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const prevKey = horizontal ? 'ArrowRight' : 'ArrowUp'; // RTL: Right is previous
      const nextKey = horizontal ? 'ArrowLeft' : 'ArrowDown'; // RTL: Left is next

      if (e.key === prevKey) {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          setCurrentIndex(prevIndex);
        } else if (loop) {
          setCurrentIndex(itemsCount - 1);
        }
      } else if (e.key === nextKey) {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < itemsCount) {
          setCurrentIndex(nextIndex);
        } else if (loop) {
          setCurrentIndex(0);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentIndex(itemsCount - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(currentIndex);
      }
    },
    [currentIndex, itemsCount, horizontal, loop, onSelect, setCurrentIndex]
  );

  return { onKeyDown: handleKeyDown };
};

/**
 * Hook for focus trap within a container (useful for modals)
 */
export const useFocusTrap = (isActive: boolean) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || e.key !== 'Tab') return;

      const container = e.currentTarget as HTMLElement;
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: going backwards
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: going forwards
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [isActive]
  );

  return { onKeyDown: handleKeyDown };
};

/**
 * Creates keyboard-accessible props for clickable elements
 */
export const getClickableProps = (onClick: () => void) => ({
  onClick,
  onKeyDown: (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  },
  tabIndex: 0,
  role: 'button' as const,
});

/**
 * Creates keyboard-accessible props for link-like elements
 */
export const getLinkProps = (onClick: () => void) => ({
  onClick,
  onKeyDown: (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  },
  tabIndex: 0,
  role: 'link' as const,
});
