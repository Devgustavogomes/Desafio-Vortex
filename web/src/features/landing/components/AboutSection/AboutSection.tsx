import styles from './AboutSection.module.css';

export const AboutSection = () => {
  return (
    <section className={styles.aboutSection} id="sobre">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Como funciona o <span className={styles.highlight}>UNIFOR Circular</span></h2>
          <p className={styles.description}>
            O UNIFOR Circular é uma iniciativa criada por e para alunos da Universidade de Fortaleza. 
            Nosso objetivo é promover a sustentabilidade dentro do campus facilitando a doação, troca e venda de materiais acadêmicos que você não usa mais.
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>♻️</div>
              <h3 className={styles.featureTitle}>Sustentável</h3>
              <p className={styles.featureDesc}>Aumente a vida útil de livros, jalecos e equipamentos. Menos descarte no meio ambiente.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>🤝</div>
              <h3 className={styles.featureTitle}>Comunidade</h3>
              <p className={styles.featureDesc}>Conecte-se com alunos de outros semestres e cursos. Ajude quem está começando.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>💰</div>
              <h3 className={styles.featureTitle}>Econômico</h3>
              <p className={styles.featureDesc}>Adquira materiais essenciais para o seu curso com valores muito mais acessíveis ou até de graça.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
