/* eslint-disable react/prop-types */
import "./ConsultProduitDeces.css";
import "antd/dist/antd.css";

import { Button, Divider, Form, Icon, notification, Table } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import Details from "./Details";
import { getAllPointVente } from "../pointvente/PointVenteAPI";
import {
  getCategorie,
  getDecesProduit,
  getRisque,
  updateDecesProduct
} from "./ProduitDecesAPI";
import { getExclusion } from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import { getColumnSearchProps } from "../ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { getPeriodicite } from "../../GestionContrats/ContratsAPI";

export const MyContext = React.createContext();

let exclus = [];
let periodicts = [];
let points = [];
class ConsultProduitDeces extends Component {
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
      isEdit: false,
      isEdited: false,
      periodicite: [],
      exclusion: [],
      pointVente: [],
      risques: [],
      categories: []
    };
    this.columns = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        ...getColumnSearchProps("code", "Code", this)
      },
      {
        title: "Libellé",
        dataIndex: "libelle",
        key: "libelle",
        ...getColumnSearchProps("libelle", "Libelle", this)
      },
      {
        title: "Date création",
        dataIndex: "creationDate",
        key: "creation_date",
        ...getColumnSearchProps("creationDate", "Date creation", this)
      },
      {
        title: "Risque ",
        dataIndex: "risque.libelle",
        key: "risque",
        ...getColumnSearchProps("risque", "risque", this)
      },
      {
        title: "Catégorie ",
        dataIndex: "categorie.libelle",
        key: "categorie",
        ...getColumnSearchProps("categorie", "Categorie", this)
      },
      {
        title: "Date modification ",
        dataIndex: "dateModification",
        key: "dateModification",
        ...getColumnSearchProps("dateModification", "dateModification", this)
      },

      {
        title: "Opérations",
        align: "center",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <Link
                to={{ pathname: "/Modification", state: { record: record } }}
              >
                <Icon
                  type="edit"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </Link>
              <Divider type="vertical" />
              <a href="#top" onClick={() => this.handleClick(record)}>
                <Icon
                  type="profile"
                  style={{ color: "rgb(109, 143, 204)", fontSize: "25px" }}
                />
              </a>
              <Divider type="vertical" />
            </span>
          );
        }
      }
    ];
  }
  componentDidMount() {
    this.getAllPeriodicite();
    this.getAllExclusion();
    this.getAllPointVentes();
    this.getAllRisque();
    this.getAllCategorie();
    this.rechercheDecesProduit();
  }
  async getAllRisque() {
    let response = await getRisque();

    this.setState({
      risques: response.data.content
    });
  }
  async getAllCategorie() {
    let response = await getCategorie();

    this.setState({
      categories: response.data.content
    });
  }
  async getAllPeriodicite() {
    let response = await getPeriodicite();

    this.setState({
      periodicite: response.data.content
    });
  }
  async getAllExclusion() {
    let response = await getExclusion();

    this.setState({
      exclusion: response.data.content
    });
  }
  async getAllPointVentes() {
    let response = await getAllPointVente();
    this.setState({
      pointVente: response.data.content
    });
  }
  rechercheDecesProduit = () => {
    getDecesProduit()
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

  handleClick = value => {
    this.setState({ visible: true, isEdit: true, record: value });
  };
  handleClicked = value => {
    this.setState({ isEdited: true, keyRecord: value.id });
    exclus = [];
    periodicts = [];
    points = [];

    value.exclusions.map(element => {
      return exclus.push(element.id);
    });
    value.periodicites.map(element => {
      return periodicts.push(element.id);
    });
    value.pointVentes.map(element => {
      return points.push(element.id);
    });
    this.props.form.setFieldsValue({
      risqueId: value.risque.id,
      categorieId: value.categorie.id,
      code: value.code,
      libelle: value.libelle,
      differeMin: value.differeMin,
      differeMax: value.differeMax,
      ageMin: value.ageMin,
      ageMax: value.ageMax,
      montantAccessoire: value.montantAccessoire,
      taxe: value.taxe,
      fraisGestion: value.fraisGestion,
      fraisAcquisition: value.fraisAcquisition,
      codeExoneration: value.codeExoneration
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
  onClose = () => {
    this.setState({
      isEdited: false
    });
  };
  async updateproduct(id, body) {
    try {
      let response = await updateDecesProduct(id, body);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la modification est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message ||
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let exclu = [];
        values.exclusions.forEach(element => {
          exclu.push({ id: element });
        });
        values.exclusions = [...exclu];

        let period = [];
        values.periodicites.forEach(element => {
          period.push({ id: element });
        });
        values.periodicites = [...period];

        let pointV = [];
        values.pointVentes.forEach(element => {
          pointV.push({ id: element });
        });
        values.pointVentes = [...pointV];

        this.updateproduct(this.state.keyRecord, values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    return (
      <div>
        <MyContext.Provider
          value={{
            state: this.state.record
          }}
        >
          {this.state.isEdit ? (
            <Details />
          ) : (
            <div>
              <ComponentTitle title="Paramétrage produit" />
              <Button type="primary" className="add-button nouveau-btn">
                <Link to="/produitDeces">
                  <Icon type="plus" /> Nouveau produit
                </Link>
              </Button>
              <Table
                bordered
                rowClassName="editable-row"
                columns={this.columns}
                dataSource={this.state.data}
                pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
              />
            </div>
          )}
        </MyContext.Provider>
      </div>
    );
  }
}

export default Form.create()(ConsultProduitDeces);
