import styles from './Header.module.css';
import { Button } from '../../ui/Button/Button';

export function Header() {
  return (
    <header className={`${styles.header} glass`}>
      <div className={styles.logoContainer}>
        <img src="/icon.png" alt="UNIFOR Circular" className={styles.logo} />
        <h1>UNIFOR Circular</h1>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.navLinks}>
          <li><a href="#how-it-works">Como Funciona</a></li>
          <li><a href="#showcase">Vitrine</a></li>
        </ul>
        <Button variant="primary">Anunciar Item</Button>
      </nav>
    </header>
  );
}
