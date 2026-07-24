import { Suspense, lazy } from 'react';
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
  return (
    <div className={styles.app}>
      <Header />
      <Content />
      <Footer />
      <Suspense fallback={null}>
        <AnalyticsLoader />
      </Suspense>
    </div>
  );
};

export default App;
