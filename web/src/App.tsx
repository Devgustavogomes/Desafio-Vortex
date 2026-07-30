import { useEffect } from 'react';
import styles from './App.module.css';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { LandingPage } from './features/landing/LandingPage';

function App() {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o prompt padrão de aparecer imediatamente
      e.preventDefault();
      console.log('App está pronto para ser instalado (PWA). Evento salvo.', e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className={styles.appContainer}>
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
