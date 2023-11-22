/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Table } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { getAcceptationReassuranceByAcceptation } from "../AcceptationsAPI";

class Reassurance extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "" };
    this.columns = [
      {
        title: "Date réception",
        dataIndex: "dateReception",
        editable: true,
        render: dateConsultation => (
          <span>{
            // moment(
              dateConsultation
              // ).format("YYYY-MM-DD")
              }</span>
        )
      },
      {
        title: "Date reassurance",
        dataIndex: "dateReassurance",
        editable: true,
        render: dateConsultation => (
          <span>{
            // moment(
              dateConsultation
              // ).format("YYYY-MM-DD")
              }</span>
        )
      },
      {
        title: "Observation",
        dataIndex: "observation",
        editable: true
      },
      {
        title: "Taux de Surprime",
        dataIndex: "tauxSurprime",
        editable: true
      },
      {
        title: "Verdict",
        dataIndex: "verdict",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.status}</span>
      },
      {
        title: "Motif",
        dataIndex: "motif",
        editable: true
      },
      {
        title: "Observation verdict",
        dataIndex: "observationVerdict",
        editable: true
      }
    ];
  }

  async acceptationsSpecialiste(id) {
    let Response = await getAcceptationReassuranceByAcceptation(id);
    let newDataList = [];
    for (const element of Response.data) {
      let key = { key: element.id };
      let elementone = { ...element, ...key };
      newDataList.push(elementone);
    }

    this.setState({
      data: [...newDataList]
    });
  }

  componentDidMount() {
    this.acceptationsSpecialiste(this.props.record.id);
  }

  render() {
    return (
      <Table
        bordered
        dataSource={this.state.data}
        columns={this.columns}
        rowClassName="editable-row"
        pagination={{
          hideOnSinglePage: true,
          defaultPageSize: 50
        }}
      />
    );
  }
}

export default Reassurance;
