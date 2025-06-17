import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import "./projects.css";

// Loyiha rasmlari
const imageMap = {
  datagaze: require("../res/projects/datagaze.png"),
  crm: require("../res/projects/crm.png"),
  nasiya: require("../res/projects/nasiya.png"),
  quiz_app: require("../res/projects/quiz-app.png"),
  ngk_bot: require("../res/projects/ngk-bot.png"),
  quiz_bot: require("../res/projects/quiz-bot.png"),
};

const Projects = ({ id }) => {
  const { t } = useTranslation();
  const projectsList = t('projects.list', { returnObjects: true });

  return (
    <>
      <Helmet>
        <title>{t('pages.projects')}</title>
      </Helmet>
      <div id={id} className="projects-section container py-5">
      <h2 className="projects-title text-center mb-5">{t('projects.title')}</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {Array.isArray(projectsList) && projectsList.map((project, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm">
              <img src={imageMap[project.id]} className="card-img-top" alt={project.alt} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{project.title}</h5>
                <h6 className="title-tag text-muted">{project.tag}</h6>
                <p className="card-text">{project.description}</p>
                <div className="button-container mt-auto text-center">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-lg"
                    role="button"
                  >
                    {project.buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default Projects;
