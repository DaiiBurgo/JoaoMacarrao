import { useCallback, useRef, useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

/**
 * Hook personalizado para facilitar o uso de Text-to-Speech
 */
export const useTextToSpeech = () => {
  const { speak, isSpeaking, settings } = useAccessibility();
  const [queue, setQueue] = useState<string[]>([]);
  const processingQueue = useRef(false);

  /**
   * Fala um texto específico
   */
  const speakText = useCallback(
    async (text: string) => {
      if (!settings.ttsEnabled) return;
      await speak(text);
    },
    [speak, settings.ttsEnabled]
  );

  /**
   * Adiciona texto à fila de fala
   */
  const addToQueue = useCallback((text: string) => {
    setQueue((prev) => [...prev, text]);
  }, []);

  /**
   * Processa a fila de textos para falar
   */
  const processQueue = useCallback(async () => {
    if (processingQueue.current || queue.length === 0 || !settings.ttsEnabled) {
      return;
    }

    processingQueue.current = true;

    while (queue.length > 0) {
      const text = queue[0];
      await speak(text);
      setQueue((prev) => prev.slice(1));
      
      // Aguarda um pouco entre as falas
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    processingQueue.current = false;
  }, [queue, speak, settings.ttsEnabled]);

  /**
   * Fala o conteúdo de um elemento HTML
   */
  const speakElement = useCallback(
    async (elementId: string) => {
      const element = document.getElementById(elementId);
      if (element && settings.ttsEnabled) {
        const text = element.innerText || element.textContent || '';
        await speak(text);
      }
    },
    [speak, settings.ttsEnabled]
  );

  /**
   * Fala uma mensagem de anúncio (para screen readers)
   */
  const announceMessage = useCallback(
    async (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!settings.ttsEnabled) return;

      // Cria um elemento ARIA live para anúncios
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = message;
      
      document.body.appendChild(liveRegion);

      // Fala o texto
      await speak(message);

      // Remove o elemento após um tempo
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    },
    [speak, settings.ttsEnabled]
  );

  return {
    speakText,
    speakElement,
    announceMessage,
    addToQueue,
    processQueue,
    isSpeaking,
    isEnabled: settings.ttsEnabled,
  };
};


