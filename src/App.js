import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';

import Intro from "./pages/intro";
import Projects from "./pages/projects";
import Work from "./pages/work";
import Stack from "./pages/stack";
import Navbar from "./components/navbar";

import "./App.css";



function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback="loading...">
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
  );
}

export default App;
