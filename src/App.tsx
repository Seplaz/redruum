import { Suspense, lazy, useEffect, useState } from 'react';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';

const AnalyticsLoader = lazy(async () => {
  const [{ Analytics }, { SpeedInsights }] = await Promise.all([
    import('@vercel/analytics/react'),
    import('@vercel/speed-insights/react'),
  ]);

  return {
    default: function AnalyticsBoundary() {
      return (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      );
    },
  };
});

const App = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    // Defer analytics and non-critical background image until the browser is idle
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      const idA = (window as any).requestIdleCallback(() =>
        setShowAnalytics(true),
      );
      const idB = (window as any).requestIdleCallback(() => setShowBg(true));
      return () => {
        (window as any).cancelIdleCallback(idA);
        (window as any).cancelIdleCallback(idB);
      };
    }

    const tA = setTimeout(() => setShowAnalytics(true), 3000);
    const tB = setTimeout(() => setShowBg(true), 1000);
    return () => {
      clearTimeout(tA);
      clearTimeout(tB);
    };
  }, []);

  return (
    <div className={`${styles.app} ${showBg ? styles.hasBg : ''}`}>
      <Header />
      <Content />
      <Footer />
      {showAnalytics && (
        <Suspense fallback={null}>
          <AnalyticsLoader />
        </Suspense>
      )}
    </div>
  );
};

export default App;
