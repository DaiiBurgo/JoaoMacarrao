/**
 * Página Sobre - João Macarrão
 * História e valores do restaurante
 */
import React from 'react';
import { useState } from 'react';

const MenuPage: React.FC = () => {

  //Toggle Cards
  const [isActive0, setIsActive0] = useState(false);
  const toggleSection0 = event => { setIsActive0(current => !current) };

  const [isActive1, setIsActive1] = useState(false);
  const toggleSection1 = event => { setIsActive1(current => !current) };

  const [isActive2, setIsActive2] = useState(false);
  const toggleSection2 = event => { setIsActive2(current => !current) };

  const [isActive3, setIsActive3] = useState(false);
  const toggleSection3 = event => { setIsActive3(current => !current) };

  const [isActive4, setIsActive4] = useState(false);
  const toggleSection4 = event => { setIsActive4(current => !current) };

  const [isActive5, setIsActive5] = useState(false);
  const toggleSection5 = event => { setIsActive5(current => !current) };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Cardápio</h1>
          <p className="hero-subtitle">
            Explore nossos pratos deliciosos
          </p>
        </div>
      </section>


      {/* 0 - Entradas */}
      <section className={isActive0 ? 'menu-section active' : 'menu-section'}>
        <div className="section-header" onClick={toggleSection0}>
          <div className="section-title">🍽️ Entradas</div>
        </div>

        <div className="section-content">
          {/* GRID 1 DAS ENTRADAS */}
          <div className="menu-grid">
            <div className="card">
              <img src="assets/menu/entradinhadojoao.png" alt="Entradinha do João"></img>
              <div className="card-content">
                <h3>Entradinha do João</h3>
                <p>Canapés de focaccia nos sabores: Antepasto de berinjela, Tomate confit e Molho pesto finalizado com parmesão.</p>
                <div className="price">R$ 14,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/burrata.png" alt="Burrata"></img>
              <div className="card-content">
                <h3>Burrata</h3>
                <p>Burrata acompanhada de molho pesto, toate e confit e focaccia.</p>
                <div className="price">R$ 49,99</div>
              </div>
            </div>


            <div className="card">
              <img src="assets/menu/polentafrita.png" alt="Polenta Frita"></img>
              <div className="card-content">
                <h3>Polenta Frita</h3>
                <p>Polenta frita com parmesão ralado.</p>
                <div className="price">R$ 30,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/batatasfritas.png" alt="Batatas Fritas"></img>
              <div className="card-content">
                <h3>Fritas</h3>
                <p>Batatas Fritas, sequinhas e crocantes.</p>
                <div className="price">R$ 25,99</div>
              </div>
            </div>
          </div>

          {/* GRID 2 DAS ENTRADAS */}
          <div className="menu-grid">
            <div className="card">
              <img src="assets/menu/fritascatupiry.png" alt="Fritas com catupiry e bacon"></img>
              <div className="card-content">
                <h3>Fritas com catupiry e bacon</h3>
                <p>Batatas fritas bem crocantes, catupiry e bits de bacon da casa</p>
                <div className="price">R$ 34,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/nuggets.png" alt="Nuggets"></img>
              <div className="card-content">
                <h3>Nuggets</h3>
                <p>Nuggets de frango sequinhos e saborosos 12 unidades.</p>
                <div className="price">R$ 30,99</div>
              </div>
            </div>


            <div className="card">
              <img src="assets/menu/torresmofrito.png" alt="Torresmo Frito"></img>
              <div className="card-content">
                <h3>Torresmo Frito</h3>
                <p>Torresmos fritos, sequinhos e crocantes.</p>
                <div className="price">R$ 49,99</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRATOS PRINCIPAIS */}
      {/* 1 - Pasta Fresca*/}
      <section className={isActive1 ? 'menu-section active' : 'menu-section'}>
        <div className="section-header" onClick={toggleSection1}>
          <div className="section-title">🍲 Pasta Fresca - Espaguete, Talharim ou Macarroni</div>
        </div>

        <div className="section-content">
          <div className="menu-grid">

            <div className="card">
              <img src="assets/menu/mmolho.png" alt="Macarrão ao molho"></img>
              <div className="card-content">
                <h3>Ao molho</h3>
                <p>Molho de tomate caseiro.</p>
                <div className="price">R$ 33,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mmolhobranco.png" alt="Macarrão ao molho branco"></img>
              <div className="card-content">
                <h3>Molho branco</h3>
                <p>Molho branco caseiro.</p>
                <div className="price">R$ 33,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mcarretiera.png" alt="Macarrão a carretiera"></img>
              <div className="card-content">
                <h3>A carretiera</h3>
                <p>Alho, azeite, pimenta dedo de moça, salsinha e raspas de limão.</p>
                <div className="price">R$ 35,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mquattroformaggi.png" alt="Macarrão quatro formaggi"></img>
              <div className="card-content">
                <h3>Quattro Formaggi</h3>
                <p>Molho branco caseiro.</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/msiciliana.png" alt="Macarrão siciliana"></img>
              <div className="card-content">
                <h3>Siciliana</h3>
                <p>Azeitonas pretas, alcaparras, aliche e pimenta dedo de moça.</p>
                <div className="price">R$ 39,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mputanesca.png" alt="Macarrão Putanesca"></img>
              <div className="card-content">
                <h3>Putanesca</h3>
                <p>Molho de tomate caseiro, azeitonas pretas, alcaparras, aliche e pimenta dedo de moça.</p>
                <div className="price">R$ 39,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mcenere.png" alt="Macarrão Cenere"></img>
              <div className="card-content">
                <h3>Cenere</h3>
                <p>Molho de gorgonzola e azeitonas pretas.</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mpesto.png" alt="Macarrão a Pesto"></img>
              <div className="card-content">
                <h3>Pesto</h3>
                <p>Molho de pesto de espinafre e manjericão.</p>
                <div className="price">R$ 41,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mcurry.png" alt="Macarrão Curry"></img>
              <div className="card-content">
                <h3>Curry</h3>
                <p>Molho curry da casa, gergelim e cebolinha para finalizar.</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/mcarbonara.png" alt="Macarrão Carbonara"></img>
              <div className="card-content">
                <h3>Carbonara (consultar disponibilidade)</h3>
                <p>Molho feito com ovos, parmesão e bacon.</p>
                <div className="price">R$ 54,99</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2 - Nhoque */}
      <section className={isActive2 ? 'menu-section active' : 'menu-section'}>
        <div className="section-header" onClick={toggleSection2}>
          <div className="section-title">🍝 Nhoque - Tradicional, vegano, e sem gluten</div>
        </div>

        <div className="section-content">
          <div className="menu-grid">

            <div className="card">
              <img src="assets/menu/nmolho.png" alt="Nhoque ao molho"></img>
              <div className="card-content">
                <h3>Ao molho</h3>
                <p>Molho de tomate caseiro.</p>
                <div className="price">R$ 35,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/nmolhobranco.png" alt="Nhoque ao molho branco"></img>
              <div className="card-content">
                <h3>Molho branco</h3>
                <p>Molho branco caseiro.</p>
                <div className="price">R$ 35,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ncarretiera.png" alt="Nhoque a carretiera"></img>
              <div className="card-content">
                <h3>A carretiera</h3>
                <p>Alho, azeite, pimenta dedo de moça, salsinha e raspas de limão.</p>
                <div className="price">R$ 37,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/nquattroformagi.png" alt="Nhoque quatro formaggi"></img>
              <div className="card-content">
                <h3>Quattro Formaggi</h3>
                <p>Molho branco caseiro.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/nsiciliana.png" alt="Nhoque siciliana"></img>
              <div className="card-content">
                <h3>Siciliana</h3>
                <p>Azeitonas pret as, alcaparras, aliche e pimenta dedo de moça.</p>
                <div className="price">R$ 41,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/nputanesca.png" alt="Nhoque Putanesca"></img>
              <div className="card-content">
                <h3>Putanesca</h3>
                <p>Molho de tomate caseiro, azeitonas pretas, alcaparras, aliche e pimenta dedo de moça.</p>
                <div className="price">R$ 41,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ncenere.png" alt="Nhoque Cenere"></img>
              <div className="card-content">
                <h3>Cenere</h3>
                <p>Molho de gorgonzola e azeitonas pretas.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/npesto.png" alt="Nhoque a Pesto"></img>
              <div className="card-content">
                <h3>Pesto</h3>
                <p>Molho de pesto de espinafre e manjericão.</p>
                <div className="price">R$ 43,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ncurry.png" alt="Nhoque Curry"></img>
              <div className="card-content">
                <h3>Curry</h3>
                <p>Molho curry da casa, gergelim e cebolinha para finalizar.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ncarbonara.png" alt="Nhoque Carbonara"></img>
              <div className="card-content">
                <h3>Carbonara (consultar disponibilidade)</h3>
                <p>Molho feito com ovos, parmesão e bacon.</p>
                <div className="price">R$ 56,99</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 - Canelone */}
      <section className={isActive3 ? 'menu-section active' : 'menu-section'}>
        <div className="section-header" onClick={toggleSection3}>
          <div className="section-title">🍝 Canelone</div>
        </div>

        <div className="section-content">
          <div className="menu-grid">

            <div className="card">
              <img src="assets/menu/cpresuntoequeijo.png" alt="Canelone Presunto e Queijo"></img>
              <div className="card-content">
                <h3>Presunto e Queijo</h3>
                <p>Massa fresca enrolada e recheada com presunto e queijo, ao molho artesanal de tomate e queijo ralado.</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ctomateseco.png" alt="Canelone Tomate Seco"></img>
              <div className="card-content">
                <h3>Tomate seco</h3>
                <p>Massa fresca enrolada e recheada com tomate seco, ricota e queijo, ao molho pesto e queijo ralado..</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/cragudecostela.png" alt="Canelone Ragú de Costela"></img>
              <div className="card-content">
                <h3>Ragú de Costela</h3>
                <p>Massa fresca enrolada e recheada com ragu de costela e queijo, ao molho artesanal de tomate e queijo ralado</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/clinguica.png" alt="Canelone Linguiça"></img>
              <div className="card-content">
                <h3>Linguiça</h3>
                <p>Massa fresca enrolada e recheada com linguiça e queijo, ao molho artesanal de tomate e queijo ralado</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ccogumelo.png" alt="Canelone cogumelo"></img>
              <div className="card-content">
                <h3>Mix de Cogumelos</h3>
                <p>Massa fresca enrolada e recheada com shimeji, cogumelo paris e portobello, queijo e catupiry, ao molho branco e queijo gratinado.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/cquattroformaggi.png" alt="Quattro formaggi"></img>
              <div className="card-content">
                <h3>Quattro formaggi</h3>
                <p>Massa fresca enrolada e recheada com queijo, ao molho artesanal de queijos muçarela, prato, gorgonzola e parmesão.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

          </div>
        </div>
      </section >

      {/* 4 - Panqueca */}
      <section className={isActive4 ? 'menu-section active' : 'menu-section'}>
        <div className="section-header" onClick={toggleSection4}>
          <div className="section-title">🥞 Panqueca</div>
        </div>

        <div className="section-content">
          <div className="menu-grid">

            <div className="card">
              <img src="assets/menu/pcarneequeijo.png" alt="Panqueca Carne e Queijo"></img>
              <div className="card-content">
                <h3>Carne e Queijo</h3>
                <p>Massa de panqueca recheada de carne e queijo, coberta por molho de tomate e queijo gratinado.</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/pfrangocatupiry.png" alt="Panqueca Frango com Catupiry"></img>
              <div className="card-content">
                <h3>Frango com Catupiry</h3>
                <p>Massa de panqueca recheada de frango e catupiry cremoso, coberta por molho de tomate e queijo gratinado</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ppresuntoequeijo.png" alt="Panqueca Presunto e Queijo"></img>
              <div className="card-content">
                <h3>Presunto e queijo</h3>
                <p>Massa de panqueca recheada de presunto e queijo, coberta por molho de tomate e queijo ralado.</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/pmixcogumelos.png" alt="Panqueca Mix de Cogumelos"></img>
              <div className="card-content">
                <h3>Mix de cogumelos</h3>
                <p>Massa fresca enrolada e recheada com linguiça e queijo, ao molho artesanal de tomate e queijo ralado</p>
                <div className="price">R$ 40,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/ccogumelo.png" alt="Canelone cogumelo"></img>
              <div className="card-content">
                <h3>Mix de Cogumelos</h3>
                <p>Massa fresca enrolada e recheada com shimeji, cogumelo paris e portobello, queijo e catupiry, ao molho branco e queijo gratinado.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/cquattroformaggi.png" alt="Quattro formaggi"></img>
              <div className="card-content">
                <h3>Quattro formaggi</h3>
                <p>Massa fresca enrolada e recheada com queijo, ao molho artesanal de queijos muçarela, prato, gorgonzola e parmesão.</p>
                <div className="price">R$ 42,99</div>
              </div>
            </div>

          </div>
        </div>
      </section >

      {/* 5 - Bebidas */}
      <section className={isActive5 ? 'menu-section active' : 'menu-section'}>
        <div className="section-header" onClick={toggleSection5}>
          <div className="section-title">🥤 Bebidas</div>
        </div>

        <div className="section-content">
          <div className="menu-grid">

            <div className="card">
              <img src="assets/menu/agua.png" alt="Agua"></img>
              <div className="card-content">
                <h3>Agua Mineral sem gás</h3>
                <div className="price">R$ 5,00</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/cocacola.png" alt="Coca-Cola"></img>
              <div className="card-content">
                <h3>Coca-Cola</h3>
                <div className="price">R$ 7,00</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/sprite.png" alt="Sprite"></img>
              <div className="card-content">
                <h3>Soda</h3>
                <div className="price">R$ 7,00</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/sucodelaranja.png" alt="sucodelaranja"></img>
              <div className="card-content">
                <h3>Suco Natural de Laranja</h3>
                <div className="price">R$ 10,00</div>
              </div>
            </div>

            <div className="card">
              <img src="assets/menu/heineken.png" alt="Heineken"></img>
              <div className="card-content">
                <h3>Heineken</h3>
                <div className="price">R$ 8,00</div>
              </div>
            </div>

          </div>
        </div>
      </section>


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

          margin-bottom: 5rem;
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

          .section-title {
            background-color:rgba(214, 182, 40, 0);
            color: white;
            padding: 1rem;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            padding: 2rem;
            max-width: 1200px;
            margin: auto;
          }

          .card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .card:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 12px rgba(0,0,0,0.2);
          }

          .card img {
            width: 100%;
            height: 400px;
            object-fit: cover;
          }

          .card-content {
            padding: 1rem;
            text-align: center;
          }

          .card-content h3 {
            margin: 0.5rem 0;
            color: #222;
          }

          .card-content p {
            font-size: 0.95rem;
            color: #555;
          }

          .price {
            margin-top: 0.8rem;
            font-weight: bold;
            color: #d62828;
            font-size: 1.1rem;
          }

          .card-content {
            display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              padding: 0.4rem 0.8rem; /* padding menor */
              min-height: 150px; /* ajusta altura mínima para padronizar */
          }

          .card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }


          .section-header {
            background-color:#d6b628; /* amarelo */
            color: #fff;
            font-weight: bold;
            justify-content: center;
            padding: 1rem 2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            border-radius: 12px;
            transition: background-color 0.3s;
          }

          .section-title {
           background-color:rgba(158, 158, 158, 0)
           font-size:2rem;
          }
          .section-header:hover {
            background-color: #c29a2e;
          }

          /* conteúdo inicialmente oculto */
          .section-content {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transform: translateY(-10px);
            transition: max-height 0.6s ease, opacity 0.4s ease, transform 0.4s ease;
          }
          
          .menu-section{
            padding: 0}
          .menu-section.active .section-content {
            max-height: 2000px; /* ajuste conforme necessário */
            opacity: 1;
            transform: translateY(0);
            margin-top: 1rem;
          }

      `}</style>
    </div>
  );
};

export default MenuPage;

