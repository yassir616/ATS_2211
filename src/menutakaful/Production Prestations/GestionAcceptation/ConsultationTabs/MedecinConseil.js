/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Table, Tag } from "antd";
import moment from "moment";
import React, { Component } from "react";
import {
  getAcceptationConseilByAcceptation,
  getAcceptationTestByAcceptationsConseil
} from "../AcceptationsAPI";

class MedecinConseil extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "", testsMedical: [] };
    this.columns = [
      {
        title: "Medecin",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.medecin.nom}</span>
      },
      {
        title: "Date Expertise",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>
            {
            // moment(
              acceptationsLabo.dateExpertise
            // ).format("YYYY-MM-DD")
            }
          </span>
        )
      },
      {
        title: "Taux de surprime",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.tauxSurprime}</span>
      },
      {
        title: "Taux de surmoralité",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.tauxSurmoralite}</span>
        )
      },
      {
        title: "Observations",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.observation}</span>
      },
      {
        title: "Verdict",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.verdict.status}</span>
        )
      },
      {
        title: "Observation verdict",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.observationsVerdict}</span>
        )
      },
      {
        title: "Motif",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.motif}</span>
      },
      {
        title: "Test Medical",
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

  async acceptationsConseil(id) {
    let Response = await getAcceptationConseilByAcceptation(id);
    let newDataList = [];

    for (const element of Response.data) {
      let responseAcc = await getAcceptationTestByAcceptationsConseil(
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
    this.acceptationsConseil(this.props.record.id);
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

export default MedecinConseil;
