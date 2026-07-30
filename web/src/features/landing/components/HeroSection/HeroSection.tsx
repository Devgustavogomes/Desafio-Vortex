import styles from './HeroSection.module.css';
import { Button } from '../../../../components/ui/Button/Button';

export const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Reinvente o ciclo de vida dos seus <span className={styles.highlight}>materiais acadêmicos</span>
        </h1>
        <p className={styles.subtitle}>
          Economia circular na UNIFOR. Doe, troque ou compre livros e equipamentos de outros estudantes. Menos desperdício, mais economia.
        </p>
        <div className={styles.ctaGroup}>
          <Button variant="primary">Descubra Itens</Button>
          <Button variant="outline">Anuncie Agora</Button>
        </div>
      </div>
    </section>
  );
};
