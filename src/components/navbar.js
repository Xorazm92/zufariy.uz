import React from "react";
import { Link } from "react-scroll";
import profilePic from "../res/profile.jpg"; // Rasm import qilindi

import "./styles.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <a className="navbar-brand navName" href="#">
        <img
          src={profilePic} // Import qilingan o'zgaruvchi ishlatildi
          className="profile d-inline-block align-top"
          alt="Profile"
        />
      </a>
      <div className="collapse navbar-collapse" id="navbarText">
        {/* Bootstrap 4 dagi 'mr-auto' Bootstrap 5 da 'me-auto' ga o'zgargan */}
        <ul className="navbar-nav me-auto">
          <li className="nav-item active">
            <Link activeClass="active" className="nav-link" smooth spy to="intro">
              Zufarbek Bobojonov
            </Link>
          </li>
          <li className="nav-item">
            <Link activeClass="active" className="nav-link" smooth spy to="work">
              Work
            </Link>
          </li>
          <li className="nav-item">
            <Link
              activeClass="active"
              className="nav-link"
              smooth
              spy
              to="projects"
            >
              Projects
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
