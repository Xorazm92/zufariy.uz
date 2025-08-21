import React from 'react';
import {
  SiTypescript, SiNestjs, SiExpress, SiPostgresql, SiMongodb, SiRedis,
  SiPrisma, SiTypeorm, SiSequelize, SiGraphql, SiSwagger,
  SiGithubactions, SiGooglecloud, SiRabbitmq,
  SiGooglesheets
} from 'react-icons/si';
import { FaReact, FaDocker, FaAws, FaDigitalOcean, FaFileExcel, FaFileWord } from 'react-icons/fa';
import { VscServerProcess } from 'react-icons/vsc';
import { TbApi } from 'react-icons/tb';
import { BsBoxes } from 'react-icons/bs';
import { GrDocumentText } from 'react-icons/gr';
import icon1C from '../res/1C.png'; // 1C ikonkasi import qilindi

// Ko'nikma nomini uning ikonkasiga va rangiga bog'lash
const iconMap = {
  typescript: { icon: SiTypescript, color: '#3178C6' },
  nestjs: { icon: SiNestjs, color: '#E0234E' },
  expressjs: { icon: SiExpress, color: '#000000' },
  react: { icon: FaReact, color: '#61DAFB' },
  postgresql: { icon: SiPostgresql, color: '#4169E1' },
  mongodb: { icon: SiMongodb, color: '#47A248' },
  redis: { icon: SiRedis, color: '#DC382D' },
  prisma: { icon: SiPrisma, color: '#2D3748' },
  typeorm: { icon: SiTypeorm, color: '#E83414' },
  sequelize: { icon: SiSequelize, color: '#52B0E7' },
  rest: { icon: TbApi, color: '#00A2E5' },
  graphql: { icon: SiGraphql, color: '#E10098' },
  grpc: { icon: TbApi, color: '#4285F4' }, // Using TbApi as a fallback for gRPC
  swagger: { icon: SiSwagger, color: '#85EA2D' },
  docker: { icon: FaDocker, color: '#2496ED' },
  'github actions': { icon: SiGithubactions, color: '#2088FF' },
  aws: { icon: FaAws, color: '#FF9900' },
  gcp: { icon: SiGooglecloud, color: '#4285F4' },
  digitalocean: { icon: FaDigitalOcean, color: '#0080FF' },
  microservices: { icon: VscServerProcess, color: '#5667a2' },
  rabbitmq: { icon: SiRabbitmq, color: '#FF6600' },
  oop: { icon: BsBoxes, color: '#f0ad4e' },
  appsheet: { icon: SiGooglesheets, color: '#217346' },
  excel: { icon: FaFileExcel, color: '#217346' },
  word: { icon: FaFileWord, color: '#2B579A' },
  '1c buxgalteriya': { src: icon1C, type: 'image' },
};

// Rasmiy dokumentatsiya URL'lari
const docUrls = {
  typescript: 'https://www.typescriptlang.org/docs/',
  nestjs: 'https://docs.nestjs.com/',
  expressjs: 'https://expressjs.com/en/guide/routing.html',
  react: 'https://react.dev/learn',
  postgresql: 'https://www.postgresql.org/docs/',
  mongodb: 'https://www.mongodb.com/docs/',
  redis: 'https://redis.io/docs/',
  prisma: 'https://www.prisma.io/docs',
  typeorm: 'https://typeorm.io/',
  sequelize: 'https://sequelize.org/docs/',
  rest: 'https://restfulapi.net/',
  graphql: 'https://graphql.org/learn/',
  grpc: 'https://grpc.io/docs/',
  swagger: 'https://swagger.io/specification/',
  docker: 'https://docs.docker.com/',
  'github actions': 'https://docs.github.com/actions',
  aws: 'https://docs.aws.amazon.com/',
  gcp: 'https://cloud.google.com/docs',
  digitalocean: 'https://docs.digitalocean.com/',
  microservices: 'https://microservices.io/',
  rabbitmq: 'https://www.rabbitmq.com/documentation.html',
  oop: 'https://en.wikipedia.org/wiki/Object-oriented_programming',
  appsheet: 'https://support.google.com/appsheet#topic=10106675',
  excel: 'https://support.microsoft.com/excel',
  word: 'https://support.microsoft.com/word',
  '1c buxgalteriya': 'https://its.1c.ru/',
};

const SkillIcon = ({ name }) => {
  const skillKey = name.toLowerCase();
  const IconData = iconMap[skillKey];

  // Agar ko'nikma map'da topilmasa, standart ikonkadan foydalanish
  if (!IconData) {
    return (
      <div className="skill-icon-container">
        <GrDocumentText style={{ color: '#6c757d' }} size="3em" />
        <p>{name}</p>
      </div>
    );
  }

  const { type, src, icon: IconComponent, color } = IconData;
  const href = docUrls[skillKey];

  const content = (
    <>
      {type === 'image' ? (
        <img src={src} alt={`${name} icon`} className="skill-image-icon" />
      ) : (
        <IconComponent style={{ color: color || '#6c757d' }} size="3em" />
      )}
      <p>{name}</p>
    </>
  );

  // Agar hujjat URL'i mavjud bo'lsa, link sifatida qaytaramiz
  if (href) {
    return (
      <a
        className="skill-icon-container"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} dokumentatsiyasi`}
      >
        {content}
      </a>
    );
  }

  // Aks holda oddiy container
  return (
    <div className="skill-icon-container">
      {content}
    </div>
  );
};

export default SkillIcon;
