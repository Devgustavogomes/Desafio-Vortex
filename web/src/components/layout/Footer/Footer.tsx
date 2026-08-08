import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src="/icon.png" alt="Unifor Connect Logo" className={styles.logo} />
          <span>Unifor Connect</span>
        </div>
        <div className={styles.links}>
          <a href="#about">Sobre o Projeto</a>
          <a href="#terms">Termos de Uso</a>
          <a href="#privacy">Privacidade</a>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Unifor Connect. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
