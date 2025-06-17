import React from "react";
import { TypeAnimation } from "react-type-animation";
import Links from "../components/links";

import "./styles.css";

// Komponent funksional ko'rinishga o'tkazildi va props qabul qiladi
const Intro = ({ id }) => {
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
          sequence={[
            "Salom, mening ismim Zufarbek Bobojonov Karimberganovich.",
            1500,
            "Men Full Stack (NodeJS+ReactJS) dasturchiman.",
            1500,
            "Mening veb-saytimga xush kelibsiz!",
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
