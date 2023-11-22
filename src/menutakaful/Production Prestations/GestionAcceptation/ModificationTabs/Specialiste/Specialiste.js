/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import SpecialisteAjouter from "./SpecialisteAjouter";
import SpecialisteTable from "./SpecialisteTable";
import { MEDECIN_SPECIALISTE } from "../../../../../constants/index";
import { getAuxiliairesByType } from "../../../../Parametrage/Auxiliaires/AuxiliaireAPI";

class Laboratoire extends Component {
  state = {
    specialistes: [],
    tabListNoTitle: [],
    data: null
  };

  componentDidMount() {
    this.AuxiliairesByType(MEDECIN_SPECIALISTE);
  }

  async AuxiliairesByType(type) {
    let respense = await getAuxiliairesByType(type);
    this.setState({ specialistes: respense.data });
  }

  handleCallback = childData => {
    this.setState({ data: childData });
  };

  acctivatedOnglet = list => {
    let helpList = [...this.state.tabListNoTitle];
    let filtredList = [...list];
    helpList.forEach(element => {
      if (element.key === "examens") {
        filtredList = list.filter(item => item.key !== "examens");
      }
    });
    this.setState({ tabListNoTitle: [...helpList, ...filtredList] });
    this.props.onglet(this.state.tabListNoTitle);
  };

  render() {
    return (
      <div>
        <SpecialisteAjouter
          parentCallback={this.handleCallback}
          specialistes={this.state.specialistes}
          record={this.props.record}
        ></SpecialisteAjouter>
        <SpecialisteTable
          dataTable={this.state.data}
          specialistes={this.state.specialistes}
          record={this.props.record}
        ></SpecialisteTable>
      </div>
    );
  }
}

export default Laboratoire;
