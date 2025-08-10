import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import BackgroundCanvas from './components/BackgroundCanvas';

import Navbar from "./components/navbar";
import "./App.css";

const Intro = React.lazy(() => import('./pages/intro'));
const Projects = React.lazy(() => import('./pages/projects'));
const Work = React.lazy(() => import('./pages/work'));
const Stack = React.lazy(() => import('./pages/stack'));
const Contact = React.lazy(() => import('./pages/contact'));
const Admin = React.lazy(() => import('./pages/admin'));
const NotFound = React.lazy(() => import('./pages/notfound'));

function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const Meta = () => {
    const location = useLocation();
    const path = location.pathname;
    let title = t('pages.home');
    if (path.startsWith('/projects')) title = t('pages.projects');
    else if (path.startsWith('/work')) title = t('pages.work');
    else if (path.startsWith('/stack')) title = t('pages.stack');
    else if (path.startsWith('/contact')) title = t('pages.contact');
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t('pages.meta_description')} />
      </Helmet>
    );
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          }>
            <BackgroundCanvas />
            <div className="app-shell">
              <Meta />
              <Navbar />
              <RouteTransitions />
            </div>
          </Suspense>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function RouteTransitions() {
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

  const pageAnim = reducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 }
      }
    : {
        initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -12, filter: 'blur(6px)' }
      };
  const transition = reducedMotion ? { duration: 0.01 } : { duration: 0.35, ease: 'easeOut' };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Intro id="intro" />
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Projects id="projects" />
            </motion.div>
          }
        />
        <Route
          path="/work"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Work id="work" />
            </motion.div>
          }
        />
        <Route
          path="/stack"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Stack id="stack" />
            </motion.div>
          }
        />
        <Route
          path="/contact"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Contact id="contact" />
            </motion.div>
          }
        />
        <Route
          path="/admin"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <Admin id="admin" />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div {...pageAnim} transition={transition}>
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
