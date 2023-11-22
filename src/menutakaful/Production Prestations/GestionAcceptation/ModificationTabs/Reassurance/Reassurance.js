/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import ReassuranceAjouter from "./ReassuranceAjouter";
import ReassuranceTable from "./ReassuranceTable";
import { VERDICT_NON_EXAMINATEUR } from "../../../../../constants/index";
import { getVerdictByType } from "../../AcceptationsAPI";

class Reassurance extends Component {
  state = {
    verdicts: [],
    tabListNoTitle: []
  };

  componentDidMount() {
    this.VerdictByType(VERDICT_NON_EXAMINATEUR);
  }

  async VerdictByType(type) {
    let respense = await getVerdictByType(type);
    this.setState({ verdicts: respense.data });
  }
  handleCallback = childData => {
    this.setState({ data: childData });
  };
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
        <ReassuranceAjouter
          parentCallback={this.handleCallback}
          onglet={this.acctivatedOnglet}
          verdicts={this.state.verdicts}
          record={this.props.record}
        ></ReassuranceAjouter>
        <ReassuranceTable
          dataTable={this.state.data}
          onglet={this.acctivatedOnglet}
          verdicts={this.state.verdicts}
          record={this.props.record}
        ></ReassuranceTable>
      </div>
    );
  }
}

export default Reassurance;
