import React, { Suspense, useEffect, memo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import "./App.css";

// Lazy load components for better performance
const Navbar = React.lazy(() => import("./components/navbar"));
const Intro = React.lazy(() => import('./pages/intro'));
const Projects = React.lazy(() => import('./pages/projects'));
const Work = React.lazy(() => import('./pages/work'));
const Stack = React.lazy(() => import('./pages/stack'));
const Contact = React.lazy(() => import('./pages/contact'));
const Admin = React.lazy(() => import('./pages/admin'));
const NotFound = React.lazy(() => import('./pages/notfound'));

// Loading component
const LoadingSpinner = memo(() => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Yuklanmoqda...</p>
  </div>
));

// Memoized Meta component
const Meta = memo(() => {
  const location = useLocation();
  const { t } = useTranslation();
  const path = location.pathname;

  let title = t('pages.home');
  let description = t('pages.meta_description');

  if (path.startsWith('/projects')) {
    title = t('pages.projects');
    description = 'Zufarbek ning loyihalari va portfolio';
  } else if (path.startsWith('/work')) {
    title = t('pages.work');
    description = 'Zufarbek ning ish tajribasi va malakasi';
  } else if (path.startsWith('/stack')) {
    title = t('pages.stack');
    description = 'Zufarbek ishlatadigan texnologiyalar';
  } else if (path.startsWith('/contact')) {
    title = t('pages.contact');
    description = 'Zufarbek bilan bog\'lanish';
  }

  return (
    <Helmet>
      <title>{title} | Zufarbek Portfolio</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#667eea" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    </Helmet>
  );
});

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    // Performance optimization
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed
      });
    }
  }, [i18n.language]);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="app-shell">
              <Meta />
              <Suspense fallback={null}>
                <Navbar />
              </Suspense>
              <RouteTransitions />
            </div>
          </Suspense>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

// Memoized route transitions for better performance
const RouteTransitions = memo(() => {
  const location = useLocation();
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const pageAnim = React.useMemo(() => reducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 }
      }
    : {
        initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, filter: 'blur(6px)' }
      }, [reducedMotion]);

  const transition = React.useMemo(() =>
    reducedMotion ? { duration: 0.01 } : { duration: 0.35, ease: 'easeOut' },
    [reducedMotion]
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <Intro id="intro" />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <Projects id="projects" />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/work"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <Work id="work" />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/stack"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <Stack id="stack" />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/contact"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <Contact id="contact" />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/admin"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <Admin id="admin" />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
});

export default App;
