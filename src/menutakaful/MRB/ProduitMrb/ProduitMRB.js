import "antd/dist/antd.css";
import { Button, Divider, Form, Icon, Table } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import ProduitMRBDetails from "./ProduitMRBDetails.js";
import { getAllProductMrb, getTarificationsMrb } from "./ProduitMRBAPI";
import { getColumnSearchProps } from "../../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";

export const MyContext = React.createContext();
class ProduitMRB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isEdited: false,
      tarificationMrb: []
    };
    this.columns = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        ...getColumnSearchProps("code", "Code", this)
      },
      {
        title: "Libelle",
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
     /*  {
        title: "Nature Assuré ",
        dataIndex: "natureAssure",
        key: "natureAssure",
        ...getColumnSearchProps("natureAssure", "natureAssure", this)
      },
      {
        title: "Nature du participant",
        dataIndex: "natureParticipant",
        key: "natureParticipant",
        ...getColumnSearchProps("natureParticipant", "natureParticipant", this)
      }, */
      {
        title: "Partenaire",
        dataIndex: "partenaire.raisonSocial",
        key: "partenaireId",
        ...getColumnSearchProps("partenaireId", "partenaireId", this)
      },
      {
        title: "Opérations",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <Link
                to={{
                  pathname: "/ModifieProduitMRB",
                  state: { record: record }
                }}
              >
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
              <Divider type="vertical" />
            </span>
          );
        }
      }
    ];
  }
  componentDidMount() {
    this.getProductMrb();
  }

  async getProductMrb() {
    let response = await getAllProductMrb();
    this.setState({
      data: response.data.content
    });
  }

  handleClick = value => {
    this.setState({ record: value, isEdited: true });
    this.getTarificationMrb(value.id);
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  onClose = () => {
    this.setState({
      isEdited: false
    });
  };

  async getTarificationMrb(idproduct) {
    let response = await getTarificationsMrb(idproduct);
    this.setState({
      tarificationMrb: response.data.content
    });
  }

  render() {
    return (
      <div>
        <MyContext.Provider
          value={{
            state: this.state.record,
            record: this.state.tarificationMrb
          }}
        >
          {this.state.isEdited ? (
            <ProduitMRBDetails />
          ) : (
            <div>
              <ComponentTitle title="Paramétrage produit MRB" />
              <Button type="primary" className="add-button">
                <Link to="/AjoutProduit">
                  <Icon type="plus" /> Nouveau produit MRB
                </Link>
              </Button>
              <Table
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
export default Form.create()(ProduitMRB);
