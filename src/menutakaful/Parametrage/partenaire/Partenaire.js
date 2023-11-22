import { Form, Input, notification, Popconfirm, Table } from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { getColumnSearchProps } from "../ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { CreatePartenaire } from "./CreatePartenaire";
import { getAllPartenaire, updatePartenaire } from "./PartenaireAPI";

const EditableContext = React.createContext();

class Partenaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: "",
      rowSelection: "",
      searchText: "",
      searchedColumn: ""
    };
    this.columns = [
      {
        title: "Raison Sociale",
        dataIndex: "raisonSocial",
        key: "raisonSocial",
        editable: true,
        ...getColumnSearchProps("raisonSocial", "Raison Sociale", this)
      },
      {
        title: "Abreviation",
        dataIndex: "code",
        key: "code",
        editable: true,
        ...getColumnSearchProps("code", "Abreviation", this)
      },
      {
        title: "Siège social",
        dataIndex: "siegeSocial",
        key: "siegeSocial",
        editable: true,
        ...getColumnSearchProps("siegeSocial", "Siège social", this)
      },
      {
        title: "Téléphone",
        dataIndex: "telephone",
        key: "telephone",
        editable: true,
        ...getColumnSearchProps("telephone", "Téléphone", this)
      },
      {
        title: "RIB",
        dataIndex: "numeroCompte",
        key: "numeroCompte",
        editable: true,
        ...getColumnSearchProps("numeroCompte", "Numéro compte", this)
      },
      {
        title: "Type intermédiaire",
        dataIndex: "typePartenaire",
        key: "typePartenaire",
        editable: true,
        ...getColumnSearchProps("typePartenaire", "secteur d activite", this)
      },
      {
        title: "Commission",
        dataIndex: "fraisAcquisition",
        key: "fraisAcquisition",
        editable: true,
        ...getColumnSearchProps("fraisAcquisition", "Commission", this)
      },
      {
        title: " Taux TVA ",
        dataIndex: "tva",
        key: "tva",
        editable: true,
        ...getColumnSearchProps("tva", "TVA", this)
      },
      {
        title: "Opérations",
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
                Modifier
              </a>
            </span>
          );
        }
      }
    ];
  }

  updatePartenaires = (id, partenaireData) => {
    updatePartenaire(id, partenaireData)
      .then(response => {})
      .catch(error => {
        if (error.status === 401) {
          notification.error({
            message: "Takaful",
            description:
              "Votre login ou mot de passe est incorrecte. Veuillez réessayer!"
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

  recherchePartenaire = () => {
    getAllPartenaire()
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
              "Votre login ou mot de passe est incorrecte. Veuillez réessayer!"
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

  componentDidMount() {
    this.recherchePartenaire();
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

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
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
        this.updatePartenaires(item.id, row);
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
          inputType: col.dataIndex === "typePartenaire" ? "role" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <div>
        <ComponentTitle title="Gestion des intermédiaire" />
        <EditableContext.Provider value={this.props.form}>
          <CreatePartenaire />
          <Table
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

export default Form.create()(Partenaire);
