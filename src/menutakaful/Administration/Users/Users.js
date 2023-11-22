/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Divider,
  Form,
  Icon,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
  Tag
} from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import AddUserForm from "./AddUserForm";
import {
  getAllRoles,
  deleteUser,
  updateUser,
  getUsers
} from "../AdministartionAPI";
import { getAllPointVente } from "../../Parametrage/pointvente/PointVenteAPI";
import { getColumnSearchProps } from "../../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";

const EditableContext = React.createContext();

let roles = [];
let rolesUser = [];
let pointventes = [];
let pointventesdata = [];

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      rolesloaded: false,
      editingKey: "",
      rowSelection: "",
      searchText: "",
      searchedColumn: ""
    };
    this.columns = [
      {
        title: "Prénom",
        dataIndex: "firstName",
        key: "firstName",
        editable: true,
        ...getColumnSearchProps("firstName", "LibfirstNameelle", this)
      },
      {
        title: "Nom",
        dataIndex: "lastName",
        key: "lastName",
        editable: true,
        ...getColumnSearchProps("lastName", "nom", this)
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        editable: true,
        ...getColumnSearchProps("email", "email", this)
      },
      {
        title: "Rôles",
        align: "center",
        key: "roles",
        dataIndex: "roles",
        editable: true,
        width: "15%",
        render: roles => (
          <span>
            {roles.map(tag => {
              let color = tag.name.length > 10 ? "geekblue" : "green";
              if (tag.name === "ADMIN") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.name.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Agences",
        align: "center",
        key: "pointVentes",
        dataIndex: "pointVentes",
        editable: true,
        width: "15%",
        render: pointVentes => (
          <span>
            {pointVentes.map(tag => {
              let color = tag.libelle.length > 6 ? "geekblue" : "green";
              if (tag.libelle.length > 15) color = "volcano";
              return (
                <Tag color={color} key={tag}>
                  {tag.libelle.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Opérations",
        align: "center",
        dataIndex: "operation",
        width: "15%",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Enregistrer
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="est ce que vous etes sur d'annuler l'operation ?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Annuler</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a
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
                title="est ce que vous etes sur de supprimer l'utilisateur?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a disabled={editingKey !== ""} style={{ color: "red" }}>
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

    this.rechercheUsers = this.rechercheUsers.bind();
  }

  async getRoles() {
    let response = await getAllRoles();
    let pointvente = await getAllPointVente();
    pointventes = [...pointvente.data.content];
    roles = [...response.data.content];
    this.setState({ rolesloaded: true });
  }

  updateUser = (id, userData) => {
    updateUser(id, userData)
      .then(response => {
        if (response.status === 200) {
          notification.success({
            message: "Utilisateur bien modifier !"
          });
        }
      })
      .catch(error => {
        if (error.response.data.message === "user already exists") {
          notification.error({
            message: "Un utilisateur est déja inscrit par cette adress mail."
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  };

  async deleteTakafulUser(id) {
    try {
      let response = await deleteUser(id);
      if (response.status === 200) {
        notification.success({
          message: "Utilisateur bien supprimé !"
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

  rechercheUsers = () => {
    getUsers()
      .then(response => {
        console.log("response.data", response.data.content);
        let newDataList = [];
        let myDataList = [];
        this.props.currentUser.roles.forEach(element1 => {
          if (element1.name === "ADMIN") {
            response.data.content.forEach(element => {
              let key = { key: element.id };
              element = { ...element, ...key };
              newDataList.push(element);
            });
            this.setState({
              data: newDataList
            });
          } else {
            this.props.currentUser.pointVentes.forEach(actualPointVente => {
              response.data.content.forEach(elementUser => {
                elementUser.pointVentes.forEach(pointVente => {
                  if (pointVente.partenairepv.code === actualPointVente.partenairepv.code) {
                    myDataList.push(elementUser);
                  }
                });
              });
            });

            myDataList.forEach(newElement => {
              let key = { key: newElement.id };
              newElement = { ...newElement, ...key };
              newDataList.push(newElement);
            });

            this.setState({
              data: newDataList
            });

          }
        });
      })
      .catch(error => {
        if (error.status === 401) {
          notification.error({
            message: "Takaful",
            description:
              "Your Username or Password is incorrect. Please try again!"
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  };

  componentDidMount() {
    this.rechercheUsers();
    this.getRoles();
  }

  handleDelete = key => {
    this.deleteTakafulUser(key);
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
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
        let helparray = { ...row };
        helparray.roles = [];
        helparray.pointVentes = [];
        row.pointVentes.forEach(element => {
          helparray.pointVentes.push({
            id: element.key,
            libelle: element.label
          });
        });
        row.roles.forEach(element => {
          helparray.roles.push({ name: element });
        });
        newData.splice(index, 1, {
          ...item,
          ...helparray
        });
        this.updateUser(item.id, helparray);
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      rolesUser = [];
      pointventesdata = [];
      item.roles.forEach(element => {
        rolesUser.push(element.name);
      });
      item.pointVentes.forEach(element => {
        pointventesdata.push({ key: element.id, label: element.libelle });
      });
    }
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
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });
    return (
      <div>
        <ComponentTitle title="Gestion des utilisateurs" />
        <EditableContext.Provider value={this.props.form}>
          {this.state.rolesloaded && (
            <AddUserForm Roles={roles} Pointvente={pointventes} />
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
const { Option } = Select;

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "roles") {
      return (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="cliquez pour ajouter un profile"
          onChange={this.handleChange}
          optionLabelProp="label"
        >
          {roles.map(element => {
            return (
              <Option
                key={element.name}
                value={element.name}
                label={element.name}
              >
                {element.name}
              </Option>
            );
          })}
        </Select>
      );
    } else if (this.props.inputType === "pointVentes") {
      return (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="cliquez pour ajouter une agence"
          labelInValue
        >
          {pointventes.map(element => {
            return (
              <Option
                key={element.id}
                value={element.id}
                label={element.libelle}
              >
                {element.libelle}
              </Option>
            );
          })}
        </Select>
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
    if (editing && dataIndex !== "roles" && dataIndex !== "pointVentes") {
      return (
        <td {...restProps}>
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
        </td>
      );
    } else if (editing && dataIndex === "roles") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: rolesUser
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && dataIndex === "pointVentes") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: pointventesdata
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else return <td {...restProps}>{children}</td>;
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}
export default Form.create()(Users);
