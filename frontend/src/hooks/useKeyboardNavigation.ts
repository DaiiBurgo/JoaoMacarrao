import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  /**
   * Seletor CSS para elementos navegáveis
   */
  selector?: string;
  /**
   * Se deve fazer loop ao chegar no final
   */
  loop?: boolean;
  /**
   * Callback quando um elemento é focado
   */
  onFocus?: (element: HTMLElement, index: number) => void;
  /**
   * Callback quando Enter é pressionado
   */
  onSelect?: (element: HTMLElement, index: number) => void;
}

/**
 * Hook personalizado para navegação por teclado
 */
export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    selector = 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    loop = true,
    onFocus,
    onSelect,
  } = options;

  const currentIndexRef = useRef<number>(-1);

  /**
   * Obtém todos os elementos navegáveis
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(selector)
    );

    return elements.filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        el.offsetParent !== null && // Elemento está visível
        getComputedStyle(el).visibility !== 'hidden'
    );
  }, [containerRef, selector]);

  /**
   * Foca no próximo elemento
   */
  const focusNext = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    currentIndexRef.current = (currentIndexRef.current + 1) % elements.length;
    
    if (currentIndexRef.current === 0 && !loop) {
      currentIndexRef.current = elements.length - 1;
      return;
    }

    const element = elements[currentIndexRef.current];
    element.focus();
    onFocus?.(element, currentIndexRef.current);
  }, [getFocusableElements, loop, onFocus]);

  /**
   * Foca no elemento anterior
   */
  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    currentIndexRef.current =
      currentIndexRef.current <= 0
        ? elements.length - 1
        : currentIndexRef.current - 1;

    if (currentIndexRef.current === elements.length - 1 && !loop) {
      currentIndexRef.current = 0;
      return;
    }

    const element = elements[currentIndexRef.current];
    element.focus();
    onFocus?.(element, currentIndexRef.current);
  }, [getFocusableElements, loop, onFocus]);

  /**
   * Foca no primeiro elemento
   */
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    currentIndexRef.current = 0;
    const element = elements[0];
    element.focus();
    onFocus?.(element, 0);
  }, [getFocusableElements, onFocus]);

  /**
   * Foca no último elemento
   */
  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    currentIndexRef.current = elements.length - 1;
    const element = elements[currentIndexRef.current];
    element.focus();
    onFocus?.(element, currentIndexRef.current);
  }, [getFocusableElements, onFocus]);

  /**
   * Foca em um elemento específico pelo índice
   */
  const focusIndex = useCallback(
    (index: number) => {
      const elements = getFocusableElements();
      if (elements.length === 0 || index < 0 || index >= elements.length) return;

      currentIndexRef.current = index;
      const element = elements[index];
      element.focus();
      onFocus?.(element, index);
    },
    [getFocusableElements, onFocus]
  );

  /**
   * Manipulador de eventos de teclado
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, shiftKey, ctrlKey, altKey } = event;

      // Atalhos de navegação
      if (!ctrlKey && !altKey) {
        switch (key) {
          case 'ArrowDown':
          case 'ArrowRight':
            event.preventDefault();
            focusNext();
            break;

          case 'ArrowUp':
          case 'ArrowLeft':
            event.preventDefault();
            focusPrevious();
            break;

          case 'Home':
            event.preventDefault();
            focusFirst();
            break;

          case 'End':
            event.preventDefault();
            focusLast();
            break;

          case 'Enter':
          case ' ':
            if (event.target instanceof HTMLElement) {
              const elements = getFocusableElements();
              const index = elements.indexOf(event.target);
              if (index !== -1) {
                event.preventDefault();
                onSelect?.(event.target, index);
              }
            }
            break;

          case 'Tab':
            // Atualiza o índice atual ao usar Tab
            if (event.target instanceof HTMLElement) {
              const elements = getFocusableElements();
              const index = elements.indexOf(event.target);
              if (index !== -1) {
                currentIndexRef.current = index;
              }
            }
            break;
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    containerRef,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    getFocusableElements,
    onSelect,
  ]);

  return {
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    focusIndex,
    currentIndex: currentIndexRef.current,
  };
};


