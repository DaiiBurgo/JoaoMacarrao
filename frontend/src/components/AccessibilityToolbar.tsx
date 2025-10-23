import React, { useState } from 'react';
import {
  useFontSize,
  useHighContrast,
  useSimplifiedReading,
  useLibras,
  useTextToSpeech,
  useAccessibilityShortcuts,
} from '../hooks';

/**
 * Componente de barra de ferramentas de acessibilidade
 * Demonstra o uso prático dos hooks personalizados
 */
const AccessibilityToolbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Hooks de controle
  const {
    fontSize,
    increase: increaseFontSize,
    decrease: decreaseFontSize,
    reset: resetFontSize,
    canIncrease,
    canDecrease,
    percentage,
  } = useFontSize();

  const {
    isEnabled: highContrastEnabled,
    toggle: toggleHighContrast,
  } = useHighContrast();

  const {
    isEnabled: simplifiedReadingEnabled,
    toggle: toggleSimplifiedReading,
  } = useSimplifiedReading();

  const {
    isEnabled: librasEnabled,
    isPlayerVisible,
    toggle: toggleLibras,
    playerStyle,
  } = useLibras();

  const {
    isEnabled: ttsEnabled,
    speakText,
    isSpeaking,
  } = useTextToSpeech();

  const { shortcuts, showShortcutsHelp } = useAccessibilityShortcuts();

  // Handlers
  const handleSpeak = () => {
    speakText('Barra de ferramentas de acessibilidade');
  };

  const toggleToolbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Botão flutuante de acessibilidade */}
      <button
        onClick={toggleToolbar}
        className="accessibility-toggle"
        aria-label="Abrir ferramentas de acessibilidade"
        aria-expanded={isExpanded}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          fontSize: '24px',
          zIndex: 1000,
        }}
      >
        ♿
      </button>

      {/* Painel de ferramentas */}
      {isExpanded && (
        <div
          className="accessibility-toolbar"
          role="dialog"
          aria-label="Ferramentas de acessibilidade"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '320px',
            maxHeight: '500px',
            backgroundColor: 'white',
            border: '2px solid #0066cc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '20px',
            zIndex: 999,
            overflowY: 'auto',
          }}
        >
          {/* Cabeçalho */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Acessibilidade</h2>
            <button
              onClick={toggleToolbar}
              aria-label="Fechar ferramentas de acessibilidade"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              ×
            </button>
          </div>

          {/* Controles de fonte */}
          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
              Tamanho da Fonte
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={decreaseFontSize}
                disabled={!canDecrease}
                aria-label="Diminuir tamanho da fonte"
                style={{
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: canDecrease ? 'pointer' : 'not-allowed',
                  opacity: canDecrease ? 1 : 0.5,
                }}
              >
                A-
              </button>
              <span style={{ minWidth: '80px', textAlign: 'center' }}>
                {fontSize}px ({percentage}%)
              </span>
              <button
                onClick={increaseFontSize}
                disabled={!canIncrease}
                aria-label="Aumentar tamanho da fonte"
                style={{
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: canIncrease ? 'pointer' : 'not-allowed',
                  opacity: canIncrease ? 1 : 0.5,
                }}
              >
                A+
              </button>
              <button
                onClick={resetFontSize}
                aria-label="Resetar tamanho da fonte"
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>
          </section>

          {/* Controles de modo */}
          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Modos</h3>
            
            {/* Alto contraste */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={highContrastEnabled}
                  onChange={toggleHighContrast}
                  aria-label="Ativar/desativar alto contraste"
                />
                <span>Alto Contraste</span>
              </label>
            </div>

            {/* Leitura simplificada */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={simplifiedReadingEnabled}
                  onChange={toggleSimplifiedReading}
                  aria-label="Ativar/desativar leitura simplificada"
                />
                <span>Leitura Simplificada</span>
              </label>
            </div>

            {/* LIBRAS */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={librasEnabled}
                  onChange={toggleLibras}
                  aria-label="Ativar/desativar LIBRAS"
                />
                <span>LIBRAS</span>
              </label>
            </div>
          </section>

          {/* Text-to-Speech */}
          {ttsEnabled && (
            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
                Text-to-Speech
              </h3>
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                style={{
                  padding: '10px 20px',
                  width: '100%',
                  cursor: isSpeaking ? 'not-allowed' : 'pointer',
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {isSpeaking ? '🔊 Falando...' : '🔊 Testar Voz'}
              </button>
            </section>
          )}

          {/* Atalhos de teclado */}
          <section>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
              Atalhos de Teclado
            </h3>
            <button
              onClick={showShortcutsHelp}
              style={{
                padding: '10px 20px',
                width: '100%',
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              ⌨️ Ver Atalhos (Ctrl+Alt+?)
            </button>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <p style={{ margin: '5px 0' }}>Ctrl + +: Aumentar fonte</p>
              <p style={{ margin: '5px 0' }}>Ctrl + -: Diminuir fonte</p>
              <p style={{ margin: '5px 0' }}>Ctrl + Alt + H: Alto contraste</p>
            </div>
          </section>
        </div>
      )}

      {/* Player de LIBRAS */}
      {isPlayerVisible && (
        <div
          style={playerStyle}
          role="region"
          aria-label="Player de LIBRAS"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <p>Player de LIBRAS</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityToolbar;

