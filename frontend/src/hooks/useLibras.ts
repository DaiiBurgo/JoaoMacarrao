import { useCallback, useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface LibrasVideoConfig {
  videoUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Hook personalizado para controle de LIBRAS (Língua Brasileira de Sinais)
 */
export const useLibras = (config: LibrasVideoConfig = {}) => {
  const { settings, toggleLibras } = useAccessibility();
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [playerConfig, setPlayerConfig] = useState<LibrasVideoConfig>({
    position: 'bottom-right',
    size: 'medium',
    ...config,
  });

  /**
   * Ativa o modo LIBRAS
   */
  const enable = useCallback(() => {
    if (!settings.librasEnabled) {
      toggleLibras();
    }
    setIsPlayerVisible(true);
  }, [settings.librasEnabled, toggleLibras]);

  /**
   * Desativa o modo LIBRAS
   */
  const disable = useCallback(() => {
    if (settings.librasEnabled) {
      toggleLibras();
    }
    setIsPlayerVisible(false);
  }, [settings.librasEnabled, toggleLibras]);

  /**
   * Alterna o modo LIBRAS
   */
  const toggle = useCallback(() => {
    toggleLibras();
    setIsPlayerVisible((prev) => !prev);
  }, [toggleLibras]);

  /**
   * Mostra o player de LIBRAS
   */
  const showPlayer = useCallback(() => {
    setIsPlayerVisible(true);
  }, []);

  /**
   * Oculta o player de LIBRAS
   */
  const hidePlayer = useCallback(() => {
    setIsPlayerVisible(false);
  }, []);

  /**
   * Atualiza a configuração do player
   */
  const updatePlayerConfig = useCallback((newConfig: Partial<LibrasVideoConfig>) => {
    setPlayerConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * Posiciona o player de LIBRAS na tela
   */
  const getPlayerStyle = useCallback(() => {
    const sizes = {
      small: { width: '200px', height: '150px' },
      medium: { width: '300px', height: '225px' },
      large: { width: '400px', height: '300px' },
    };

    const positions = {
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
    };

    return {
      ...sizes[playerConfig.size || 'medium'],
      ...positions[playerConfig.position || 'bottom-right'],
      position: 'fixed' as const,
      zIndex: 9999,
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };
  }, [playerConfig]);

  /**
   * Aplica os estilos quando LIBRAS está ativo
   */
  useEffect(() => {
    if (settings.librasEnabled) {
      document.body.classList.add('libras-enabled');
    } else {
      document.body.classList.remove('libras-enabled');
    }
  }, [settings.librasEnabled]);

  return {
    isEnabled: settings.librasEnabled,
    isPlayerVisible,
    playerConfig,
    playerStyle: getPlayerStyle(),
    enable,
    disable,
    toggle,
    showPlayer,
    hidePlayer,
    updatePlayerConfig,
  };
};

