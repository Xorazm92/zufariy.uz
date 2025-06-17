import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Navbar from "./components/navbar";
import "./App.css";

const Intro = React.lazy(() => import('./pages/intro'));
const Projects = React.lazy(() => import('./pages/projects'));
const Work = React.lazy(() => import('./pages/work'));
const Stack = React.lazy(() => import('./pages/stack'));

function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback="loading...">
            <Helmet>
              <meta name="description" content={t('pages.meta_description')} />
            </Helmet>
            <Navbar />
            <Routes>
              <Route path="/" element={<Intro id="intro" />} />
              <Route path="/projects" element={<Projects id="projects" />} />
              <Route path="/work" element={<Work id="work" />} />
              <Route path="/stack" element={<Stack id="stack" />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
