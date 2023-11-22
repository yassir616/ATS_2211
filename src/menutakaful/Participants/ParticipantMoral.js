/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import {
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Table
} from "antd";
import React, { Component } from "react";
import AddPerMorale from "../Production Prestations/Souscription/StepOne/AddPerMorale/AddPerMorale";
import {
  getallPersonMorale,
  getAllSecteurActivite,
  getVois,
  getAllTypePersonneMorales,
  getProfession,
  getSetuation,
  getSexe,
  deletePerMrale,
  updatePersonneMorale
} from "./ParticipantAPI";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { currencyFormatter, currencyParser } from "../../util/Helpers";

const EditableContext = React.createContext();

class ParticipantMoral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: "",
      rowSelection: "",
      searchText: "",
      searchedColumn: "",
      sexe: [],
      setuations: [],
      professions: [],
      SecteurActivite: [],
      typePersonneMoral: [],
      dataloaded: false,
      vois: []
    };
    this.columns = [
      {
        title: "Abréviation",
        dataIndex: "abb",
        key: "abb",
        width: "25%",
        editable: true,
        ...getColumnSearchProps("abb", "abb", this)
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        width: "25%",
        editable: true,
        ...getColumnSearchProps("code", "code", this)
      },
      {
        title: "Raison Sociale",
        dataIndex: "raisonSociale",
        key: "raisonSociale",
        width: "20%",
        editable: true,
        ...getColumnSearchProps("raisonSociale", "raisonSociale", this)
      },
      {
        title: "Opérations",
        align: "center",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="#top"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Enregistrer
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a href="#top">Fermer</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a
                href="#top"
                disabled={editingKey !== ""}
                onClick={() => {
                  this.edit(record.key);
                }}
              >
                <Icon
                  type="edit"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a href="#top" style={{ color: "red" }}>
                  <Icon
                    type="user-delete"
                    style={{ color: "rgb(208, 62, 62)", fontSize: "25px" }}
                  />
                </a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];
  }
  async getproprties() {
    let gander = await getSexe();
    let setuation = await getSetuation();
    let profrssionResponse = await getProfession();
    let vois = await getVois();
    let typePersonneMoraleResponse = await getAllTypePersonneMorales();
    let secteurActiviteResponse = await getAllSecteurActivite();
    this.setState({
      sexe: [...gander.data],
      setuations: [...setuation.data],
      dataloaded: true,
      professions: [...profrssionResponse.data.content],
      typePersonneMoral: [...typePersonneMoraleResponse.data],
      secteurActivite: [...secteurActiviteResponse.data.content],
      vois: [...vois.data]
    });
  }
  handlePersonMoraleCreationSousctipteur = data => {};
  componentDidMount() {
    this.getproprties();
    let listpersons = [];
    getallPersonMorale().then(response => {
      response.data.content.forEach(element => {
        let person = { ...element, ...{ key: element.id } };
        listpersons.push(person);
      });
    });
    this.setState({
      data: listpersons
    });
  }

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
  handleDelete = key => {
    this.deleteParticipant(key);
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };

  isEditing = record => record.key === this.state.editingKey;

  handlePersonphyCreationAssure = data => {};

  cancel = () => {
    this.setState({ editingKey: "" });
  };
  async deleteParticipant(id) {
    try {
      let response = await deletePerMrale(id);
      if (response.status === 200) {
        notification.success({
          message: "participant bien supprimé !"
        });
      }
    } catch (err) {
      notification.error({
        message: "Takaful",
        description:
          err.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }
  updatePer = (id, perData) => {
    updatePersonneMorale(id, perData)
      .then(response => {
        if (response.status === 200) {
          notification.success({
            message: "participant bien modifier !"
          });
        }
      })
      .catch(error => {
        notification.error({
          message: "Takaful",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  };
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.updatePer(item.id, { ...item, ...row });

        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });
    return (
      <div>
        <EditableContext.Provider value={this.props.form}>
          {this.state.dataloaded && (
            <AddPerMorale
              titre="Création d'un nouveau Participant"
              typePersonneMoral={this.state.typePersonneMoral}
              secteurActivite={this.state.secteurActivite}
              vois={this.state.vois}
              personCreation={this.handlePersonMoraleCreationSousctipteur}
            />
          )}
          <Table
            bordered
            rowClassName="editable-row"
            components={components}
            columns={columns}
            dataSource={this.state.data}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 5,
              onChange: this.cancel
            }}
          />
        </EditableContext.Provider>
      </div>
    );
  }
}

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return (
        <InputNumber formatter={currencyFormatter} parser={currencyParser} />
      );
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}
export default Form.create()(ParticipantMoral);
