/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import ExamensComlementaireAjouter from "./ExamensComlementaireAjouter";
import ExamensComlementaireTable from "./ExamensComlementaireTable";
import {
  LABORATOIRE,
  VERDICT_NON_EXAMINATEUR,
  VERDICT_STATUS_EXAMEN_COMP,
  VERDICT_STATUS_MEDECIN_SPECIALISTE
} from "../../../../../constants/index";
import { getAuxiliairesByType } from "../../../../Parametrage/Auxiliaires/AuxiliaireAPI";
import { getVerdictByType } from "../../AcceptationsAPI";

class ExamensComlementaire extends Component {
  state = {
    laboratoires: [],
    data: null,
    verdicts: []
  };

  componentDidMount() {
    this.AuxiliairesByType(LABORATOIRE);
    this.VerdictByType(VERDICT_NON_EXAMINATEUR);
  }

  handleCallback = childData => {
    this.setState({ data: childData });
  };

  async AuxiliairesByType(type) {
    let respense = await getAuxiliairesByType(type);
    this.setState({ laboratoires: respense.data });
  }
  async VerdictByType(type) {
    let respense = await getVerdictByType(type);

    this.setState({
      verdicts: respense.data.filter(
        item =>
          item.status !== VERDICT_STATUS_EXAMEN_COMP &&
          item.status !== VERDICT_STATUS_MEDECIN_SPECIALISTE
      )
    });
  }
  render() {
    return (
      <div>
        <ExamensComlementaireAjouter
          parentCallback={this.handleCallback}
          laboratoires={this.state.laboratoires}
          record={this.props.record}
          verdicts={this.state.verdicts}
        ></ExamensComlementaireAjouter>
        <ExamensComlementaireTable
          dataTable={this.state.data}
          laboratoires={this.state.laboratoires}
          record={this.props.record}
          verdicts={this.state.verdicts}
        ></ExamensComlementaireTable>
      </div>
    );
  }
}

export default ExamensComlementaire;
