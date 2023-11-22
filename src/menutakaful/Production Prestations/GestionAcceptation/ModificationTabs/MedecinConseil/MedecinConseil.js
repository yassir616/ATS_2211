/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import MedecinConseilAjouter from "./MedecinConseilAjouter";
import MedecinConseilTable from "./MedecinConseilTable";
import {
  MEDECIN_CONSEIL,
  VERDICT_NON_EXAMINATEUR
} from "../../../../../constants/index";
import { getAuxiliairesByType } from "../../../../Parametrage/Auxiliaires/AuxiliaireAPI";
import { getVerdictByType } from "../../AcceptationsAPI";

class MedecinConseil extends Component {
  state = {
    medecins: [],
    verdicts: [],
    tabListNoTitle: []
  };

  componentDidMount() {
    this.AuxiliairesByType(MEDECIN_CONSEIL);
    this.VerdictByType(VERDICT_NON_EXAMINATEUR);
  }

  handleCallback = childData => {
    this.setState({ data: childData });
  };

  async AuxiliairesByType(type) {
    let respense = await getAuxiliairesByType(type);
    this.setState({ medecins: respense.data });
  }
  async VerdictByType(type) {
    let respense = await getVerdictByType(type);
    this.setState({ verdicts: respense.data });
  }

  acctivatedOnglet = list => {
    let helpList = [...this.state.tabListNoTitle];
    let filtredList = [...list];
    let examensHelp = false;
    helpList.forEach(element => {
      if (element.key === "examens") {
        examensHelp = true;
      }
    });

    if (examensHelp) {
      filtredList = list.filter(item => item.key !== "examens");
    }

    this.setState({ tabListNoTitle: [...helpList, ...filtredList] });
    this.props.onglet(this.state.tabListNoTitle);
  };

  render() {
    return (
      <div>
        <MedecinConseilAjouter
          parentCallback={this.handleCallback}
          onglet={this.acctivatedOnglet}
          verdicts={this.state.verdicts}
          medecins={this.state.medecins}
          record={this.props.record}
        ></MedecinConseilAjouter>

        <MedecinConseilTable
          dataTable={this.state.data}
          onglet={this.acctivatedOnglet}
          verdicts={this.state.verdicts}
          medecins={this.state.medecins}
          record={this.props.record}
        ></MedecinConseilTable>
      </div>
    );
  }
}

export default MedecinConseil;
