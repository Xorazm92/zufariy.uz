import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Intro from "./pages/intro";
import Projects from "./pages/projects";
import Work from "./pages/work";
import Navbar from "./components/navbar";

import "./App.css";

// Barcha sahifalar uchun umumiy layout
const Layout = () => (
  <div>
    <Navbar />
    {/* Bu yerda har bir sahifaning o'zi render bo'ladi */}
    <Outlet /> 
  </div>
);

// Asosiy sahifa komponenti (barcha qismlarni o'z ichiga oladi)
const HomePage = () => (
  <>
    <Intro id="intro" />
    <Work id="work" />
    <Projects id="projects" />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Asosiy marshrut (/) uchun HomePage komponentini ko'rsatish */}
          <Route index element={<HomePage />} />
          {/* Kelajakda boshqa sahifalar qo'shish mumkin, masalan:
          <Route path="contact" element={<ContactPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
