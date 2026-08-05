import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { Button } from '../../ui/Button/Button';
import { useAuth } from '../../../hooks/useAuth';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`${styles.header} glass`}>
      <Link to="/" className={styles.logoContainer}>
        <img src="/icon.png" alt="UNIFOR Circular" className={styles.logo} />
        <h1>UNIFOR Circular</h1>
      </Link>
      <nav className={styles.navigation}>
        <ul className={styles.navLinks}>
          <li><a href="/#how-it-works">Como Funciona</a></li>
          <li><a href="/#showcase">Vitrine</a></li>
          {isAuthenticated && (
            <li><Link to="/my-items">Meus Itens</Link></li>
          )}
        </ul>
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>Olá, {user?.name}</span>
              <Button variant="secondary" onClick={handleLogout}>Sair</Button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginLink}>Entrar</Link>
              <Link to="/register" tabIndex={-1}>
                <Button variant="primary">Cadastre-se</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
