import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AccessibilitySettings,
  AccessibilityConfig,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  LanguageCode,
  VoiceGender,
} from '../types/accessibility';
import { accessibilityService } from '../services/accessibility.service';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  config: AccessibilityConfig | null;
  loading: boolean;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  toggleSimplifiedReading: () => void;
  toggleTTS: () => void;
  toggleLibras: () => void;
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'accessibility_settings';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  const [config, setConfig] = useState<AccessibilityConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Carrega configuração do backend
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await accessibilityService.getConfig();
        setConfig(data);
      } catch (error) {
        console.error('Erro ao carregar configurações de acessibilidade:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Salva configurações no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAccessibilityStyles(settings);
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  };

  const increaseFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 2, 24),
    }));
  };

  const decreaseFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 2, 12),
    }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({
      ...prev,
      highContrast: !prev.highContrast,
    }));
  };

  const toggleSimplifiedReading = () => {
    setSettings((prev) => ({
      ...prev,
      simplifiedReading: !prev.simplifiedReading,
    }));
  };

  const toggleTTS = () => {
    setSettings((prev) => ({
      ...prev,
      ttsEnabled: !prev.ttsEnabled,
    }));
  };

  const toggleLibras = () => {
    setSettings((prev) => ({
      ...prev,
      librasEnabled: !prev.librasEnabled,
    }));
  };

  const speak = async (text: string) => {
    if (!settings.ttsEnabled || isSpeaking) return;

    setIsSpeaking(true);
    try {
      const response = await accessibilityService.textToSpeech({
        text,
        language_code: settings.language,
        voice_gender: settings.voiceGender,
      });

      accessibilityService.playAudio(response.audio_content);
      
      // Estima a duração baseada no tamanho do texto (aproximadamente)
      const estimatedDuration = (text.length / 10) * 1000; // ~10 caracteres por segundo
      setTimeout(() => setIsSpeaking(false), estimatedDuration);
    } catch (error) {
      console.error('Erro ao sintetizar fala:', error);
      setIsSpeaking(false);
    }
  };

  const value: AccessibilityContextType = {
    settings,
    config,
    loading,
    updateSettings,
    resetSettings,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleSimplifiedReading,
    toggleTTS,
    toggleLibras,
    speak,
    isSpeaking,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook para usar o contexto
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }
  return context;
};

// Função auxiliar para aplicar estilos de acessibilidade
function applyAccessibilityStyles(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Tamanho da fonte
  root.style.fontSize = `${settings.fontSize}px`;

  // Alto contraste
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Leitura simplificada
  if (settings.simplifiedReading) {
    root.classList.add('simplified-reading');
  } else {
    root.classList.remove('simplified-reading');
  }
}

