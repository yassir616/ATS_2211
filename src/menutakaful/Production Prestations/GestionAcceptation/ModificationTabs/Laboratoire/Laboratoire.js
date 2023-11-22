/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import LaboratoireAjouter from "./LaboratoireAjouter";
import LaboratoireTable from "./LaboratoireTable";
import { getAuxiliairesByType } from "../../../../Parametrage/Auxiliaires/AuxiliaireAPI";

class Laboratoire extends Component {
  state = {
    laboratoires: [],
    data: null
  };

  componentDidMount() {
    this.AuxiliairesByType("LABORATOIRE");
  }

  async AuxiliairesByType(type) {
    let respense = await getAuxiliairesByType(type);
    this.setState({ laboratoires: respense.data });
  }

  handleCallback = childData => {
    this.setState({ data: childData });
  };

  render() {
    return (
      <div>
        <LaboratoireAjouter
          parentCallback={this.handleCallback}
          laboratoires={this.state.laboratoires}
          record={this.props.record}
        ></LaboratoireAjouter>
        <LaboratoireTable
          dataTable={this.state.data}
          laboratoires={this.state.laboratoires}
          record={this.props.record}
        ></LaboratoireTable>
      </div>
    );
  }
}

export default Laboratoire;
