import styles from './CtaSection.module.css';
import { Button } from '../../../../components/ui/Button/Button';

export const CtaSection = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Faça parte dessa mudança</h2>
          <p className={styles.subtitle}>
            Junte-se a centenas de estudantes e comece a economizar enquanto ajuda o meio ambiente hoje mesmo.
          </p>
          <div className={styles.actionGroup}>
            <Button variant="primary" className={styles.buttonMain}>
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
