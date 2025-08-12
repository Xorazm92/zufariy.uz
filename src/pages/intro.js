import React from 'react';
import { useTranslation } from 'react-i18next';
import Links from "../components/links";
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import "./intro.css";

// Komponent funksional ko'rinishga o'tkazildi va props qabul qiladi
const Intro = ({ id }) => {
  const { t } = useTranslation();
  return (
    <div id={id} className="intro">
      <div className="intro-grid container">
        <motion.div
          className="hero-visual clean-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Subtle Background */}
          <div className="hero-background">
            <div className="bg-subtle"></div>
          </div>

          <div className="hero-content">
            {/* Profile Section */}
            <header className="profile-section" role="banner">
              <div className="profile-avatar-container">
                <div className="profile-avatar" aria-label="Zufarbek Bobojonov avatar">
                  <span className="avatar-text" aria-hidden="true">ZB</span>
                </div>
              </div>

              <div className="profile-info">
                <h1 className="profile-name">
                  Zufarbek Bobojonov
                </h1>
                <p className="profile-title">
                  Full Stack Developer & Software Engineer
                </p>
                <p className="profile-location">
                  <span aria-label="Location">📍</span> Toshkent, O'zbekiston
                </p>
              </div>
            </header>

            {/* Core Skills - Simplified */}
            <section className="skills-section" aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="section-title">Core Technologies</h2>
              <div className="skills-compact">
                <span className="skill-tag">Python</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">React</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">TypeScript</span>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Welcome Section */}
        <motion.section
          className="welcome-section glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-labelledby="welcome-heading"
        >
          <div className="welcome-content">
            <motion.div
              className="greeting-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TypeAnimation
                key={t('intro.greeting')}
                sequence={[
                  t('intro.greeting'),
                  1500,
                  t('intro.role'),
                  1500,
                  t('intro.welcome'),
                  2000,
                ]}
                wrapper="h2"
                speed={50}
                className="welcome-text"
                cursor={true}
                repeat={0}
                aria-live="polite"
              />
            </motion.div>

            <motion.div
              className="intro-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="description-text">
                {t('intro.description', 'Men zamonaviy web texnologiyalar bilan ishlashni yaxshi ko\'raman va har doim yangi narsalarni o\'rganishga tayyor. Mening maqsadim - foydalanuvchilar uchun qulay va samarali dasturiy ta\'minot yaratish.')}
              </p>
            </motion.div>

            <motion.div
              className="cta-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="cta-buttons">
                <a
                  href="#contact"
                  className="btn btn-primary"
                  aria-label="Bog'lanish bo'limi"
                >
                  <span>📧</span>
                  {t('intro.contact', 'Bog\'lanish')}
                </a>
                <a
                  href="#projects"
                  className="btn btn-secondary"
                  aria-label="Loyihalar bo'limi"
                >
                  <span>💼</span>
                  {t('intro.projects', 'Loyihalar')}
                </a>
              </div>
            </motion.div>

            <motion.div
              className="social-links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Links />
            </motion.div>
          </div>
        </motion.section>


      </div>
    </div>
  );
};

export default Intro;
