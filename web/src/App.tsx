import { useEffect } from 'react';
import styles from './App.module.css';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { AppRouter } from './routes/AppRouter';

function App() {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      
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
      <AppRouter />
      <Footer />
    </div>
  );
}

export default App;
