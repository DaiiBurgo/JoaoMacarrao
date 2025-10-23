import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook personalizado para suporte a leitores de tela
 */
export const useScreenReader = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  /**
   * Inicializa a região ARIA live
   */
  useEffect(() => {
    // Cria uma região ARIA live se não existir
    if (!liveRegionRef.current) {
      const region = document.createElement('div');
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      region.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(region);
      liveRegionRef.current = region;
    }

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current);
        liveRegionRef.current = null;
      }
    };
  }, []);

  /**
   * Anuncia uma mensagem para leitores de tela
   */
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!liveRegionRef.current) return;

      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;

      // Limpa a mensagem após um tempo
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    },
    []
  );

  /**
   * Anuncia uma mensagem de erro
   */
  const announceError = useCallback(
    (message: string) => {
      announce(`Erro: ${message}`, 'assertive');
    },
    [announce]
  );

  /**
   * Anuncia uma mensagem de sucesso
   */
  const announceSuccess = useCallback(
    (message: string) => {
      announce(`Sucesso: ${message}`, 'polite');
    },
    [announce]
  );

  /**
   * Anuncia o carregamento
   */
  const announceLoading = useCallback(
    (message: string = 'Carregando...') => {
      announce(message, 'polite');
    },
    [announce]
  );

  /**
   * Detecta se um leitor de tela está ativo
   */
  const detectScreenReader = useCallback((): boolean => {
    // Verifica se há um leitor de tela detectável
    // Nota: Esta é uma detecção aproximada, não é 100% precisa
    return (
      window.navigator.userAgent.includes('JAWS') ||
      window.navigator.userAgent.includes('NVDA') ||
      document.documentElement.hasAttribute('data-screen-reader') ||
      !!window.speechSynthesis
    );
  }, []);

  /**
   * Define o foco em um elemento específico
   */
  const focusElement = useCallback(
    (elementId: string, announceLabel?: string) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
        if (announceLabel) {
          announce(`Foco em ${announceLabel}`, 'polite');
        }
      }
    },
    [announce]
  );

  /**
   * Cria um rótulo descritivo para um elemento
   */
  const setAriaLabel = useCallback((elementId: string, label: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.setAttribute('aria-label', label);
    }
  }, []);

  /**
   * Define uma descrição para um elemento
   */
  const setAriaDescription = useCallback(
    (elementId: string, description: string) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.setAttribute('aria-description', description);
      }
    },
    []
  );

  return {
    announce,
    announceError,
    announceSuccess,
    announceLoading,
    detectScreenReader,
    focusElement,
    setAriaLabel,
    setAriaDescription,
  };
};


