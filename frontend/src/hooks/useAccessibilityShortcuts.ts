import { useEffect, useCallback, useRef } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  enabled?: boolean;
}

/**
 * Hook personalizado para atalhos de teclado de acessibilidade
 */
export const useAccessibilityShortcuts = (customShortcuts: ShortcutConfig[] = []) => {
  const {
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleSimplifiedReading,
    toggleTTS,
    toggleLibras,
  } = useAccessibility();

  const shortcutsRef = useRef<ShortcutConfig[]>([]);

  /**
   * Atalhos padrão de acessibilidade
   */
  const defaultShortcuts: ShortcutConfig[] = [
    {
      key: '+',
      ctrlKey: true,
      action: increaseFontSize,
      description: 'Aumentar tamanho da fonte',
      enabled: true,
    },
    {
      key: '-',
      ctrlKey: true,
      action: decreaseFontSize,
      description: 'Diminuir tamanho da fonte',
      enabled: true,
    },
    {
      key: 'h',
      ctrlKey: true,
      altKey: true,
      action: toggleHighContrast,
      description: 'Alternar alto contraste',
      enabled: true,
    },
    {
      key: 's',
      ctrlKey: true,
      altKey: true,
      action: toggleSimplifiedReading,
      description: 'Alternar leitura simplificada',
      enabled: true,
    },
    {
      key: 't',
      ctrlKey: true,
      altKey: true,
      action: toggleTTS,
      description: 'Alternar Text-to-Speech',
      enabled: true,
    },
    {
      key: 'l',
      ctrlKey: true,
      altKey: true,
      action: toggleLibras,
      description: 'Alternar LIBRAS',
      enabled: true,
    },
  ];

  /**
   * Combina atalhos padrão com personalizados
   */
  useEffect(() => {
    shortcutsRef.current = [...defaultShortcuts, ...customShortcuts];
  }, [customShortcuts]);

  /**
   * Manipula os eventos de teclado
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const shortcuts = shortcutsRef.current;

    for (const shortcut of shortcuts) {
      if (shortcut.enabled === false) continue;

      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = !shortcut.ctrlKey || event.ctrlKey;
      const altMatches = !shortcut.altKey || event.altKey;
      const shiftMatches = !shortcut.shiftKey || event.shiftKey;

      // Verifica se não há modificadores extras não esperados
      const noExtraCtrl = shortcut.ctrlKey || !event.ctrlKey;
      const noExtraAlt = shortcut.altKey || !event.altKey;
      const noExtraShift = shortcut.shiftKey || !event.shiftKey;

      if (
        keyMatches &&
        ctrlMatches &&
        altMatches &&
        shiftMatches &&
        noExtraCtrl &&
        noExtraAlt &&
        noExtraShift
      ) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, []);

  /**
   * Adiciona o listener de eventos
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Obtém a lista de todos os atalhos disponíveis
   */
  const getAllShortcuts = useCallback((): ShortcutConfig[] => {
    return shortcutsRef.current.filter((s) => s.enabled !== false);
  }, []);

  /**
   * Formata um atalho para exibição
   */
  const formatShortcut = useCallback((shortcut: ShortcutConfig): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());

    return parts.join(' + ');
  }, []);

  /**
   * Mostra um modal com todos os atalhos disponíveis
   */
  const showShortcutsHelp = useCallback(() => {
    const shortcuts = getAllShortcuts();
    const helpText = shortcuts
      .map((s) => `${formatShortcut(s)}: ${s.description}`)
      .join('\n');

    alert(`Atalhos de Acessibilidade Disponíveis:\n\n${helpText}`);
  }, [getAllShortcuts, formatShortcut]);

  /**
   * Atalho para mostrar a ajuda (Ctrl + Alt + ?)
   */
  useEffect(() => {
    const handleHelpShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === '?') {
        event.preventDefault();
        showShortcutsHelp();
      }
    };

    document.addEventListener('keydown', handleHelpShortcut);

    return () => {
      document.removeEventListener('keydown', handleHelpShortcut);
    };
  }, [showShortcutsHelp]);

  return {
    shortcuts: getAllShortcuts(),
    formatShortcut,
    showShortcutsHelp,
  };
};

