import React from 'react';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import Typist from 'react-typist';
import './styles.css';

const Intro = ({ id }) => {
  return (
    <section id={id} className="intro-section">
      <div className="container">
        <div className="intro-content">
          <Typist 
            avgTypingDelay={10} 
            cursor={{ hideWhenDone: true, show: false }}
            className="intro-typist"
          >
            <h1 className="intro-title">
              Hi, I'm <span className="highlight">Your Name</span>
            </h1>
            <Typist.Delay ms={500} />
            <h2 className="intro-subtitle">
              Full Stack Developer
            </h2>
          </Typist>
          
          <p className="intro-description">
            I build exceptional digital experiences with modern technologies.
            Passionate about creating elegant solutions to complex problems.
          </p>
          
          <div className="cta-buttons">
            <Link 
              to="projects" 
              smooth={true} 
              duration={500} 
              className="btn btn-primary"
            >
              View My Work
            </Link>
            <a 
              href="#" 
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault();
                window.open('/resume.pdf', '_blank');
              }}
            >
              Download CV
            </a>
          </div>
          
          <div className="social-links">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub className="social-icon" />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="mailto:your.email@example.com" aria-label="Email">
              <FaEnvelope className="social-icon" />
            </a>
          </div>
          
          <div className="scroll-down">
            <Link to="projects" smooth={true} duration={500}>
              <span>Scroll Down</span>
              <FaArrowDown className="bounce" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
