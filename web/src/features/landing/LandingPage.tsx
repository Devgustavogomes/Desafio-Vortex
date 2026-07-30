import { HeroSection } from './components/HeroSection/HeroSection';
import { AboutSection } from './components/AboutSection/AboutSection';
import { StatsSection } from './components/StatsSection/StatsSection';
import { ShowcaseSection } from './components/ShowcaseSection/ShowcaseSection';
import { CtaSection } from './components/CtaSection/CtaSection';
import styles from './LandingPage.module.css';

export const LandingPage = () => {
  return (
    <main className={styles.landingPage}>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ShowcaseSection />
      <CtaSection />
    </main>
  );
};
