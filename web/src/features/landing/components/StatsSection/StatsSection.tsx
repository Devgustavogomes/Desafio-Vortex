import styles from './StatsSection.module.css';
import { StatBadge } from '../../../../components/ui/StatBadge/StatBadge';

export const StatsSection = () => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>O Impacto da Nossa Rede</h2>
          <p className={styles.subtitle}>Números que mostram a força da colaboração entre os estudantes.</p>
          
          <div className={styles.statsGrid}>
            <StatBadge label="Itens Disponíveis" value="+1000" />
            <StatBadge label="Alunos Conectados" value="500+" />
            <StatBadge label="Reais Economizados" value="R$ 15k" />
            <StatBadge label="Doações Realizadas" value="250" />
          </div>
        </div>
      </div>
    </section>
  );
};
