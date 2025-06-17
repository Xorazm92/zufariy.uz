import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Links from "../components/links";
import { TypeAnimation } from 'react-type-animation';
import "./intro.css";

// Komponent funksional ko'rinishga o'tkazildi va props qabul qiladi
const Intro = ({ id }) => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('pages.home')}</title>
      </Helmet>
      <div id={id} className="intro">
      <div className="animation-box">
        <TypeAnimation
          // sequence propiga kalit qo'shish animatsiyani til o'zgarganda qayta ishga tushiradi
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
          repeat={0} // Animatsiya bir marta ishlaydi
        />
      </div>
      <Links />
      </div>
    </>
  );
};

export default Intro;
