import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import styles from './App.module.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Background from './components/Background/Background';
import Content from './components/Content/Content';
import NotFound from './components/NotFound/NotFound';

import mainMobile from './assets/images/background-main-mobile.webp';
import mainTablet from './assets/images/background-main-tablet.webp';
import mainDesktop from './assets/images/background-main-desktop.webp';

import notFoundMobile from './assets/images/background-404-mobile.webp';
import notFoundTablet from './assets/images/background-404-tablet.webp';
import notFoundDesktop from './assets/images/background-404-desktop.webp';

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

const backgrounds = {
  default: {
    mobile: mainMobile,
    tablet: mainTablet,
    desktop: mainDesktop,
  },
  notFound: {
    mobile: notFoundMobile,
    tablet: notFoundTablet,
    desktop: notFoundDesktop,
  },
};

const App = () => {
  const location = useLocation();

  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setShowAnalytics(true));
      return () => window.cancelIdleCallback(id);
    }

    const timeout = setTimeout(() => setShowAnalytics(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const background =
    location.pathname === '/404' ? backgrounds.notFound : backgrounds.default;

  return (
    <div className={styles.app}>
      <Background
        mobile={background.mobile}
        tablet={background.tablet}
        desktop={background.desktop}
      />

      <Header />

      <Routes>
        <Route path='/' element={<Content />} />
        <Route path='/messages/:id' element={<Content />} />
        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

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
