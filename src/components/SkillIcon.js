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
  '1c buxgalteriya': { icon: GrDocumentText, color: '#FDDA0D' },
};

const SkillIcon = ({ name }) => {
  const skillKey = name.toLowerCase();
  const IconData = iconMap[skillKey];
  const IconComponent = IconData ? IconData.icon : GrDocumentText;
  const color = IconData ? IconData.color : '#6c757d';

  return (
    <div className="skill-icon-container">
      <IconComponent style={{ color }} size="3em" />
      <p>{name}</p>
    </div>
  );
};

export default SkillIcon;
