/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Card, Descriptions } from "antd";
import React, { Component } from "react";

import ExamensComlementaire from "./ModificationTabs/ExamensComlementaire/ExamensComlementaire";
import Examinateur from "./ModificationTabs/Examinateur/Examinateur";
import General from "./ModificationTabs/General";
import Laboratoire from "./ModificationTabs/Laboratoire/Laboratoire";
import MedecinConseil from "./ModificationTabs/MedecinConseil/MedecinConseil";
import Reassurance from "./ModificationTabs/Reassurance/Reassurance";
import Specialiste from "./ModificationTabs/Specialiste/Specialiste";

class ModificationAcceptation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: "tab1",
      noTitleKey: "general",
      tabListNoTitle: [
        {
          key: "general",
          tab: "Général"
        },
        {
          key: "laboratoire",
          tab: "Laboratoire"
        }
      ]
    };
  }

  acctivatedOnglet = list => {
    let helpList = [...this.state.tabListNoTitle];
    let filtredList = [...list];
    let MedecinHelp = false;
    let reassuranceHelp = false;
    let examenseHelp = false;

    helpList.forEach(element => {
      if (element.key === "medecinConseil") {
        MedecinHelp = true;
      }
      if (element.key === "reassurance") reassuranceHelp = true;

      if (element.key === "examens") {
        examenseHelp = true;
      }
    });

    if (examenseHelp) {
      filtredList = list.filter(
        item => item.key !== "examens" && item.key !== "specialiste"
      );
    }
    if (MedecinHelp) {
      filtredList = list.filter(item => item.key !== "medecinConseil");
    }
    if (reassuranceHelp) {
      filtredList = list.filter(item => item.key !== "reassurance");
    }
    if (reassuranceHelp && MedecinHelp) {
      filtredList = list.filter(
        item => item.key !== "reassurance" && item.key !== "medecinConseil"
      );
    }
    if (MedecinHelp && examenseHelp) {
      filtredList = list.filter(
        item =>
          item.key !== "medecinConseil" &&
          item.key !== "examens" &&
          item.key !== "specialiste"
      );
    }
    if (reassuranceHelp && examenseHelp) {
      filtredList = list.filter(
        item =>
          item.key !== "reassurance" &&
          item.key !== "examens" &&
          item.key !== "specialiste"
      );
    }
    if (reassuranceHelp && MedecinHelp && examenseHelp) {
      filtredList = list.filter(
        item =>
          item.key !== "reassurance" &&
          item.key !== "medecinConseil" &&
          item.key !== "examens" &&
          item.key !== "specialiste"
      );
    }

    this.setState({ tabListNoTitle: [...helpList, ...filtredList] });
  };

  componentDidMount() {
    const { record } = this.props.record.location.state;

    if (
      record.contrat.produit.seuilExaminateur <
        record.cumul <
        record.contrat.produit.seuilConseil ||
      record.contrat.produit.seuilConseil <
        record.cumul <
        record.contrat.produit.seuilReassurance ||
      record.cumul > record.contrat.produit.seuilReassurance
    ) {
      this.setState({
        tabListNoTitle: [
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
          }
        ]
      });
    }

    if (record.contrat.produit.seuilExaminateur > record.cumul) {
      // todo : add the accepted condition
      this.setState({
        tabListNoTitle: [
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
          }
        ]
      });
    }
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  render() {
    let contentListNoTitle = {
      general: <General record={this.props.record.location.state.record} />,
      laboratoire: (
        <Laboratoire
          onglet={this.acctivatedOnglet}
          record={this.props.record.location.state.record}
        />
      ),
      examinateur: (
        <Examinateur
          onglet={this.acctivatedOnglet}
          record={this.props.record.location.state.record}
        />
      ),
      medecinConseil: (
        <MedecinConseil
          onglet={this.acctivatedOnglet}
          record={this.props.record.location.state.record}
        />
      ),
      specialiste: (
        <Specialiste record={this.props.record.location.state.record} />
      ),
      examens: (
        <ExamensComlementaire
          record={this.props.record.location.state.record}
        />
      ),
      reassurance: (
        <Reassurance 
          onglet={this.acctivatedOnglet}
          record={this.props.record.location.state.record} 
        />
      )
    };

    return (
      <div>
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
          tabList={this.state.tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, "noTitleKey");
          }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}
export default ModificationAcceptation;
