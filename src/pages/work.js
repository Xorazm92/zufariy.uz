import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import './work.css';

// Rasm importlari
import RayaDuniaImg from "../res/work/rayadunia.png";
import NajotTalimImg from "../res/work/najottalim.png";
import UTYImg from "../res/work/uty.png";
import TTYMIImg from "../res/work/ttymi.png";

const imageMap = {
  RayaDuniaImg,
  NajotTalimImg,
  UTYImg,
  TTYMIImg,
};

const Work = ({ id }) => {
  const { t } = useTranslation();
  const workList = t('work.list', { returnObjects: true });

  const getIcon = (type) => {
    if (type === 'work') {
      return <BusinessCenterIcon />;
    }
    return <SchoolIcon />;
  };

  return (
    <>
      <Helmet>
        <title>{t('pages.work')}</title>
      </Helmet>
      <div id={id} className="work-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">{t('work.title')}</h2>
          <VerticalTimeline>
            {Array.isArray(workList) && workList.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                className={`vertical-timeline-element--${item.type}`}
                contentStyle={{
                  background: item.type === 'work' ? 'rgb(33, 150, 243)' : 'rgb(233, 30, 99)',
                  color: '#fff',
                }}
                contentArrowStyle={{
                  borderRight: `7px solid ${item.type === 'work' ? 'rgb(33, 150, 243)' : 'rgb(233, 30, 99)'}`,
                }}
                date={item.date}
                iconStyle={{
                  background: item.type === 'work' ? 'rgb(33, 150, 243)' : 'rgb(233, 30, 99)',
                  color: '#fff',
                }}
                icon={getIcon(item.type)}
              >
                <div className="d-flex align-items-center mb-2">
                  <img src={imageMap[item.img_id]} alt={item.title} className="timeline-pic me-3" />
                  <div>
                    <h3 className="vertical-timeline-element-title mb-1">{item.title}</h3>
                    <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4>
                  </div>
                </div>
                <p className="mb-0">{item.description}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </>
  );
};

export default Work;
