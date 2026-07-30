import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src="/icon.png" alt="UNIFOR Circular Logo" className={styles.logo} />
          <span>UNIFOR Circular</span>
        </div>
        <div className={styles.links}>
          <a href="#about">Sobre o Projeto</a>
          <a href="#terms">Termos de Uso</a>
          <a href="#privacy">Privacidade</a>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} UNIFOR Circular. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
