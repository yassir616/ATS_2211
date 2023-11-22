import "antd/dist/antd.css";
import { Table, Tag } from "antd";
import moment from "moment";
import React, { Component } from "react";

import {
  getAcceptationExaminateurByAcceptation,
  getAcceptationTestByAcceptationsExaminateur
} from "../AcceptationsAPI";

class Examinateur extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.columns = [
      {
        title: "Medecin",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.medecin.nom}</span>
      },
      {
        title: "Date visite",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => (
          <span>
            {
            // moment(
              acceptationsLabo.dateVisite
              // ).format("YYYY-MM-DD")
              }
          </span>
        )
      },
      {
        title: "Date réception",
        dataIndex: "acceptationExaminateur",
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
        title: "Observations",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.observation}</span>
      },
      {
        title: "Verdict",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.verdict.status}</span>
        )
      },
      {
        title: "Observation verdict",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.observationsVerdict}</span>
        )
      },
      {
        title: "Motif",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.motif}</span>
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

  async acceptationsExaminateur(id) {
    let Response = await getAcceptationExaminateurByAcceptation(id);
    let newDataList = [];

    for (const element of Response.data) {
      let responseAcc = await getAcceptationTestByAcceptationsExaminateur(
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
    // eslint-disable-next-line react/prop-types
    this.acceptationsExaminateur(this.props.record.id);
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

export default Examinateur;
