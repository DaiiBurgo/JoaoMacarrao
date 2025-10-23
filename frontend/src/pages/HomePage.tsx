import React, { useState, useEffect } from 'react';
import { MapPin, Play, Volume2, ChevronRight } from 'lucide-react';
import DishCard, { Dish } from '../components/DishCard';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import '../styles/home-page.css';

const HomePage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const { speak, isSpeaking } = useTextToSpeech();

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockDishes: Dish[] = [
      {
        id: 1,
        name: 'Espaguete ao Frutos do Mar',
        description: 'Massa fresca com camarões, lulas e mexilhões ao molho de tomate artesanal',
        price: 48.90,
        category: 'Massas',
        rating: 5,
        prepTime: '25 min',
        image: '/images/dishes/espaguete-frutos-mar.jpg',
      },
      {
        id: 2,
        name: 'Fettuccine Alfredo',
        description: 'Massa artesanal ao molho branco cremoso com queijo parmesão gratinado',
        price: 42.90,
        category: 'Massas',
        rating: 4.5,
        prepTime: '20 min',
        image: '/images/dishes/fettuccine-alfredo.jpg',
      },
      {
        id: 3,
        name: 'Risoto de Camarão',
        description: 'Arroz arbóreo cremoso com camarões frescos e toque de limão siciliano',
        price: 52.90,
        category: 'Risotos',
        rating: 5,
        prepTime: '30 min',
        image: '/images/dishes/risoto-camarao.jpg',
      },
    ];

    setTimeout(() => {
      setDishes(mockDishes);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddToCart = async (dish: Dish) => {
    console.log('Adicionando ao carrinho:', dish);
    // Implementar lógica do carrinho
  };

  const handlePlayAudio = (text: string) => {
    speak(text);
  };

  const handlePlayVideo = (dishId: number) => {
    console.log('Reproduzindo vídeo do prato:', dishId);
    // Implementar modal de vídeo
  };

  const handlePlayBannerVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
    // Implementar reprodução de vídeo
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section" aria-label="Banner principal">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            Massas Artesanais e Frutos do Mar
          </h1>
          <p className="hero-description animate-fade-in">
            Tradição italiana encontra o frescor do mar. Cada prato é uma experiência única,
            preparada com ingredientes selecionados e muito amor.
          </p>
          <div className="hero-actions animate-fade-in">
            <a href="#menu" className="btn btn-primary btn-lg">
              <span>Ver Cardápio</span>
              <ChevronRight size={20} />
            </a>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => speak('Bem-vindo ao João Macarrão! Massas artesanais e frutos do mar com o sabor autêntico do litoral.')}
            >
              <Volume2 size={20} />
              <span>Ouvir Apresentação</span>
            </button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="hero-decoration" aria-hidden="true">
          <div className="decoration-wave"></div>
          <div className="decoration-bubbles">
            <span className="bubble bubble-1">🍝</span>
            <span className="bubble bubble-2">🦐</span>
            <span className="bubble bubble-3">🐚</span>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="menu-section" id="menu" aria-label="Cardápio em destaque">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Pratos em Destaque</h2>
            <p className="section-subtitle">
              Conheça nossos pratos mais amados, feitos com ingredientes frescos e muito carinho
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" aria-label="Carregando pratos"></div>
              <p>Carregando delícias...</p>
            </div>
          ) : (
            <div className="dishes-grid">
              {dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onAddToCart={handleAddToCart}
                  onPlayAudio={handlePlayAudio}
                  onPlayVideo={handlePlayVideo}
                />
              ))}
            </div>
          )}

          <div className="section-cta">
            <a href="/menu" className="btn btn-secondary btn-lg">
              Ver Cardápio Completo
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section" aria-label="Vídeo de preparo">
        <div className="container">
          <div className="video-wrapper">
            <div className="video-content">
              <h2 className="video-title">Veja Como Preparamos</h2>
              <p className="video-description">
                Acompanhe o processo artesanal de preparo das nossas massas, 
                desde a seleção dos ingredientes até o prato final.
              </p>
              <button
                className="btn-play"
                onClick={handlePlayBannerVideo}
                aria-label={isVideoPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              >
                <Play size={32} fill="currentColor" />
              </button>
            </div>
            <div className="video-placeholder">
              <div className="video-frame">
                {isVideoPlaying ? (
                  <div className="video-playing">
                    <p>▶️ Vídeo em reprodução</p>
                  </div>
                ) : (
                  <div className="video-thumbnail">
                    <img 
                      src="/images/video-thumbnail.jpg" 
                      alt="Thumbnail do vídeo de preparo"
                    />
                    <div className="play-overlay">
                      <Play size={64} fill="white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section" aria-label="Localização e contato">
        <div className="container">
          <div className="location-content">
            <div className="location-info">
              <h2 className="location-title">Visite-nos</h2>
              <p className="location-description">
                Estamos localizados na orla, com vista para o mar. 
                Venha conhecer nosso espaço acolhedor e acessível.
              </p>
              
              <div className="location-details">
                <div className="detail-item">
                  <MapPin size={24} className="detail-icon" aria-hidden="true" />
                  <div>
                    <strong>Endereço</strong>
                    <address>
                      Av. Atlântica, 1000<br />
                      Praia Grande - SP<br />
                      CEP: 11700-000
                    </address>
                  </div>
                </div>
              </div>

              <div className="location-actions">
                <a 
                  href="https://maps.google.com/?q=Av.+Atlântica+1000+Praia+Grande+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-coral btn-lg"
                >
                  <MapPin size={20} />
                  <span>Ver no Mapa</span>
                </a>
                <a
                  href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20fazer%20uma%20reserva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <span>Fazer Reserva</span>
                </a>
              </div>
            </div>

            <div className="location-map">
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3645.872842767235!2d-46.41234668502207!3d-23.996319884430476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDU5JzQ2LjgiUyA0NsKwMjQnMzUuOCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do restaurante João Macarrão"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" aria-label="Chamada para ação">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Pronto para Saborear?</h2>
            <p className="cta-description">
              Faça seu pedido agora pelo WhatsApp e receba em casa ou retire no restaurante
            </p>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg cta-button"
            >
              <span>Peça pelo WhatsApp</span>
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

