import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Button } from "../../ui/Button/Button";
import { useAuth } from "../../../hooks/useAuth";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className={`${styles.header} glass`}>
      <Link to="/" className={styles.logoContainer} onClick={closeMenu}>
        <img src="/icon.png" alt="UNIFOR Circular" className={styles.logo} />
        <h1>UNIFOR Circular</h1>
      </Link>
      
      <button 
        className={styles.mobileMenuButton} 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <nav className={`${styles.navigation} ${isMobileMenuOpen ? styles.open : ''}`}>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/feed" onClick={closeMenu}>Marketplace</Link>
          </li>
          <li>
            <a href="/#sobre" onClick={closeMenu}>Como Funciona</a>
          </li>
          <li>
            <a href="/#vitrine" onClick={closeMenu}>Vitrine</a>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/my-items" onClick={closeMenu}>Meus Itens</Link>
            </li>
          )}
        </ul>
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>Olá, {user?.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginLink} onClick={closeMenu}>
                Entrar
              </Link>
              <Link to="/register" tabIndex={-1} onClick={closeMenu}>
                <Button variant="primary">Cadastre-se</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
