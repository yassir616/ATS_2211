import "antd/dist/antd.css";
import { Form, Icon, notification, Table } from "antd";
import React, { Component } from "react";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps.js";
import { getPrelevement } from "./CotisationAPI.js";

class GestionImpayes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      searchText: "",
      searchedColumn: "",
      record: {},
      value: "",
      keyRecord: "",
      auxiliaire: []
    };
    this.columns = [
      {
        title: "Numéro quittance",
        dataIndex: "numQuittance",
        key: "numQuittance",
        ...getColumnSearchProps("numQuittance", "numQuittance1", this)
      },
      {
        title: "N° de Contrat",
        dataIndex: "contrat.numeroContrat",
        key: "numeroContrat",
        render: text => <a href="#top">{text}</a>
      },
      {
        title: "Type Cotisation",
        dataIndex: "cotisationType",
        key: "cotisationType",
        ...getColumnSearchProps("cotisationType", "cotisationType1", this)
      },
      {
        title: "Date Prélèvement",
        dataIndex: "datePrelevement",
        key: "datePrelevement",
        ...getColumnSearchProps("datePrelevement", "dtePrelevement1", this)
      },
      {
        title: "Montant cotisation",
        dataIndex: "montantCotisation",
        key: "montantCotisation",
        ...getColumnSearchProps("montantCotisation", "Montant cotisation", this)
      },
      {
        title: "Etat cotisation",
        dataIndex: "etatCotisation",
        key: "etatCotisation",
        ...getColumnSearchProps("etatCotisation", "Etat cotisation", this)
      },
      {
        title: "Montant Taxe ",
        dataIndex: "montantTaxe",
        key: "montantTaxe",
        ...getColumnSearchProps("montantTaxe", "montantTaxe", this)
      },
      {
        title: "Montant TTC ",
        dataIndex: "montantTTC",
        key: "montantTtc",
        ...getColumnSearchProps("montantTtc", "montantTtc", this)
      },
      {
        title: "Frais acquisition TTC ",
        dataIndex: "fraisAcquisitionTTC",
        key: "fraisAcquisitionTTC"
      },
      {
        title: "Frais gestion TTC ",
        dataIndex: "fraisGestionTTC",
        key: "fraisGestionTTC"
      },
      {
        title: "Contribution Pure ",
        dataIndex: "contributionPure",
        key: "contributionPure"
      },
      {
        title: "Solde ",
        dataIndex: "solde",
        key: "solde",
        ...getColumnSearchProps("solde", "solde", this)
      },
      {
        title: "Opérations",
        dataIndex: "operation",
        fixed: "right",
        render: (text, record) => {
          return (
            <span>
              <a
                href="#top"
                type="primary"
                onClick={() => this.handleSelectChange(record)}
                style={{ borderRadius: "0px" }}
              >
                <Icon
                  type="edit"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </a>
            </span>
          );
        }
      }
    ];
  }
  componentDidMount() {
    this.recherchePrelevement();
  }
  recherchePrelevement = () => {
    getPrelevement()
      .then(response => {
        let newDataList = [];
        response.data.content.forEach(element => {
          let key = { key: element.id };
          element = { ...element, ...key };
          newDataList.push(element);
        });

        this.setState({
          data: newDataList
        });
      })
      .catch(error => {
        if (error.status === 401) {
          notification.error({
            message: "Takaful",
            description:
              "Votre login ou mot de passe est incorrect. Veuillez réessayer!"
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              error.message ||
              "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
          });
        }
      });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    return (
      <div>
        <br />
        <br />
        <Table
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
          scroll={{ x: 1300 }}
          tableLayout="unset"
          size="small"
        />
      </div>
    );
  }
}

export default Form.create()(GestionImpayes);
