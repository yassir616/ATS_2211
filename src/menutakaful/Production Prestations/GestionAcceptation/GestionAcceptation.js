/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Divider, Input, Select, Table, Tag, Icon } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import {
  getAcceptationsByPagination,
  searchAcceptations
} from "./AcceptationsAPI";
let disabl = true;
const { Option } = Select;
const { Search } = Input;
const columns = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    render: text => <a href="#top">{text}</a>
  },

  {
    title: "N° de Contrat",
    dataIndex: "contrat.numeroContrat",
    key: "numeroContrat"

  },
  {
    title: "CIN",
    dataIndex: "contrat",
    key: "cin",

    render: contrat => <span>{contrat.assure.cin}</span>
  },
  {
    title: "Nom assuré",
    dataIndex: "contrat",
    key: "nom",

    render: contrat => <span>{contrat.assure.nom}</span>
  },
  {
    title: "Prénom assuré",
    dataIndex: "contrat",
    key: "prenom",
    render: contrat => <span>{contrat.assure.prenom}</span>
  },
  {
    title: "Capital Assure",
    dataIndex: "contrat",
    key: "Mnt crédit",
    render: contrat => <span>{contrat.capitalAssure}</span>
  },
  {
    title: "Encours",
    dataIndex: "encours",
    key: "encours"
  },
  {
    title: "Date création",
    dataIndex: "creationDate",
    key: "creationDate"
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: status => (
      <span>
        {status === "DONE" ? (
          <Tag color="green" key={status}>
            ACCEPTE
          </Tag>
        ) : status === "SIMULATION" ? (
          <Tag color="red" key={status}>
            REJET
          </Tag>
        ) : status === "IN_PROGRESS" ? (
          <Tag color="orange" key={status}>
            EN COURS
          </Tag>
        ) : (
          <Tag color="red" key={status}>
            ANNULER
          </Tag>
        )}
      </span>
    )
  },
  {
    title: "Date status",
    dataIndex: "creationDate",
    key: "datestatus"
  },
  {
    title: "Produit",
    dataIndex: "contrat",
    key: "produit",
    render: contrat => <span>{contrat.produit.libelle}</span>
  },
  {
    title: "Partenaire",
    dataIndex: "contrat",
    key: "Partenaire",
    render: contrat => <span>{contrat.produit.partenaire.raisonSocial}</span>
  },
  {
    title: "Opérations",
    dataIndex: "operation",
    width: "15%",
    render: (text, record) => (
      <span>
        {record.contrat.status === "WAITING_ACCEPTATION" ? (
          <Link
            to={{
              pathname: "/ModificationAcceptation",
              state: { record: record }
            }}
          >
            <Icon
              type="edit"
              style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
            />
          </Link>
        ) : (
          <Link
            disabled={disabl}
            to={{
              pathname: "/ModificationAcceptation",
              state: { record: record }
            }}
          ></Link>
        )}

        <Divider type="vertical" />
        <Link
          to={{
            pathname: "/ConsultationAcceptation",
            state: { record: record }
          }}
        >
          <Icon
            type="container"
            style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
          />{" "}
        </Link>
      </span>
    )
  }
];
class GestionAcceptation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptations: [],
      totalItems: 0,
      pagenumber: 1,
      searchby: "code",
      searchfor: "",
      disabl: true
    };
  }

  componentDidMount() {
    this.getproprties(this.state.pagenumber - 1, 5);
  }
  async getproprties(page, limit) {
    let acceptationsResponse = await getAcceptationsByPagination(page, limit);
    console.log("acce:", acceptationsResponse);
    this.setState({
      acceptations: [...acceptationsResponse.data.content],
      totalItems: acceptationsResponse.data.totalElements
    });
  }
  async searchAcceptation(page, limit, searchby, searchfor) {
    let acceptationsResponse = await searchAcceptations(
      page,
      limit,
      searchby,
      searchfor
    );
    if (searchby === "prenom" || searchby === "nom") {
      this.setState({
        acceptations: [...acceptationsResponse.data.content],
        totalItems: acceptationsResponse.data.numberOfElements
      });
    } else if (searchby === "code") {
      this.setState({
        acceptations: [...acceptationsResponse.data.content],
        totalItems: acceptationsResponse.data.totalElements
      });
    }else if (searchby === "numeroContrat") {
      this.setState({
        acceptations: [...acceptationsResponse.data.content]
      });
    }
  }
  onPaginationChange = (pagenumber, pagesize) => {
    this.setState({
      pagenumber: pagenumber
    });
    if (this.state.searchfor === "") this.getproprties(pagenumber - 1, 5);
    else {
      this.searchAcceptation(
        pagenumber - 1,
        5,
        this.state.searchby,
        this.state.searchfor
      );
    }
  };
  selectBefore = (
    <Select
      onChange={value => this.setState({ searchby: value })}
      defaultValue="code"
      style={{ width: 150 }}
    >
      <Option value="code">Code acceptation</Option>
      <Option value="nom">Nom assuré</Option>
      <Option value="prenom">Prenom assuré</Option>
      <Option value="numeroContrat">N° contrat</Option>
    </Select>
  );
  search = value => {
    this.setState({ pagenumber: 1, searchfor: value });
    this.searchAcceptation(
      this.state.pagenumber - 1,
      5,
      this.state.searchby,
      value
    );
  };
  render() {
    return (
      <div>
        <ComponentTitle title="Gestion Acceptation" />
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Entrez le text de recherche"
            addonBefore={this.selectBefore}
            onSearch={value => this.search(value)}
            enterButton
            style={{ width: 600 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={this.state.acceptations}
          pagination={{
            onChange: this.onPaginationChange,
            pageSize: 5,
            total: this.state.totalItems,
            current: this.state.pagenumber
          }}
        />
      </div>
    );
  }
}
export default GestionAcceptation;
