import { useEffect, useCallback, useRef } from 'react';

interface FocusTrapOptions {
  /**
   * Se deve focar automaticamente no primeiro elemento ao ativar
   */
  autoFocus?: boolean;
  /**
   * Se deve retornar o foco ao elemento anterior ao desativar
   */
  restoreFocus?: boolean;
  /**
   * Se deve fazer loop ao chegar no final
   */
  loop?: boolean;
  /**
   * Callback quando a armadilha é ativada
   */
  onActivate?: () => void;
  /**
   * Callback quando a armadilha é desativada
   */
  onDeactivate?: () => void;
}

/**
 * Hook personalizado para criar armadilhas de foco (útil para modais e diálogos)
 */
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean,
  options: FocusTrapOptions = {}
) => {
  const {
    autoFocus = true,
    restoreFocus = true,
    loop = true,
    onActivate,
    onDeactivate,
  } = options;

  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Obtém todos os elementos focáveis dentro do container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden'
    );
  }, [containerRef]);

  /**
   * Foca no primeiro elemento focável
   */
  const focusFirstElement = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  /**
   * Foca no último elemento focável
   */
  const focusLastElement = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  /**
   * Manipula o evento de teclado para armadilhar o foco
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !containerRef.current) return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Shift + Tab
      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          if (loop) {
            lastElement.focus();
          }
        }
      }
      // Tab
      else {
        if (activeElement === lastElement) {
          event.preventDefault();
          if (loop) {
            firstElement.focus();
          }
        }
      }
    },
    [containerRef, getFocusableElements, loop]
  );

  /**
   * Ativa a armadilha de foco
   */
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Salva o elemento atualmente focado
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Foca no primeiro elemento se autoFocus estiver ativo
    if (autoFocus) {
      focusFirstElement();
    }

    // Adiciona o event listener
    document.addEventListener('keydown', handleKeyDown);

    // Callback de ativação
    onActivate?.();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restaura o foco ao elemento anterior
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }

      // Callback de desativação
      onDeactivate?.();
    };
  }, [
    isActive,
    autoFocus,
    restoreFocus,
    containerRef,
    focusFirstElement,
    handleKeyDown,
    onActivate,
    onDeactivate,
  ]);

  return {
    focusFirstElement,
    focusLastElement,
    getFocusableElements,
  };
};

