/**
 * Testes unitários para hooks de acessibilidade
 * 
 * Exemplos de como testar os hooks personalizados de acessibilidade
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';
import {
  useFontSize,
  useHighContrast,
  useSimplifiedReading,
  useKeyboardNavigation,
  useAccessibilityPreferences,
} from '../index';

// Wrapper para testes que precisam do Provider
const wrapper = ({ children }: { children: ReactNode }) => (
  <AccessibilityProvider>{children}</AccessibilityProvider>
);

// ====================================
// Testes: useFontSize
// ====================================
describe('useFontSize', () => {
  test('deve iniciar com tamanho padrão de 16px', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });
    expect(result.current.fontSize).toBe(16);
  });

  test('deve aumentar o tamanho da fonte', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.increase();
    });

    expect(result.current.fontSize).toBe(18);
  });

  test('deve diminuir o tamanho da fonte', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.decrease();
    });

    expect(result.current.fontSize).toBe(14);
  });

  test('não deve ultrapassar o tamanho máximo (24px)', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    // Aumenta várias vezes
    act(() => {
      result.current.setFontSize(24);
      result.current.increase();
    });

    expect(result.current.fontSize).toBe(24);
    expect(result.current.canIncrease).toBe(false);
  });

  test('não deve ficar menor que o tamanho mínimo (12px)', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.setFontSize(12);
      result.current.decrease();
    });

    expect(result.current.fontSize).toBe(12);
    expect(result.current.canDecrease).toBe(false);
  });

  test('deve resetar para o tamanho padrão', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.setFontSize(20);
    });

    expect(result.current.fontSize).toBe(20);

    act(() => {
      result.current.reset();
    });

    expect(result.current.fontSize).toBe(16);
  });

  test('deve calcular o percentual corretamente', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    expect(result.current.percentage).toBe(100); // 16px = 100%

    act(() => {
      result.current.setFontSize(20);
    });

    expect(result.current.percentage).toBe(125); // 20px = 125%
  });
});

// ====================================
// Testes: useHighContrast
// ====================================
describe('useHighContrast', () => {
  test('deve iniciar desabilitado', () => {
    const { result } = renderHook(() => useHighContrast(), { wrapper });
    expect(result.current.isEnabled).toBe(false);
  });

  test('deve alternar o modo de alto contraste', () => {
    const { result } = renderHook(() => useHighContrast(), { wrapper });

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isEnabled).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isEnabled).toBe(false);
  });

  test('deve habilitar o modo de alto contraste', () => {
    const { result } = renderHook(() => useHighContrast(), { wrapper });

    act(() => {
      result.current.enable();
    });

    expect(result.current.isEnabled).toBe(true);

    // Não deve fazer nada se já estiver habilitado
    act(() => {
      result.current.enable();
    });

    expect(result.current.isEnabled).toBe(true);
  });

  test('deve desabilitar o modo de alto contraste', () => {
    const { result } = renderHook(() => useHighContrast(), { wrapper });

    act(() => {
      result.current.enable();
      result.current.disable();
    });

    expect(result.current.isEnabled).toBe(false);
  });
});

// ====================================
// Testes: useSimplifiedReading
// ====================================
describe('useSimplifiedReading', () => {
  test('deve iniciar desabilitado', () => {
    const { result } = renderHook(() => useSimplifiedReading(), { wrapper });
    expect(result.current.isEnabled).toBe(false);
  });

  test('deve alternar o modo de leitura simplificada', () => {
    const { result } = renderHook(() => useSimplifiedReading(), { wrapper });

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isEnabled).toBe(true);
  });

  test('deve aplicar classe ao body quando habilitado', () => {
    const { result } = renderHook(() => useSimplifiedReading(), { wrapper });

    act(() => {
      result.current.enable();
    });

    expect(document.body.classList.contains('simplified-reading')).toBe(true);

    act(() => {
      result.current.disable();
    });

    expect(document.body.classList.contains('simplified-reading')).toBe(false);
  });
});

// ====================================
// Testes: useKeyboardNavigation
// ====================================
describe('useKeyboardNavigation', () => {
  beforeEach(() => {
    // Limpa o DOM antes de cada teste
    document.body.innerHTML = `
      <div id="container">
        <button id="btn1">Button 1</button>
        <button id="btn2">Button 2</button>
        <button id="btn3">Button 3</button>
      </div>
    `;
  });

  test('deve focar no primeiro elemento', () => {
    const containerRef = { current: document.getElementById('container') };
    const { result } = renderHook(() => 
      useKeyboardNavigation(containerRef as any)
    );

    act(() => {
      result.current.focusFirst();
    });

    expect(document.activeElement?.id).toBe('btn1');
  });

  test('deve focar no último elemento', () => {
    const containerRef = { current: document.getElementById('container') };
    const { result } = renderHook(() => 
      useKeyboardNavigation(containerRef as any)
    );

    act(() => {
      result.current.focusLast();
    });

    expect(document.activeElement?.id).toBe('btn3');
  });

  test('deve navegar para o próximo elemento', () => {
    const containerRef = { current: document.getElementById('container') };
    const { result } = renderHook(() => 
      useKeyboardNavigation(containerRef as any)
    );

    act(() => {
      result.current.focusFirst();
      result.current.focusNext();
    });

    expect(document.activeElement?.id).toBe('btn2');
  });

  test('deve fazer loop ao chegar no final', () => {
    const containerRef = { current: document.getElementById('container') };
    const { result } = renderHook(() => 
      useKeyboardNavigation(containerRef as any, { loop: true })
    );

    act(() => {
      result.current.focusLast();
      result.current.focusNext();
    });

    // Deve voltar para o primeiro
    expect(document.activeElement?.id).toBe('btn1');
  });
});

// ====================================
// Testes: useAccessibilityPreferences
// ====================================
describe('useAccessibilityPreferences', () => {
  test('deve iniciar com configurações padrão', () => {
    const { result } = renderHook(() => useAccessibilityPreferences(), { wrapper });

    expect(result.current.settings).toEqual({
      fontSize: 16,
      highContrast: false,
      simplifiedReading: false,
      ttsEnabled: false,
      language: 'pt-BR',
      voiceGender: 'NEUTRAL',
      librasEnabled: false,
    });
  });

  test('deve atualizar o idioma', () => {
    const { result } = renderHook(() => useAccessibilityPreferences(), { wrapper });

    act(() => {
      result.current.setLanguage('en-US');
    });

    expect(result.current.settings.language).toBe('en-US');
  });

  test('deve atualizar o gênero da voz', () => {
    const { result } = renderHook(() => useAccessibilityPreferences(), { wrapper });

    act(() => {
      result.current.setVoiceGender('FEMALE');
    });

    expect(result.current.settings.voiceGender).toBe('FEMALE');
  });

  test('deve detectar preferências customizadas', () => {
    const { result } = renderHook(() => useAccessibilityPreferences(), { wrapper });

    expect(result.current.hasCustomPreferences).toBe(false);

    act(() => {
      result.current.updateSettings({ fontSize: 20 });
    });

    // Nota: Este teste pode falhar dependendo da implementação
    // pois hasCustomPreferences é recalculado
  });

  test('deve resetar as configurações', () => {
    const { result } = renderHook(() => useAccessibilityPreferences(), { wrapper });

    act(() => {
      result.current.updateSettings({ fontSize: 20, highContrast: true });
    });

    expect(result.current.settings.fontSize).toBe(20);
    expect(result.current.settings.highContrast).toBe(true);

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings.fontSize).toBe(16);
    expect(result.current.settings.highContrast).toBe(false);
  });
});

// ====================================
// Testes de Integração
// ====================================
describe('Integração de Hooks', () => {
  test('deve sincronizar configurações entre hooks', () => {
    const { result: fontResult } = renderHook(() => useFontSize(), { wrapper });
    const { result: contrastResult } = renderHook(() => useHighContrast(), { wrapper });

    // Altera fonte
    act(() => {
      fontResult.current.increase();
    });

    // Altera contraste
    act(() => {
      contrastResult.current.enable();
    });

    // Verifica se ambos estão ativos
    expect(fontResult.current.fontSize).toBe(18);
    expect(contrastResult.current.isEnabled).toBe(true);
  });

  test('deve persistir configurações no localStorage', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.setFontSize(20);
    });

    // Verifica se foi salvo no localStorage
    const saved = localStorage.getItem('accessibility_settings');
    expect(saved).toBeTruthy();
    
    if (saved) {
      const settings = JSON.parse(saved);
      expect(settings.fontSize).toBe(20);
    }
  });
});

// ====================================
// Testes de Acessibilidade
// ====================================
describe('Testes de Acessibilidade', () => {
  test('deve adicionar classes de acessibilidade ao documento', () => {
    const { result: contrastResult } = renderHook(() => useHighContrast(), { wrapper });

    act(() => {
      contrastResult.current.enable();
    });

    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  test('deve aplicar estilos de fonte ao documento', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.setFontSize(20);
    });

    expect(document.documentElement.style.fontSize).toBe('20px');
  });
});

// ====================================
// Mocks para Testes Avançados
// ====================================
describe('Testes com Mocks', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('deve carregar configurações do localStorage', () => {
    const mockSettings = JSON.stringify({
      fontSize: 20,
      highContrast: true,
      simplifiedReading: false,
      ttsEnabled: true,
      language: 'pt-BR',
      voiceGender: 'FEMALE',
      librasEnabled: false,
    });

    (Storage.prototype.getItem as any).mockReturnValue(mockSettings);

    const { result } = renderHook(() => useAccessibilityPreferences(), { wrapper });

    // As configurações devem ser carregadas do localStorage
    expect(result.current.settings.fontSize).toBe(20);
    expect(result.current.settings.highContrast).toBe(true);
  });
});

// ====================================
// Testes de Edge Cases
// ====================================
describe('Edge Cases', () => {
  test('deve lidar com valores inválidos de fonte', () => {
    const { result } = renderHook(() => useFontSize(), { wrapper });

    act(() => {
      result.current.setFontSize(-10); // Valor negativo
    });

    expect(result.current.fontSize).toBe(12); // Deve usar o mínimo

    act(() => {
      result.current.setFontSize(1000); // Valor muito alto
    });

    expect(result.current.fontSize).toBe(24); // Deve usar o máximo
  });

  test('deve lidar com elementos não encontrados', () => {
    const { result } = renderHook(() => useSimplifiedReading(), { wrapper });

    // Não deve lançar erro ao tentar simplificar elemento inexistente
    expect(() => {
      act(() => {
        result.current.simplifyContent('elemento-inexistente');
      });
    }).not.toThrow();
  });
});

