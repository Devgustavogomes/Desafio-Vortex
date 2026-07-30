import styles from './App.module.css';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { StatBadge } from './components/ui/StatBadge/StatBadge';
import { ItemCard } from './components/ui/ItemCard/ItemCard';

function App() {
  return (
    <div className={styles.appContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <section id="how-it-works" className={styles.heroSection}>
          <h2>Economia Circular no Campus</h2>
          <p>Dê uma nova vida aos seus materiais estudantis e acadêmicos. Sustentabilidade e economia para todos.</p>
          <div className={styles.statsContainer}>
            <StatBadge label="Itens Doados" value="+500" />
            <StatBadge label="Alunos Conectados" value="1.2k" />
          </div>
        </section>
        
        <section id="showcase" className={styles.showcaseSection}>
          <h3>Últimos Itens</h3>
          <div className={styles.itemsGrid}>
            <ItemCard 
              title="Livro de Cálculo 1"
              category="Livros"
              status="Novo"
            />
            <ItemCard 
              title="Calculadora Científica"
              category="Eletrônicos"
              status="Usado"
            />
            <ItemCard 
              title="Jaleco M"
              category="Vestuário"
              status="Usado"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
