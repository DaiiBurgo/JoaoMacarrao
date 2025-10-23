import { useCallback, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

/**
 * Hook personalizado para controle de leitura simplificada
 */
export const useSimplifiedReading = () => {
  const { settings, toggleSimplifiedReading, updateSettings } = useAccessibility();

  /**
   * Ativa o modo de leitura simplificada
   */
  const enable = useCallback(() => {
    if (!settings.simplifiedReading) {
      toggleSimplifiedReading();
    }
  }, [settings.simplifiedReading, toggleSimplifiedReading]);

  /**
   * Desativa o modo de leitura simplificada
   */
  const disable = useCallback(() => {
    if (settings.simplifiedReading) {
      toggleSimplifiedReading();
    }
  }, [settings.simplifiedReading, toggleSimplifiedReading]);

  /**
   * Alterna o modo de leitura simplificada
   */
  const toggle = useCallback(() => {
    toggleSimplifiedReading();
  }, [toggleSimplifiedReading]);

  /**
   * Aplica estilos de leitura simplificada
   */
  useEffect(() => {
    if (settings.simplifiedReading) {
      document.body.classList.add('simplified-reading');
    } else {
      document.body.classList.remove('simplified-reading');
    }
  }, [settings.simplifiedReading]);

  /**
   * Remove elementos não essenciais para leitura simplificada
   */
  const simplifyContent = useCallback((containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Oculta elementos decorativos
    const decorativeElements = container.querySelectorAll('[role="presentation"], .decorative');
    decorativeElements.forEach((el) => {
      if (settings.simplifiedReading) {
        (el as HTMLElement).style.display = 'none';
      } else {
        (el as HTMLElement).style.display = '';
      }
    });
  }, [settings.simplifiedReading]);

  return {
    isEnabled: settings.simplifiedReading,
    enable,
    disable,
    toggle,
    simplifyContent,
  };
};

