/**
 * Página Sobre - João Macarrão
 * História e valores do restaurante
 */
import React from 'react';
import { Heart, Award, Users, Leaf } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Nossa História</h1>
          <p className="hero-subtitle">
            Tradição italiana encontra o frescor do litoral
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-content">
        {/* História */}
        <section className="about-section">
          <div className="section-content">
            <h2>A História do João Macarrão</h2>
            <p>
              Fundado em 1985, o João Macarrão nasceu do sonho de João Silva, um apaixonado 
              pela culinária italiana e pelos frutos do mar do nosso litoral. Filho de 
              imigrantes italianos, João cresceu cercado pelos aromas e sabores da cozinha 
              tradicional, mas sempre com aquele toque especial dos ingredientes frescos do mar.
            </p>
            <p>
              O que começou como um pequeno restaurante familiar, se tornou referência em 
              massas artesanais e frutos do mar na região. Cada prato é preparado com o mesmo 
              cuidado e dedicação que João aprendeu com sua nonna, mantendo viva a tradição 
              italiana enquanto celebra a riqueza do nosso litoral.
            </p>
          </div>
          <div className="section-image">
            <div className="image-placeholder">
              <Heart size={64} />
              <p>Paixão pela culinária desde 1985</p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="values-section">
          <h2>Nossos Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Leaf size={40} />
              </div>
              <h3>Ingredientes Frescos</h3>
              <p>
                Trabalhamos apenas com ingredientes selecionados e da melhor qualidade. 
                Nossos frutos do mar são frescos e nossa massa é feita artesanalmente 
                todos os dias.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Award size={40} />
              </div>
              <h3>Tradição e Qualidade</h3>
              <p>
                Mantemos as receitas tradicionais da culinária italiana, passadas de 
                geração em geração, garantindo autenticidade e sabor incomparável em 
                cada prato.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Users size={40} />
              </div>
              <h3>Família e Acolhimento</h3>
              <p>
                Mais que um restaurante, somos uma família. Cada cliente é recebido com 
                carinho e atenção, fazendo com que todos se sintam em casa.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Heart size={40} />
              </div>
              <h3>Amor em Cada Prato</h3>
              <p>
                Preparamos cada refeição com dedicação e paixão, como se estivéssemos 
                cozinhando para nossa própria família. Isso faz toda a diferença.
              </p>
            </div>
          </div>
        </section>

        {/* Compromisso */}
        <section className="commitment-section">
          <div className="commitment-content">
            <h2>Nosso Compromisso</h2>
            <div className="commitment-list">
              <div className="commitment-item">
                <span className="commitment-number">01</span>
                <div>
                  <h3>Sustentabilidade</h3>
                  <p>Respeitamos o meio ambiente e apoiamos fornecedores locais comprometidos com práticas sustentáveis.</p>
                </div>
              </div>
              <div className="commitment-item">
                <span className="commitment-number">02</span>
                <div>
                  <h3>Acessibilidade</h3>
                  <p>Nosso espaço e serviços são acessíveis a todos, garantindo que todos possam desfrutar de nossas delícias.</p>
                </div>
              </div>
              <div className="commitment-item">
                <span className="commitment-number">03</span>
                <div>
                  <h3>Inovação</h3>
                  <p>Respeitamos a tradição, mas também inovamos, criando novos pratos e experiências para nossos clientes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2>Venha nos Conhecer!</h2>
          <p>Estamos te esperando para uma experiência gastronômica inesquecível</p>
          <div className="cta-buttons">
            <a href="/" className="btn btn-primary btn-lg">
              Ver Cardápio
            </a>
            <a href="/contact" className="btn btn-outline btn-lg">
              Entre em Contato
            </a>
          </div>
        </section>
      </div>

      <style>{`
        .about-page {
          min-height: 100vh;
        }

        /* Hero Section */
        .about-hero {
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #001f3f 0%, #0074D9 50%, #39CCCC 100%);
          color: white;
          padding: 4rem 1.5rem;
          text-align: center;
        }

        .about-hero-content h1 {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--color-primary);
          margin: 0 0 1rem 0;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
        }

        .hero-subtitle {
          font-family: var(--font-accent);
          font-size: 1.5rem;
          font-style: italic;
          color: var(--color-cream);
        }

        /* Main Content */
        .about-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }

        .about-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 6rem;
        }

        .section-content h2 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .section-content p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--color-text-primary);
          margin-bottom: 1.5rem;
        }

        .image-placeholder {
          background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light));
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          color: white;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .image-placeholder p {
          margin-top: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* Values Section */
        .values-section {
          margin-bottom: 6rem;
        }

        .values-section h2 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-primary);
          text-align: center;
          margin-bottom: 3rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .value-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .value-card h3 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          color: var(--color-secondary);
          margin-bottom: 1rem;
          text-align: center;
        }

        .value-card p {
          color: var(--color-text-light);
          line-height: 1.6;
          text-align: center;
        }

        /* Commitment Section */
        .commitment-section {
          background: var(--color-bg-paper);
          padding: 4rem 2rem;
          border-radius: 16px;
          margin-bottom: 4rem;
        }

        .commitment-content h2 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-primary);
          text-align: center;
          margin-bottom: 3rem;
        }

        .commitment-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .commitment-item {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .commitment-number {
          font-size: 3rem;
          font-weight: 800;
          color: var(--color-primary);
          opacity: 0.3;
          line-height: 1;
        }

        .commitment-item h3 {
          font-size: 1.5rem;
          color: var(--color-secondary);
          margin-bottom: 0.5rem;
        }

        .commitment-item p {
          color: var(--color-text-light);
          line-height: 1.6;
        }

        /* CTA Section */
        .about-cta {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, rgba(0, 116, 217, 0.1), rgba(57, 204, 204, 0.1));
          border-radius: 16px;
        }

        .about-cta h2 {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .about-cta p {
          font-size: 1.25rem;
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .about-hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.25rem;
          }

          .about-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .section-content h2,
          .values-section h2,
          .commitment-content h2,
          .about-cta h2 {
            font-size: 2rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .commitment-item {
            flex-direction: column;
            gap: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-buttons .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;

