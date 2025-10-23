import { useCallback, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

/**
 * Hook personalizado para controle de alto contraste
 */
export const useHighContrast = () => {
  const { settings, toggleHighContrast, updateSettings } = useAccessibility();

  /**
   * Ativa o modo de alto contraste
   */
  const enable = useCallback(() => {
    if (!settings.highContrast) {
      toggleHighContrast();
    }
  }, [settings.highContrast, toggleHighContrast]);

  /**
   * Desativa o modo de alto contraste
   */
  const disable = useCallback(() => {
    if (settings.highContrast) {
      toggleHighContrast();
    }
  }, [settings.highContrast, toggleHighContrast]);

  /**
   * Alterna o modo de alto contraste
   */
  const toggle = useCallback(() => {
    toggleHighContrast();
  }, [toggleHighContrast]);

  /**
   * Detecta a preferência do sistema operacional
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && !settings.highContrast) {
        updateSettings({ highContrast: true });
      }
    };

    // Verifica a preferência inicial
    handleChange(mediaQuery);

    // Escuta mudanças
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [updateSettings, settings.highContrast]);

  return {
    isEnabled: settings.highContrast,
    enable,
    disable,
    toggle,
  };
};


