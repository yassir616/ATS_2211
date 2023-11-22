/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Table, Tag } from "antd";
import moment from "moment";
import React, { Component } from "react";
import {
  getAcceptationlaboByAcceptation,
  getAcceptationlaboByAcceptationsLaboratoire
} from "../AcceptationsAPI";

class Laboratoire extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "", testsMedical: [] };
    this.columns = [
      {
        title: "laboratoire",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.laboratoire.raison_social}</span>
        )
      },
      {
        title: "date analyse",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => (
          <span>
            {
            // moment(
              acceptationsLabo.dateAnalyse
              // ).format("YYYY-MM-DD")
            }
          </span>
        )
      },
      {
        title: "date réception",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => (
          <span>
            {
            // moment(
              acceptationsLabo.dateReception
              // ).format("YYYY-MM-DD")
              }
          </span>
        )
      },
      {
        title: "observations",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.observations}</span>
      },
      {
        title: "Tests Medical",
        dataIndex: "honoraires",
        editable: true,
        render: honoraires => (
          <span>
            {honoraires.map(tag => {
              let color = "volcano";
              return (
                <Tag color={color} key={tag}>
                  {tag.libelle.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      }
    ];
  }

  async acceptationsLabo(id) {
    let Response = await getAcceptationlaboByAcceptation(id);
    let newDataList = [];
    for (const element of Response.data) {
      let responseAcc = await getAcceptationlaboByAcceptationsLaboratoire(
        id,
        element.id
      );

      let key = { key: responseAcc.data.id };
      let elementone = { ...responseAcc.data, ...key };
      newDataList.push(elementone);
    }
    this.setState({
      data: [...newDataList]
    });
  }

  componentDidMount() {
    this.acceptationsLabo(this.props.record.id);
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

export default Laboratoire;
