/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import ExaminateurAjouter from "./ExaminateurAjouter";
import ExaminateurTable from "./ExaminateurTable";
import {
  MEDECIN_EXAMINATEUR,
  VERDICT_EXAMINATEUR
} from "../../../../../constants/index";
import { getAuxiliairesByType } from "../../../../Parametrage/Auxiliaires/AuxiliaireAPI";
import { getVerdictByType } from "../../AcceptationsAPI";

class Examinateur extends Component {
  state = {
    medecins: [],
    verdicts: [],
    tabListNoTitle: [],
    data: null
  };

  componentDidMount() {
    this.AuxiliairesByType(MEDECIN_EXAMINATEUR);
    this.VerdictByType(VERDICT_EXAMINATEUR);
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
    let MedecinHelp = false;
    let reassuranceHelp = false;
    helpList.forEach(element => {
      if (element.key === "medecinConseil") {
        MedecinHelp = true;
      }
      if (element.key === "reassurance") reassuranceHelp = true;
    });

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
    this.setState({ tabListNoTitle: [...helpList, ...filtredList] });
    this.props.onglet(this.state.tabListNoTitle);
  };

  render() {
    return (
      <div>
        <ExaminateurAjouter
          parentCallback={this.handleCallback}
          onglet={this.acctivatedOnglet}
          verdicts={this.state.verdicts}
          medecins={this.state.medecins}
          record={this.props.record}
        ></ExaminateurAjouter>
        <ExaminateurTable
          dataTable={this.state.data}
          onglet={this.acctivatedOnglet}
          verdicts={this.state.verdicts}
          medecins={this.state.medecins}
          record={this.props.record}
        ></ExaminateurTable>
      </div>
    );
  }
}

export default Examinateur;
