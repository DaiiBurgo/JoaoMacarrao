export type VoiceGender = 'NEUTRAL' | 'MALE' | 'FEMALE';

export type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES';

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface TTSRequest {
  text: string;
  language_code?: LanguageCode;
  voice_gender?: VoiceGender;
}

export interface TTSResponse {
  audio_content: string;
  text: string;
  cache_key: string;
  audio_url: string;
}

export interface AccessibilityConfig {
  tts_enabled: boolean;
  supported_languages: Language[];
  voice_genders: VoiceGender[];
  features: {
    text_to_speech: boolean;
    high_contrast: boolean;
    font_size_adjustment: boolean;
    simplified_reading: boolean;
    libras_support: boolean;
  };
}

export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  simplifiedReading: boolean;
  ttsEnabled: boolean;
  language: LanguageCode;
  voiceGender: VoiceGender;
  librasEnabled: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  simplifiedReading: false,
  ttsEnabled: false,
  language: 'pt-BR',
  voiceGender: 'NEUTRAL',
  librasEnabled: false,
};

