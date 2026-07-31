import { Link } from 'react-router-dom';
import styles from './CtaSection.module.css';
import { Button } from '../../../../components/ui/Button/Button';
import { useAuth } from '../../../../hooks/useAuth';

export const CtaSection = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Faça parte dessa mudança</h2>
          <p className={styles.subtitle}>
            Junte-se a centenas de estudantes e comece a economizar enquanto ajuda o meio ambiente hoje mesmo.
          </p>
          <div className={styles.actionGroup}>
            {!isAuthenticated ? (
              <Link to="/register" tabIndex={-1}>
                <Button variant="primary" className={styles.buttonMain}>
                  Criar Conta Gratuita
                </Button>
              </Link>
            ) : (
              <Link to="/dashboard" tabIndex={-1}>
                <Button variant="primary" className={styles.buttonMain}>
                  Acessar Plataforma
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
