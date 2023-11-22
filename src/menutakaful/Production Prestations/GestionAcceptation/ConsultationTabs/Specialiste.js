import "antd/dist/antd.css";

import { Table } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { getAcceptationSpecialisteByAcceptation } from "../AcceptationsAPI";

class Specialiste extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "" };
    this.columns = [
      {
        title: "Specialiste",
        dataIndex: "specialiste",
        editable: true,
        render: (specialiste) => <span>{specialiste.nom}</span>,
      },
      {
        title: "Specialité",
        dataIndex: "specialite",
        editable: true,
      },
      {
        title: "Nature de test",
        dataIndex: "natureTest",
        editable: true,
      },
      {
        title: "Date consultation",
        dataIndex: "dateConsultation",
        editable: true,
        render: (dateConsultation) => (
          <span>{
            // moment(
              dateConsultation
              // ).format("YYYY-MM-DD")
              }</span>
        ),
      },
      {
        title: "observations",
        dataIndex: "observations",
        editable: true,
      },
    ];
  }

  async acceptationsSpecialiste(id) {
    let Response = await getAcceptationSpecialisteByAcceptation(id);
    let newDataList = [];
    for (const element of Response.data) {
      let key = { key: element.id };
      let elementone = { ...element, ...key };
      newDataList.push(elementone);
    }

    this.setState({
      data: [...newDataList],
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
          defaultPageSize: 50,
        }}
      />
    );
  }
}

export default Specialiste;
