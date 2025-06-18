import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import "./projects.css";

// Loyiha rasmlari
const imageMap = {
  datagaze: require("../res/projects/datagaze.png"),
  crm: require("../res/projects/crm.png"),
  nasiya: require("../res/projects/nasiya.png"),
  quiz_app: require("../res/projects/quiz-app.png"),
  ngk_bot: require("../res/projects/ngk-bot.png"),
  quiz_bot: require("../res/projects/quiz-bot.png"),
};

const Projects = ({ id }) => {
  const { t } = useTranslation();
  const projectsList = t('projects.list', { returnObjects: true });

  return (
    <>
      <Helmet>
        <title>{t('pages.projects')}</title>
      </Helmet>
      <div id={id} className="projects-section container py-5">
      <h2 className="projects-title text-center mb-5">{t('projects.title')}</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {Array.isArray(projectsList) && projectsList.map((project, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm">
              <img src={imageMap[project.id]} className="card-img-top" alt={project.alt} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{project.title}</h5>
                <h6 className="title-tag text-muted">{project.tag}</h6>
                <p className="card-text">{project.description}</p>
                <div className="button-container mt-auto text-center">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-lg"
                    role="button"
                  >
                    {project.buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default Projects;


// import React, { Component } from "react";
// import "./styles.css";

// // ----------------------------------------------------------------------------------
// // DIQQAT: O'zingizning loyiha rasmlarini shu yerga import qiling.
// // Rasmlarni `src/res/projects/` papkasiga joylashtirib, quyidagi kabi import qiling:

// import DataGazeImg from "../res/projects/datagaze.png";
// import CrmImg from "../res/projects/crm.png";
// import NasiyaImg from "../res/projects/nasiya.png"; // YANGI LOYIHA UCHUN
// import QuizAppImg from "../res/projects/quiz-app.png";
// import ShopImg from "../res/projects/shop.png";
// import NgkBotImg from "../res/projects/ngk-bot.png";
// import QuizBotImg from "../res/projects/quiz-bot.png";
// // ----------------------------------------------------------------------------------




// class Projects extends Component {
//   render() {
//     return (
//       <div className="projects">
//         <h2 className="projects-title">Mening Loyihalarim</h2>
//         <br />
//         <br />
//         <div class="projectCards container-fluid">
//           <div class="row flex-row flex-nowrap">
//             <div class="card-columns">

//               {/* DataGaze Loyihasi */}
//               <div class="card">
//                 <img class="card-img-top" src={DataGazeImg} alt="DataGaze loyihasi" />
//                 <div class="card-body">
//                   <h5 class="card-title">DataGaze</h5>
//                   <h7 className="title-tag">Ma'lumotlar Vizualizatsiyasi</h7>
//                   <p class="card-text">
//                     Ma'lumotlarni tahlil qilish va interaktiv grafiklar orqali vizualizatsiya qilish uchun mo'ljallangan platforma.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://datagaze.zufariy.uz"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Ko'rish
//                   </a>
//                   <a href="https://github.com/Xorazm92/datagaze-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>

//               {/* CRM Loyihasi */}
//               <div class="card">
//                 <img class="card-img-top" src={CrmImg} alt="Zufariy CRM" />
//                 <div class="card-body">
//                   <h5 class="card-title">Zufariy CRM</h5>
//                   <h7 className="title-tag">Mijozlar bilan ishlash tizimi</h7>
//                   <p class="card-text">
//                     Mijozlar bazasini boshqarish, sotuvlarni kuzatish va biznes jarayonlarini avtomatlashtirish uchun CRM tizimi.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://crm.zufariy.uz"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Ko'rish
//                   </a>
//                   <a href="https://github.com/Xorazm92/crm-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>


//               {/* ===== YANGI LOYIHA: NASIYA SAVDO ===== */}
//               <div class="card">
//                 <img class="card-img-top" src={NasiyaImg} alt="Nasiya Savdo Tizimi" />
//                 <div class="card-body">
//                   <h5 class="card-title">Nasiya Savdo Tizimi</h5>
//                   <h7 className="title-tag">Qarz daftari boshqaruvi</h7>
//                   <p class="card-text">
//                     Do'konlar va tadbirkorlar uchun mijozlarning qarzlarini onlayn hisobga olish va boshqarish tizimi. Qog'oz daftardan voz kechish imkonini beradi.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://nasiya.zufariy.uz"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Ko'rish
//                   </a>
//                   <a href="https://github.com/Xorazm92/nasiya-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>

//               {/* Quiz App Loyihasi */}
//               <div class="card">
//                 <img class="card-img-top" src={QuizAppImg} alt="Quiz App" />
//                 <div class="card-body">
//                   <h5 class="card-title">Quiz App</h5>
//                   <h7 className="title-tag">Onlayn Viktorina Platformasi</h7>
//                   <p class="card-text">
//                     Foydalanuvchilar uchun turli mavzularda onlayn testlar va viktorinalar yaratish va ishtirok etish imkonini beruvchi veb-ilova.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://quiz.zufariy.uz"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Ko'rish
//                   </a>
//                    <a href="https://github.com/Xorazm92/quiz-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>

//               {/* Online Shop Loyihasi */}
//               <div class="card">
//                 <img class="card-img-top" src={ShopImg} alt="Online Shop" />
//                 <div class="card-body">
//                   <h5 class="card-title">E-commerce Shop</h5>
//                   <h7 className="title-tag">Onlayn do'kon</h7>
//                   <p class="card-text">
//                     Mahsulotlar katalogi, savatcha va buyurtma berish funksiyalariga ega zamonaviy onlayn do'kon platformasi.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://shop.zufariy.uz"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Ko'rish
//                   </a>
//                    <a href="https://github.com/Xorazm92/shop-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>


//               {/* NGKbot Loyihasi */}
//               <div class="card">
//                 <img class="card-img-top" src={NgkBotImg} alt="NGK Bot" />
//                 <div class="card-body">
//                   <h5 class="card-title">NGK Bot</h5>
//                   <h7 className="title-tag">Telegram Bot</h7>
//                   <p class="card-text">
//                     NGK  haqida ma'lumotlar va yangiliklarni taqdim etuvchi Telegram bot.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://t.me/NGKbot"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Sinab ko'rish
//                   </a>
//                    <a href="https://github.com/Xorazm92/ngkbot-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>

//               {/* Quiz Bot Loyihasi */}
//               <div class="card">
//                 <img class="card-img-top" src={QuizBotImg} alt="Quiz Bot" />
//                 <div class="card-body">
//                   <h5 class="card-title">Quiz Bot</h5>
//                   <h7 className="title-tag">Telegram Bot</h7>
//                   <p class="card-text">
//                     Telegram orqali interaktiv viktorinalarda qatnashish va bilimni sinash uchun mo'ljallangan bot.
//                   </p>
//                 </div>
//                 <div className="button-container">
//                   <a
//                     href="https://t.me/quizbot"
//                     target="_blank" rel="noopener noreferrer"
//                     class="btn btn-outline-dark btn-lg"
//                     role="button"
//                   >
//                     Sinab ko'rish
//                   </a>
//                    <a href="https://github.com/Xorazm92/quizbot-repo" target="_blank" rel="noopener noreferrer" class="btn btn-lg">
//                     <i class="fab fa-github fa-2x"></i>
//                   </a>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Projects;
