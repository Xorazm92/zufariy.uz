import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import './styles.css';

// Project data
const projects = [
  {
    id: 1,
    title: 'VSCode XML',
    description: 'Provides comprehensive XML language support for Visual Studio Code with validation, formatting, and IntelliSense features.',
    tags: ['VS Code', 'TypeScript', 'XML'],
    image: '/images/projects/vscodexml.png',
    github: 'https://github.com/redhat-developer/vscode-xml',
    demo: 'https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml',
    featured: true
  },
  {
    id: 2,
    title: 'Achievement Hub',
    description: 'A platform for tracking and showcasing personal achievements and skills with gamification elements.',
    tags: ['React', 'Node.js', 'MongoDB'],
    image: '/images/projects/achievementhub.png',
    github: '#',
    demo: '#',
    featured: true
  },
  {
    id: 3,
    title: 'Arctic Miners',
    description: 'A blockchain-based mining simulation game with real-time strategy elements.',
    tags: ['Blockchain', 'Web3', 'React'],
    image: '/images/projects/arcticminers.jpg',
    github: '#',
    demo: '#',
    featured: true
  },
  {
    id: 4,
    title: 'Bell Smart City',
    description: 'IoT platform for smart city management and monitoring.',
    tags: ['IoT', 'React', 'Python', 'Django'],
    image: '/images/projects/bellsmartcity.png',
    github: '#',
    demo: '#',
    featured: false
  },
  {
    id: 5,
    title: 'Pixel Pencil',
    description: 'A lightweight JavaScript library for creating pixel art in the browser.',
    tags: ['JavaScript', 'HTML5 Canvas'],
    image: '/images/projects/pixelpenciljs.jpg',
    github: '#',
    demo: '#',
    featured: false
  },
  {
    id: 6,
    title: 'SafeBet',
    description: 'A decentralized betting platform with smart contracts.',
    tags: ['Ethereum', 'Solidity', 'React'],
    image: '/images/projects/safebet.jpg',
    github: '#',
    demo: '#',
    featured: true
  },
  {
    id: 7,
    title: 'VSCode Quarkus',
    description: 'Provides support for application development using Quarkus Tools.',
    tags: ['VS Code', 'TypeScript', 'Quarkus'],
    image: '/images/projects/vscodequarkus.png',
    github: 'https://github.com/redhat-developer/vscode-quarkus',
    demo: 'https://marketplace.visualstudio.com/items?itemName=redhat.vscode-quarkus',
    featured: true
  },
  {
    id: 8,
    title: 'VSCode MicroProfile',
    description: 'Provides support for the development of MicroProfile-based applications.',
    tags: ['VS Code', 'TypeScript', 'MicroProfile'],
    image: '/images/projects/vscodemicroprofile.png',
    github: 'https://github.com/redhat-developer/vscode-microprofile',
    demo: 'https://marketplace.visualstudio.com/items?itemName=redhat.vscode-microprofile',
    featured: true
  },
  {
    id: 9,
    title: 'VSCode Java',
    description: 'Provides Java language support via Eclipse JDT Language Server',
    tags: ['VS Code', 'TypeScript', 'Java'],
    image: '/images/projects/vscodejava.png',
    github: 'https://github.com/redhat-developer/vscode-java',
    demo: 'https://marketplace.visualstudio.com/items?itemName=redhat.java',
    featured: true
  },
  {
    id: 10,
    title: 'Robo-Dropper',
    description: 'A custom built Arduino board programmed with C++ to automate an application relevant to education.',
    tags: ['Arduino', 'C++', 'Hardware'],
    image: '/images/projects/robodropper.jpg',
    github: '#',
    demo: 'https://www.artsci.utoronto.ca/news/hackathon-science-education-hacking-better-world',
    featured: false
  },
  {
    id: 11,
    title: 'Twilio CPaaS Solutions',
    description: 'Prototyped SMS Chatbot and Survey using Twilio provided phone number for direct user communication.',
    tags: ['Twilio', 'Node.js', 'SMS'],
    image: '/images/projects/twiliochatbot.png',
    github: '#',
    demo: 'https://www.twilio.com/bots',
    featured: false
  },
  {
    id: 12,
    title: 'Desperado',
    description: 'An Android game made with Java and XML featuring a SQL backend for user tracking and data.',
    tags: ['Android', 'Java', 'SQL'],
    image: '/images/projects/desperado.png',
    github: 'https://github.com/faarisali/desperado-android',
    demo: '#',
    featured: false
  }
];

const Projects = ({ id }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedProjects = showAll ? projects : projects.filter(project => project.featured);

  return (
    <section id={id} className="projects-section">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {displayedProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} className="project-img" />
                <div className="project-overlay">
                  <div className="project-links">
                    {project.demo !== '#' && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label={`View ${project.title} demo`}
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                    {project.github !== '#' && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                        aria-label="View on GitHub"
                      >
                        <FaGithub />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showAll && projects.length > 6 && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary"
              onClick={() => setShowAll(true)}
            >
              View All Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
