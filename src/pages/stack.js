import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import SkillIcon from '../components/SkillIcon';
import './stack.css';

const Stack = ({ id }) => {
  const { t } = useTranslation();
  const stack = t('stack', { returnObjects: true });

  return (
    <>
      <Helmet>
        <title>{t('pages.stack')}</title>
      </Helmet>
      <div id={id} className="stack-section container">
        <h2 className="text-center mb-5">{stack.title}</h2>
        {stack.categories && stack.categories.map((category, index) => (
          <div className="stack-category" key={index}>
            <h4>{category.title}</h4>
            <div className="skills-grid">
              {category.skills.map((skill, skillIndex) => (
                <SkillIcon key={skillIndex} name={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Stack;