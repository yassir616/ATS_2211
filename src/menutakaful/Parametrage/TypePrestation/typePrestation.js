/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Form, Input, notification, Popconfirm, Table } from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import AjoutTypePrestation from "./AjoutTypePrestation";
import { getPrestation, updatePrestation } from "./PrestationAPI";
import { getColumnSearchProps } from "../ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
const EditableContext = React.createContext();

class TypePrestation extends Component {
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
        title: "Code",
        dataIndex: "code",
        key: "code",
        width: "25%",
        editable: true,
        ...getColumnSearchProps("code", "code", this)
      },
      {
        title: "Libelle",
        dataIndex: "libelle",
        key: "libelle",
        width: "25%",
        editable: true,
        ...getColumnSearchProps("libelle", "libelle", this)
      },
      {
        title: "Nom",
        dataIndex: "name",
        key: "name",
        width: "25%",
        editable: true,
        ...getColumnSearchProps("name", "name", this)
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
  updatePrestation = (id, prestationData) => {
    updatePrestation(id, prestationData)
      .then(response => {})
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
  recherchePrestation = () => {
    getPrestation()
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
    this.recherchePrestation();
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
        this.updatePrestation(item.id, row);
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
          inputType: col.dataIndex === "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <div>
        <ComponentTitle title="Gestion des prestations" />
        <AjoutTypePrestation />
        <EditableContext.Provider value={this.props.form}>
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
export default Form.create()(TypePrestation);
