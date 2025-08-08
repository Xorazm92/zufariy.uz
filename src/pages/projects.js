import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import "./projects.css";
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

// Loyiha rasmlari
const imageMap = {
  datagaze: require("../res/projects/datagaze.png"),
  crm: require("../res/projects/crm.png"),
  nasiya: require("../res/projects/nasiya.png"),
  quiz_app: require("../res/projects/quiz-app.png"),
  ngk_bot: require("../res/projects/ngk-bot.png"),
  quiz_bot: require("../res/projects/quiz-bot.png"),
};

function Card3D({ children }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, shadow: 0.12 });
  const onMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (py - 0.5) * -10; // rotateX
    const ry = (px - 0.5) * 10;  // rotateY
    setTilt({ x: rx, y: ry, shadow: 0.22 });
  }, []);
  const onLeave = useCallback(() => setTilt({ x: 0, y: 0, shadow: 0.12 }), []);

  return (
    <motion.div
      className="card-3d-wrapper"
      style={{ perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="card card-3d h-100 shadow-sm"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: `0 20px 40px rgba(0,0,0,${tilt.shadow})`
        }}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const Projects = ({ id }) => {
  const { t } = useTranslation();
  const projectsList = t('projects.list', { returnObjects: true });
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(null);
  const openDetails = (p) => { setActive(p); setShow(true); };
  const closeDetails = () => setShow(false);

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
            <Card3D>
              <img src={imageMap[project.id]} className="card-img-top" alt={project.alt} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{project.title}</h5>
                <h6 className="title-tag text-muted">{project.tag}</h6>
                <p className="card-text">{project.description}</p>
                <div className="d-flex flex-wrap gap-2 mt-auto justify-content-center">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark btn-sm"
                      role="button"
                    >
                      {project.buttonText}
                    </a>
                  )}
                  <Button size="sm" variant="primary" onClick={() => openDetails(project)}>
                    {t('projects.details') || 'Details'}
                  </Button>
                </div>
              </div>
            </Card3D>
          </div>
        ))}
      </div>
      </div>

      <Modal show={show} onHide={closeDetails} centered>
        <Modal.Header closeButton>
          <Modal.Title>{active?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {active && (
            <>
              <img src={imageMap[active.id]} alt={active.alt} className="img-fluid rounded mb-3" />
              <p className="mb-2">{active.description}</p>
              {active.tech && <p className="text-muted"><strong>Tech:</strong> {active.tech}</p>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {active?.link && (
            <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              {active.buttonText}
            </a>
          )}
          {active?.repo && (
            <a href={active.repo} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
              GitHub
            </a>
          )}
          <Button variant="secondary" onClick={closeDetails}>Close</Button>
        </Modal.Footer>
      </Modal>
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
