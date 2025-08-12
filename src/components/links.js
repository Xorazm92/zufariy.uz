import React from "react";
import { motion } from "framer-motion";
import "./styles.css";

const socialLinks = [
  {
    href: "mailto:zufar.bobojonov.dev@gmail.com",
    icon: "far fa-envelope",
    label: "Email",
    color: "#ea4335"
  },
  {
    href: "https://www.linkedin.com/in/zufar-bobojonov-6544a6251/",
    icon: "fab fa-linkedin",
    label: "LinkedIn",
    color: "#0077b5"
  },
  {
    href: "https://github.com/Xorazm92",
    icon: "fab fa-github",
    label: "GitHub",
    color: "#333"
  },
  {
    href: "https://t.me/Zufar_Xorazmiy",
    icon: "fab fa-telegram-plane",
    label: "Telegram",
    color: "#0088cc"
  },
  {
    href: "https://drive.google.com/file/d/1gsuX95WSjSeZ3Xdq9cBzT_2Lfzr6P-G_/view?usp=sharing",
    icon: "far fa-file-alt",
    label: "Resume",
    color: "#4285f4"
  }
];

const Links = () => {
  return (
    <div className="social-links-container">
      <motion.div
        className="social-links-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label={link.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.4 + index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              scale: 1.1,
              y: -4,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            style={{ '--hover-color': link.color }}
          >
            <div className="social-icon-wrapper">
              <i className={`${link.icon} social-icon`}></i>
              <span className="social-tooltip">{link.label}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default Links;
