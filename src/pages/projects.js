import React from "react";
import "./styles.css";

// Loyiha rasmlari
import DataGazeImg from "../res/projects/datagaze.png";
import CrmImg from "../res/projects/crm.png";
import NasiyaImg from "../res/projects/nasiya.png";
import QuizAppImg from "../res/projects/quiz-app.png";
import NgkBotImg from "../res/projects/ngk-bot.png";
import QuizBotImg from "../res/projects/quiz-bot.png";

// Loyihalar ma'lumotlari massivi kodni toza saqlash uchun
const projectData = [
  {
    img: DataGazeImg,
    alt: "DataGaze loyihasi",
    title: "DataGaze",
    tag: "Ma'lumotlar Vizualizatsiyasi",
    description: "Ma'lumotlarni tahlil qilish va interaktiv grafiklar orqali vizualizatsiya qilish uchun mo'ljallangan platforma.",
    link: "https://datagaze.zufariy.uz",
    buttonText: "Ko'rish"
  },
  {
    img: CrmImg,
    alt: "Zufariy CRM",
    title: "Zufariy CRM",
    tag: "Mijozlar bilan ishlash tizimi",
    description: "Mijozlar bazasini boshqarish, sotuvlarni kuzatish va biznes jarayonlarini avtomatlashtirish uchun CRM tizimi.",
    link: "https://crm.zufariy.uz",
    buttonText: "Ko'rish"
  },
  {
    img: NasiyaImg,
    alt: "Nasiya Savdo Tizimi",
    title: "Nasiya Savdo",
    tag: "Bo'lib to'lashni boshqarish",
    description: "Nasiya savdo operatsiyalarini yuritish, qarzdorlikni kuzatish va hisobotlarni shakllantirish uchun onlayn tizim.",
    link: "https://nasiya.zufariy.uz",
    buttonText: "Ko'rish"
  },
  {
    img: QuizAppImg,
    alt: "Quiz App",
    title: "Quiz App",
    tag: "Onlayn Viktorina Platformasi",
    description: "Foydalanuvchilar uchun turli mavzularda onlayn testlar va viktorinalar yaratish va ishtirok etish imkonini beruvchi veb-ilova.",
    link: "https://quiz.zufariy.uz",
    buttonText: "Ko'rish"
  },

  {
    img: NgkBotImg,
    alt: "NGK Bot",
    title: "NGK Bot",
    tag: "Telegram Bot",
    description: "NGK haqida ma'lumotlar va yangiliklarni taqdim etuvchi Telegram bot.",
    link: "https://t.me/NGKbot",
    buttonText: "Sinab ko'rish"
  },
  {
    img: QuizBotImg,
    alt: "Quiz Bot",
    title: "Quiz Bot",
    tag: "Telegram Bot",
    description: "Telegram orqali interaktiv viktorinalarda qatnashish va bilimni sinash uchun mo'ljallangan bot.",
    link: "https://t.me/quizbot",
    buttonText: "Sinab ko'rish"
  }
];

// Funksional komponentga o'tkazildi va Bootstrap 5 ga moslashtirildi
const Projects = ({ id }) => {
  return (
    <div id={id} className="projects container py-5">
      <h2 className="projects-title text-center mb-5">Mening Loyihalarim</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {projectData.map((project, index) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm">
              <img src={project.img} className="card-img-top" alt={project.alt} />
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
  );
};

export default Projects;
