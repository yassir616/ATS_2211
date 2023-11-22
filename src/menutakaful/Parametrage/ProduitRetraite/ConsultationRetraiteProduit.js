import "./ConsultationRetraiteProduit.css";
import "antd/dist/antd.css";
import { Button, Divider, Form, Icon, Table,notification } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import Details from "./Details/Details";
import { getColumnSearchProps } from "./ProduitRetraiteServices/getColumnSearchProps";
import { getAllPointVente } from "../pointvente/PointVenteAPI";
import { getExclusion } from "../../EchangeFichiersInformatiques/EchangeFileAPI";
import { getPeriodicite } from "../../GestionContrats/ContratsAPI";
import { getRetraiteProduit } from "./ProduitRetraiteAPI";
import { getCategorie, getRisque } from "../ProduitDeces/ProduitDecesAPI";

export const MyContext = React.createContext();

class ConsultationRetraiteProduit extends Component {
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
      categories: [],
    };
    this.columns = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        ...getColumnSearchProps("code", "Code", this),
      },
      {
        title: "Libelle",
        dataIndex: "libelle",
        key: "libelle",
        ...getColumnSearchProps("libelle", "Libelle", this),
      },
      {
        title: "Date création",
        dataIndex: "creationDate",
        key: "creation_date",
        ...getColumnSearchProps("creationDate", "Date creation", this),
      },
      {
        title: "Risque ",
        dataIndex: "risque.libelle",
        key: ["risque", "risque_id"],
        ...getColumnSearchProps("risque.libelle", "risque ", this),
      },
      {
        title: "Catégorie ",
        dataIndex: "categorie.libelle",
        key: ["categorie", "categorie_id"],
        ...getColumnSearchProps("categorie.libelle", "categorie ", this),
      },
      {
        title: "Date modification ",
        dataIndex: "dateModification",
        key: "dateModification",
        ...getColumnSearchProps("dateModification", "dateModification ", this),
      },
      {
        title: "Opérations",
        align: "center",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <Link
                to={{
                  pathname: "/ModificationRetraiteProduit",
                  state: { record: record },
                }}
              >
                {/* Modifier */}
                <Icon
                  type="edit"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </Link>
              <Divider type="vertical" />

              <a onClick={() => this.handleClick(record)}>
                <Icon
                  type="profile"
                  style={{ color: "rgb(109, 143, 204)", fontSize: "25px" }}
                />
              </a>
            </span>
          );
        },
      },
    ];
  }
  componentDidMount() {
    this.getAllPeriodicite(this);
    this.getAllExclusion(this);
    this.getAllPointVentes(this);
    this.getAllRisque(this);
    this.getAllCategorie(this);
    this.rechercheRetraiteProduit(this);
  }

rechercheRetraiteProduit = async (context) => {
  getRetraiteProduit()
    .then((response) => {
      let newDataList = [];
      response.data.content.forEach((element) => {
        let key = { key: element.id };
        element = { ...element, ...key };
        newDataList.push(element);
      });
      context.setState({
        data: newDataList,
      });
    })
    .catch((error) => {
      if (error.status === 401) {
        notification.error({
          message: "Takaful",
          description:
            "Votre login ou mot de passe est incorrect. Veuillez réessayer!",
        });
      } else {
        notification.error({
          message: "Takaful",
          description:
            error.message ||
            "Désolé! Quelque chose s'est mal passé Veuillez réessayer!",
        });
      }
    });
};

getAllExclusion = async (context) => {
      let response = await getExclusion();
      context.setState({
        exclusion: response.data.content,
      });
    };
getAllRisque = async (context) => {
  let response = await getRisque();
  context.setState({
    risques: response.data.content,
  });
};

getAllPointVentes = async (context) => {
  let response = await getAllPointVente();
  context.setState({
    pointVente: response.data.content,
  });
};
  getAllCategorie = async (context) => {
    let response = await getCategorie();
    context.setState({
      categories: response.data.content,
    });
  };
  getAllPeriodicite = async (context) => {
    let response = await getPeriodicite();
    context.setState({
      periodicite: response.data.content,
    });
  };
  handleClick = (value) => {
    this.setState({ visible: true, isEdit: true, record: value });
  };
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  onClose = () => {
    this.setState({
      isEdited: false,
    });
  };

  render() {
    return (
      <div>
        <MyContext.Provider
          value={{
            state: this.state.record,
          }}
        >
          {this.state.isEdit ? (
            <Details />
          ) : (
            <div>
              <ComponentTitle title="Paramétrage produit retraite" />
              <Button type="primary" className="add-button nouveau-btn">
                <Link to="/produitRetraite">
                  <Icon type="plus" /> Nouveau produit retraite
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

export default Form.create()(ConsultationRetraiteProduit);
