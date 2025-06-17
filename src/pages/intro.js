import React from 'react';
import { useTranslation } from 'react-i18next';
import Links from "../components/links";
import { TypeAnimation } from 'react-type-animation';
import "./intro.css";

// Komponent funksional ko'rinishga o'tkazildi va props qabul qiladi
const Intro = ({ id }) => {
  const { t } = useTranslation();
  return (
    // react-scroll ishlashi uchun id atributi qo'shildi
    <div id={id} className="intro">
      <div className="introText">
        {/*
          Eski `react-typist` kutubxonasi React 18 bilan mos kelmagani uchun
          `react-type-animation` ga almashtirildi. Bu kutubxona matnlarni
          ketma-ket, bir-birining o'rniga yozib ko'rsatadi.
        */}
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
          wrapper="p"
          speed={50}
          className="intro-p"
          cursor={true}
          repeat={0} // Animatsiya bir marta ishlaydi
        />
      </div>
      <Links />
    </div>
  );
};

export default Intro;
