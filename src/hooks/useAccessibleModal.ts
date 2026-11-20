import { useEffect, useRef } from 'react';

interface UseAccessibleModalOptions {
  isOpen: boolean;
  onClose: () => void;
  disableEscape?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Track nested modal count so body scroll lock is only released when the last modal closes.
let activeModalLockCount = 0;
let previousBodyOverflow = '';

/**
 * Provides standardized modal accessibility:
 * - Escape key closing (unless disableEscape is true, e.g., mandatory legal modal)
 * - Body scroll locking while open
 * - Initial focus into the dialog and Tab / Shift+Tab focus trap
 * - Focus restoration to the previously focused trigger on close
 */
export function useAccessibleModal<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  disableEscape = false,
  initialFocusRef,
}: UseAccessibleModalOptions) {
  const containerRef = useRef<T | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    if (activeModalLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    activeModalLockCount += 1;

    const focusTimer = window.setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }
      const container = containerRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        if (!container.hasAttribute('tabindex')) {
          container.setAttribute('tabindex', '-1');
        }
        container.focus();
      }
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscape) {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;

        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!container.contains(active)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown, true);

      activeModalLockCount = Math.max(0, activeModalLockCount - 1);
      if (activeModalLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }

      const prevEl = previousFocusRef.current;
      if (prevEl && typeof prevEl.focus === 'function' && document.contains(prevEl)) {
        window.setTimeout(() => {
          prevEl.focus();
        }, 0);
      }
    };
  }, [isOpen, disableEscape, initialFocusRef]);

  return containerRef;
}
