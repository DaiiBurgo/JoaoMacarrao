import { useCallback, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { LanguageCode, VoiceGender } from '../types/accessibility';

/**
 * Hook personalizado para gerenciar preferências de acessibilidade do usuário
 */
export const useAccessibilityPreferences = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  /**
   * Detecta e aplica preferências do sistema operacional
   */
  useEffect(() => {
    // Detecta preferência de modo escuro/alto contraste
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    if (contrastQuery.matches) {
      updateSettings({ highContrast: true });
    }

    // Detecta preferência de animações reduzidas
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    }

    // Detecta preferência de cores
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (colorSchemeQuery.matches) {
      document.documentElement.classList.add('dark-mode');
    }
  }, [updateSettings]);

  /**
   * Altera o idioma da interface
   */
  const setLanguage = useCallback(
    (language: LanguageCode) => {
      updateSettings({ language });
      document.documentElement.setAttribute('lang', language.split('-')[0]);
    },
    [updateSettings]
  );

  /**
   * Altera o gênero da voz do TTS
   */
  const setVoiceGender = useCallback(
    (voiceGender: VoiceGender) => {
      updateSettings({ voiceGender });
    },
    [updateSettings]
  );

  /**
   * Salva as preferências atuais no backend (se usuário estiver autenticado)
   */
  const savePreferences = useCallback(async () => {
    try {
      // Aqui você pode fazer uma chamada para salvar no backend
      // await api.post('/api/user/accessibility-preferences', settings);
      console.log('Preferências salvas:', settings);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  }, [settings]);

  /**
   * Carrega preferências salvas do backend
   */
  const loadPreferences = useCallback(async () => {
    try {
      // Aqui você pode fazer uma chamada para carregar do backend
      // const response = await api.get('/api/user/accessibility-preferences');
      // updateSettings(response.data);
      console.log('Preferências carregadas');
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }, []);

  /**
   * Exporta as preferências como JSON
   */
  const exportPreferences = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accessibility-preferences.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [settings]);

  /**
   * Importa preferências de um arquivo JSON
   */
  const importPreferences = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          updateSettings(importedSettings);
        } catch (error) {
          console.error('Erro ao importar preferências:', error);
        }
      };
      reader.readAsText(file);
    },
    [updateSettings]
  );

  /**
   * Verifica se há preferências salvas
   */
  const hasCustomPreferences = useCallback(() => {
    const defaultSettings = {
      fontSize: 16,
      highContrast: false,
      simplifiedReading: false,
      ttsEnabled: false,
      language: 'pt-BR',
      voiceGender: 'NEUTRAL',
      librasEnabled: false,
    };

    return JSON.stringify(settings) !== JSON.stringify(defaultSettings);
  }, [settings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    setLanguage,
    setVoiceGender,
    savePreferences,
    loadPreferences,
    exportPreferences,
    importPreferences,
    hasCustomPreferences: hasCustomPreferences(),
  };
};

