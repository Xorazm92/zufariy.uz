import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Intro from './pages/intro';
import Projects from './pages/projects';
import Stack from './pages/stack';
import Work from './pages/work';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Intro id="home" />
          <Projects id="projects" />
          <Work id="experience" />
          <Stack id="skills" />
        </main>
      </div>
    </Router>
  );
}

export default App;
