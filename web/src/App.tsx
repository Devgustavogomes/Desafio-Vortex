

function App() {
  return (
    <div className="app-container">
      <header className="header glass">
        <div className="logo-container">
          <img src="/icon.png" alt="UNIFOR Circular" className="logo" />
          <h1>UNIFOR Circular</h1>
        </div>
        <nav>
          <button className="btn-primary hover-scale">Anunciar Item</button>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="hero-section">
          <h2>Economia Circular no Campus</h2>
          <p>Dê uma nova vida aos seus materiais estudantis e acadêmicos. Sustentabilidade e economia para todos.</p>
          <div className="stats-container">
            <div className="stat-card">
              <h3>+500</h3>
              <p>Itens Doados</p>
            </div>
            <div className="stat-card">
              <h3>1.2k</h3>
              <p>Alunos Conectados</p>
            </div>
          </div>
        </section>
        
        <section className="showcase-section">
          <h3>Últimos Itens</h3>
          <div className="items-grid">
            {/* Vitrine placeholder */}
            <div className="item-card glass">
              <div className="item-image-placeholder"></div>
              <h4>Livro de Cálculo 1</h4>
              <p>Estado: Novo</p>
              <button className="btn-secondary hover-scale">Ver Detalhes</button>
            </div>
            <div className="item-card glass">
              <div className="item-image-placeholder"></div>
              <h4>Calculadora Científica</h4>
              <p>Estado: Usado</p>
              <button className="btn-secondary hover-scale">Ver Detalhes</button>
            </div>
            <div className="item-card glass">
              <div className="item-image-placeholder"></div>
              <h4>Jaleco M</h4>
              <p>Estado: Usado</p>
              <button className="btn-secondary hover-scale">Ver Detalhes</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} UNIFOR Circular. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
