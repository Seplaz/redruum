import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import styles from "./App.module.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Background from "./components/Background/Background";
import Content from "./components/Content/Content";
import NotFound from "./components/NotFound/NotFound";

import defaultBackground from "./assets/images/background.webp";
import notFoundBackground from "./assets/images/404.webp";

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
  const location = useLocation();

  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setShowAnalytics(true));
      return () => window.cancelIdleCallback(id);
    }

    const timeout = setTimeout(() => setShowAnalytics(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const background =
    location.pathname === "/404" ? notFoundBackground : defaultBackground;

  return (
    <div className={styles.app}>
      <Background image={background} />

      <Header />

      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/messages/:id" element={<Content />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
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
