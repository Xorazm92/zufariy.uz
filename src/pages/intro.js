import React from 'react';
import { useTranslation } from 'react-i18next';
import Links from "../components/links";
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import ThreeHero from '../components/ThreeHero';
import "./intro.css";

// Komponent funksional ko'rinishga o'tkazildi va props qabul qiladi
const Intro = ({ id }) => {
  const { t } = useTranslation();
  return (
    <div id={id} className="intro">
      <div className="intro-grid container">
        <motion.div
          className="three-hero-wrap glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <ThreeHero />
        </motion.div>

        <motion.div
          className="intro-copy glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="animation-box">
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
              className="type-animation"
              cursor={true}
              repeat={0}
            />
          </div>
          <Links />
        </motion.div>
      </div>
    </div>
  );
};

export default Intro;
