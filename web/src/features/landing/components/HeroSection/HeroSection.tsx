import styles from './HeroSection.module.css';
import { Button } from '../../../../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Reinvente o ciclo de vida dos seus <span className={styles.highlight}>materiais acadêmicos</span>
        </h1>
        <p className={styles.subtitle}>
          Economia circular na Unifor. Doe, troque ou compre livros e equipamentos de outros estudantes. Menos desperdício, mais economia.
        </p>
        <div className={styles.ctaGroup}>
          <Button variant="primary" onClick={() => navigate('/feed')}>Descubra Itens</Button>
          <Button variant="outline" onClick={() => navigate('/my-items')}>Anuncie Agora</Button>
        </div>
      </div>
    </section>
  );
};
