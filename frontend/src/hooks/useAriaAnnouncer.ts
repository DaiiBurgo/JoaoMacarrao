import { useCallback, useRef, useEffect } from 'react';

interface AnnouncementOptions {
  priority?: 'polite' | 'assertive';
  delay?: number;
  clearAfter?: number;
}

/**
 * Hook personalizado para anúncios ARIA avançados
 */
export const useAriaAnnouncer = () => {
  const politeRegionRef = useRef<HTMLDivElement | null>(null);
  const assertiveRegionRef = useRef<HTMLDivElement | null>(null);

  /**
   * Inicializa as regiões ARIA live
   */
  useEffect(() => {
    // Cria região polite
    if (!politeRegionRef.current) {
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
      politeRegionRef.current = region;
    }

    // Cria região assertive
    if (!assertiveRegionRef.current) {
      const region = document.createElement('div');
      region.setAttribute('role', 'alert');
      region.setAttribute('aria-live', 'assertive');
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
      assertiveRegionRef.current = region;
    }

    return () => {
      if (politeRegionRef.current) {
        document.body.removeChild(politeRegionRef.current);
        politeRegionRef.current = null;
      }
      if (assertiveRegionRef.current) {
        document.body.removeChild(assertiveRegionRef.current);
        assertiveRegionRef.current = null;
      }
    };
  }, []);

  /**
   * Anuncia uma mensagem
   */
  const announce = useCallback(
    (
      message: string,
      options: AnnouncementOptions = {}
    ) => {
      const {
        priority = 'polite',
        delay = 0,
        clearAfter = 1000,
      } = options;

      const region = priority === 'polite' 
        ? politeRegionRef.current 
        : assertiveRegionRef.current;

      if (!region) return;

      const announceMessage = () => {
        region.textContent = message;

        if (clearAfter > 0) {
          setTimeout(() => {
            region.textContent = '';
          }, clearAfter);
        }
      };

      if (delay > 0) {
        setTimeout(announceMessage, delay);
      } else {
        announceMessage();
      }
    },
    []
  );

  /**
   * Anuncia uma mensagem de erro
   */
  const announceError = useCallback(
    (message: string, delay = 0) => {
      announce(`Erro: ${message}`, { priority: 'assertive', delay });
    },
    [announce]
  );

  /**
   * Anuncia uma mensagem de sucesso
   */
  const announceSuccess = useCallback(
    (message: string, delay = 0) => {
      announce(`Sucesso: ${message}`, { priority: 'polite', delay });
    },
    [announce]
  );

  /**
   * Anuncia uma mensagem de aviso
   */
  const announceWarning = useCallback(
    (message: string, delay = 0) => {
      announce(`Aviso: ${message}`, { priority: 'assertive', delay });
    },
    [announce]
  );

  /**
   * Anuncia uma mensagem informativa
   */
  const announceInfo = useCallback(
    (message: string, delay = 0) => {
      announce(`Informação: ${message}`, { priority: 'polite', delay });
    },
    [announce]
  );

  /**
   * Anuncia o carregamento
   */
  const announceLoading = useCallback(
    (message: string = 'Carregando...', delay = 0) => {
      announce(message, { priority: 'polite', delay, clearAfter: 0 });
    },
    [announce]
  );

  /**
   * Limpa o anúncio de carregamento
   */
  const clearLoading = useCallback(() => {
    if (politeRegionRef.current) {
      politeRegionRef.current.textContent = '';
    }
  }, []);

  /**
   * Anuncia uma mudança de página/rota
   */
  const announceNavigation = useCallback(
    (pageName: string) => {
      announce(`Navegando para ${pageName}`, { priority: 'polite', delay: 100 });
    },
    [announce]
  );

  /**
   * Anuncia uma contagem (útil para listas, resultados de busca, etc)
   */
  const announceCount = useCallback(
    (count: number, itemType: string = 'itens') => {
      const message = count === 1 
        ? `1 ${itemType.slice(0, -1)}` 
        : `${count} ${itemType}`;
      announce(message, { priority: 'polite' });
    },
    [announce]
  );

  return {
    announce,
    announceError,
    announceSuccess,
    announceWarning,
    announceInfo,
    announceLoading,
    clearLoading,
    announceNavigation,
    announceCount,
  };
};

