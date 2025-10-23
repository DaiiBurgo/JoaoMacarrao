import { useCallback } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

/**
 * Hook personalizado para controle de tamanho de fonte
 */
export const useFontSize = () => {
  const { settings, increaseFontSize, decreaseFontSize, updateSettings } = useAccessibility();

  /**
   * Define o tamanho da fonte para um valor específico
   */
  const setFontSize = useCallback(
    (size: number) => {
      const clampedSize = Math.max(12, Math.min(24, size));
      updateSettings({ fontSize: clampedSize });
    },
    [updateSettings]
  );

  /**
   * Aumenta o tamanho da fonte
   */
  const increase = useCallback(() => {
    increaseFontSize();
  }, [increaseFontSize]);

  /**
   * Diminui o tamanho da fonte
   */
  const decrease = useCallback(() => {
    decreaseFontSize();
  }, [decreaseFontSize]);

  /**
   * Reseta o tamanho da fonte para o padrão
   */
  const reset = useCallback(() => {
    updateSettings({ fontSize: 16 });
  }, [updateSettings]);

  /**
   * Verifica se pode aumentar mais
   */
  const canIncrease = settings.fontSize < 24;

  /**
   * Verifica se pode diminuir mais
   */
  const canDecrease = settings.fontSize > 12;

  /**
   * Obtém o percentual atual em relação ao tamanho padrão (16px)
   */
  const getPercentage = useCallback(() => {
    return Math.round((settings.fontSize / 16) * 100);
  }, [settings.fontSize]);

  return {
    fontSize: settings.fontSize,
    increase,
    decrease,
    setFontSize,
    reset,
    canIncrease,
    canDecrease,
    percentage: getPercentage(),
  };
};


