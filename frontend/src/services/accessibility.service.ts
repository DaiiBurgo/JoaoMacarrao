import { api } from './api';
import type { AccessibilityConfig, TTSRequest, TTSResponse } from '../types/accessibility';

const ACCESSIBILITY_BASE_PATH = '/api/accessibility';

export const accessibilityService = {
  /**
   * Obtém as configurações de acessibilidade disponíveis
   */
  async getConfig(): Promise<AccessibilityConfig> {
    const response = await api.get<AccessibilityConfig>(`${ACCESSIBILITY_BASE_PATH}/config/`);
    return response.data;
  },

  /**
   * Converte texto em áudio usando Text-to-Speech
   */
  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    const response = await api.post<TTSResponse>(`${ACCESSIBILITY_BASE_PATH}/tts/`, request);
    return response.data;
  },

  /**
   * Reproduz o áudio a partir de base64
   */
  playAudio(audioBase64: string): void {
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audio.play().catch((error) => {
      console.error('Erro ao reproduzir áudio:', error);
    });
  },

  /**
   * Reproduz o áudio a partir de URL
   */
  playAudioFromUrl(audioUrl: string): void {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error('Erro ao reproduzir áudio:', error);
    });
  },
};

