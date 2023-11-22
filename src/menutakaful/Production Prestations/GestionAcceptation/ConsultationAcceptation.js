/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Card, Descriptions } from "antd";
import React, { Component } from "react";

import ExamensComlementaire from "./ConsultationTabs/ExamensComlementaire";
import Examinateur from "./ConsultationTabs/Examinateur";
import Laboratoire from "./ConsultationTabs/Laboratoire";
import MedecinConseil from "./ConsultationTabs/MedecinConseil";
import Reassurance from "./ConsultationTabs/Reassurance";
import Specialiste from "./ConsultationTabs/Specialiste";
import General from "./ModificationTabs/General";


const tabListNoTitle = [
  {
    key: "general",
    tab: "Général"
  },
  {
    key: "laboratoire",
    tab: "Laboratoire"
  },
  {
    key: "examinateur",
    tab: "Examinateur"
  },
  {
    key: "medecinConseil",
    tab: "Médecin Conseil"
  },
  {
    key: "specialiste",
    tab: "Specialiste"
  },
  {
    key: "examens",
    tab: "Examens Complémentaire"
  },
  {
    key: "reassurance",
    tab: "Réassurance"
  }
];

class ConsultationAcceptation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: "tab1",
      noTitleKey: "general"
    };
  }

  contentListNoTitle = {
    general: <General record={this.props.record.location.state.record} />,
    laboratoire: (
      <Laboratoire record={this.props.record.location.state.record} />
    ),
    examinateur: (
      <Examinateur record={this.props.record.location.state.record} />
    ),
    medecinConseil: (
      <MedecinConseil record={this.props.record.location.state.record} />
    ),
    specialiste: (
      <Specialiste record={this.props.record.location.state.record} />
    ),
    examens: (
      <ExamensComlementaire record={this.props.record.location.state.record} />
    ),
    reassurance: (
      <Reassurance record={this.props.record.location.state.record} />
    )
  };

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  render() {
    return (
      
      <div> 
        <p style={{ color: "red" }}>
        Alerte ! les données affichées sont considérées sensibles de par la loi 09-08. Elles sont confidentielles et doivent être traitées, manipulées et transmises dans le respect des habilitations en vigueur, et des autorisations CNDP.
        </p>
        <br></br>
        <Descriptions size="default">
          <Descriptions.Item label="Code acceptation">
            {this.props.record.location.state.record.code}
          </Descriptions.Item>
          <Descriptions.Item label="Nom assuré">
            {this.props.record.location.state.record.contrat.assure.nom}
          </Descriptions.Item>
          <Descriptions.Item label="Prenom assuré">
            {this.props.record.location.state.record.contrat.assure.prenom}
          </Descriptions.Item>
        </Descriptions>
        <br></br>

        <Card
          style={{ width: "100%" }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, "noTitleKey");
          }}
        >
          {this.contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}
export default ConsultationAcceptation;
