import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import profilePic from '../res/profile.jpg';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { ThemeContext } from '../context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css'; // styles.css o'rniga navbar.css

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <BootstrapNavbar expand="lg" fixed="top" className="navbar-custom" expanded={expanded} onToggle={setExpanded}>
      <div className="container-fluid">
        <BootstrapNavbar.Brand as={NavLink} to="/" onClick={() => setExpanded(false)}>
          <img
            src={profilePic}
            width="30"
            height="30"
            className="d-inline-block align-top rounded-circle me-2"
            alt="Profile"
          />
          Zufarbek
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onClick={() => setExpanded(false)}>
            <Nav.Link as={NavLink} to="/" end>{t('navbar.intro')}</Nav.Link>
            <Nav.Link as={NavLink} to="/projects">{t('navbar.projects')}</Nav.Link>
            <Nav.Link as={NavLink} to="/work">{t('navbar.work')}</Nav.Link>
            <Nav.Link as={NavLink} to="/stack">{t('navbar.stack')}</Nav.Link>
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            <NavDropdown title={t('language')} id="language-dropdown">
              <NavDropdown.Item onClick={() => changeLanguage('uz')}>O'zbek</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('ru')}>Русский</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
            </NavDropdown>
            <Button variant="link" onClick={toggleTheme} className="ms-2 theme-toggle-btn">
              {theme === 'light' ? <BsMoonStarsFill /> : <BsSunFill color="white" />}
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
