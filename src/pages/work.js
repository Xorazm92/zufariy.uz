import React from "react";
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";
import "./styles.css";

import RayaDuniaImg from "../res/work/rayadunia.png";
import NajotTalimImg from "../res/work/najottalim.png";
import UTYImg from "../res/work/uty.png";
import TTYMIImg from "../res/work/ttymi.png";



const Work = ({ id }) => {
  return (
    <div id={id}>
      <h2 className="work-title">Ish Tajribam va Ta'lim</h2>
      <br />
      <br />
      <VerticalTimeline className="vertical-timeline-custom-line">
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
          date="2024 - Hozirgacha"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<CodeIcon />}
        >
          <div className="timeline-info">
            <img className="timeline-pic" src={RayaDuniaImg} alt="Raya Dunia MCHJ" />
            <div className="timeline-text">
              <h3 className="vertical-timeline-element-title">Raya Dunia MCHJ</h3>
              <h4 className="vertical-timeline-element-subtitle">Toshkent, O'zbekiston</h4>
            </div>
          </div>
          <p>Full Stack (NodeJS+ReactJS) Dasturchi</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid rgb(233, 30, 99)" }}
          date="2024 - 2025"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<SchoolIcon />}
        >
          <div className="timeline-info">
            <img className="timeline-pic" src={NajotTalimImg} alt="Najot Ta'lim" />
            <div className="timeline-text">
              <h3 className="vertical-timeline-element-title">Najot Ta'lim O'quv Markazi</h3>
              <h4 className="vertical-timeline-element-subtitle">Toshkent, O'zbekiston</h4>
            </div>
          </div>
          <p>Full Stack (NodeJS+ReactJS) Dasturlash kursi</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
          date="2015 - 2024"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<BusinessCenterIcon />}
        >
          <div className="timeline-info">
            <img className="timeline-pic" src={UTYImg} alt="O'zbekiston temir yo'llari" />
            <div className="timeline-text">
              <h3 className="vertical-timeline-element-title">O'zbekiston temir yo'llari AJ</h3>
              <h4 className="vertical-timeline-element-subtitle">Toshkent, O'zbekiston</h4>
            </div>
          </div>
          <p>Temir yo'l tizimida mutaxassis</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid rgb(233, 30, 99)" }}
          date="2011 - 2015"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={<SchoolIcon />}
        >
          <div className="timeline-info">
            <img className="timeline-pic" src={TTYMIImg} alt="Toshkent temir yo'llari muhandisligi instituti" />
            <div className="timeline-text">
              <h3 className="vertical-timeline-element-title">Toshkent temir yo'llari muhandisligi instituti</h3>
              <h4 className="vertical-timeline-element-subtitle">Toshkent, O'zbekiston</h4>
            </div>
          </div>
          <p>Bakalavr darajasi</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
};

export default Work;
