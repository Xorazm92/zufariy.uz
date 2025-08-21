import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Links from "../components/links";
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import "./intro.css";

// Komponent funksional ko'rinishga o'tkazildi va props qabul qiladi
const Intro = ({ id }) => {
  const { t } = useTranslation();
  
  // GIF loading state
  const [gif1Loaded, setGif1Loaded] = useState(false);
  const [gif2Loaded, setGif2Loaded] = useState(false);
  
  // Start sequential animation when both GIFs are loaded
  useEffect(() => {
    if (gif1Loaded && gif2Loaded) {
      console.log('🎬 Starting sequential GIF animation!');
      
      const gif1 = document.querySelector('img[src*="original-08d4603fd7a32b99b6820064ef91b930.gif"]');
      const gif2 = document.querySelector('img[src*="original-679e9fe29722e4e58bca3e5a9c63900e.gif"]');
      
      if (gif1 && gif2) {
        // Set initial positions for full container coverage
        gif1.style.width = '100%';
        gif1.style.height = '100%';
        gif1.style.top = '0';
        gif1.style.left = '0';
        gif1.style.transform = 'none';
        gif1.style.opacity = '1';
        
        gif2.style.width = '100%';
        gif2.style.height = '100%';
        gif2.style.top = '0';
        gif2.style.left = '0';
        gif2.style.transform = 'none';
        gif2.style.opacity = '0';
        
        // Start animation
        let currentGif = 1;
        setInterval(() => {
          if (currentGif === 1) {
            gif1.style.opacity = '0';
            gif2.style.opacity = '1';
            currentGif = 2;
          } else {
            gif1.style.opacity = '1';
            gif2.style.opacity = '0';
            currentGif = 2;
          }
        }, 3000); // Switch every 3 seconds
      }
    }
  }, [gif1Loaded, gif2Loaded]);
  
  return (
    <div id={id} className="intro">
      <div className="intro-grid container">
        <motion.div
          className="hero-visual clean-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Subtle Background */}
          <div className="hero-background">
            <div className="bg-subtle"></div>
          </div>

          {/* GIF showcase stage */}
          <div className="gif-stage" aria-label="Visual animations">
            {/* First GIF - Full Container Size */}
            <img
              src="/assets/original-08d4603fd7a32b99b6820064ef91b930.gif"
              alt="Showcase animation 1"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: 999,
                opacity: 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
              onLoad={() => {
                console.log('✅ GIF 1 loaded successfully');
                console.log('📍 GIF 1 element:', document.querySelector('img[src*="original-08d4603fd7a32b99b6820064ef91b930.gif"]'));
                setGif1Loaded(true);
              }}
              onError={(e) => {
                console.error('❌ GIF 1 failed to load:', e);
                console.error('🔗 Error details:', e.target.src);
              }}
            />
            
            {/* Second GIF - Full Container Size */}
            <img
              src="/assets/original-679e9fe29722e4e58bca3e5a9c63900e.gif"
              alt="Showcase animation 2"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: 998,
                opacity: 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
              onLoad={() => {
                console.log('✅ GIF 2 loaded successfully');
                setGif2Loaded(true);
              }}
              onError={(e) => {
                console.error('❌ GIF 2 failed to load:', e);
              }}
            />
            
            {/* GIF indicator dots */}
            <div className="gif-indicator">
              <div className="indicator-dot dot-1"></div>
              <div className="indicator-dot dot-2"></div>
            </div>
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
                <Link
                  to="/contact"
                  className="btn btn-primary"
                  aria-label="Bog'lanish bo'limi"
                >
                  <span>📧</span>
                  {t('intro.contact', 'Bog\'lanish')}
                </Link>
                <Link
                  to="/projects"
                  className="btn btn-secondary"
                  aria-label="Loyihalar bo'limi"
                >
                  <span>💼</span>
                  {t('intro.projects', 'Loyihalar')}
                </Link>
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
