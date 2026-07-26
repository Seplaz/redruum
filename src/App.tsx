import { Suspense, lazy, useEffect, useState } from "react";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import Background from "./components/Background/Background";

const AnalyticsLoader = lazy(async () => {
  const [{ Analytics }, { SpeedInsights }] = await Promise.all([
    import("@vercel/analytics/react"),
    import("@vercel/speed-insights/react"),
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setShowAnalytics(true));
      return () => window.cancelIdleCallback(id);
    }

    const t = setTimeout(() => setShowAnalytics(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.app}>
      <Background />
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
