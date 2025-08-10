import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from '../res/profile.jpg';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { BsMoonStarsFill, BsSunFill, BsGlobe } from 'react-icons/bs';
import { ThemeContext } from '../context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setExpanded(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  const navItems = [
    { path: '/', label: t('navbar.intro'), end: true },
    { path: '/projects', label: t('navbar.projects') },
    { path: '/work', label: t('navbar.work') },
    { path: '/stack', label: t('navbar.stack') },
    { path: '/contact', label: t('navbar.contact') }
  ];

  const languages = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇺🇸' }
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <BootstrapNavbar
        expand="lg"
        fixed="top"
        className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}
        expanded={expanded}
        onToggle={setExpanded}
      >
        <div className="container-fluid">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BootstrapNavbar.Brand as={NavLink} to="/" onClick={() => setExpanded(false)}>
              <motion.img
                src={profilePic}
                width="35"
                height="35"
                className="d-inline-block align-top rounded-circle me-2 profile-image"
                alt="Profile"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <span className="brand-text">Zufarbek</span>
            </BootstrapNavbar.Brand>
          </motion.div>

          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <AnimatePresence>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Nav.Link
                      as={NavLink}
                      to={item.path}
                      end={item.end}
                      onClick={() => setExpanded(false)}
                      className="nav-link-custom"
                    >
                      {item.label}
                    </Nav.Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Nav>

            <Nav className="ms-auto d-flex align-items-center">
              <NavDropdown
                title={
                  <span className="dropdown-title">
                    <BsGlobe className="me-1" />
                    {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
                  </span>
                }
                id="language-dropdown"
                className="language-dropdown"
              >
                {languages.map((lang) => (
                  <NavDropdown.Item
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? 'active' : ''}
                  >
                    <span className="me-2">{lang.flag}</span>
                    {lang.label}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="link"
                  onClick={toggleTheme}
                  className="ms-2 theme-toggle-btn"
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'light' ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === 'light' ? <BsMoonStarsFill /> : <BsSunFill />}
                  </motion.div>
                </Button>
              </motion.div>
            </Nav>
          </BootstrapNavbar.Collapse>
        </div>
      </BootstrapNavbar>
    </motion.div>
  );
};

export default Navbar;
