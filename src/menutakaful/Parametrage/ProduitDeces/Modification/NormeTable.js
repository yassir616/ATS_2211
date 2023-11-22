/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
  Tag
} from "antd";
import React, { Component } from "react";
import { getNormeById, updateNorme } from "../ProduitDecesAPI";

const { Option } = Select;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "Tests Medical") {
      return (
        <Select mode="multiple" style={{ width: "100%" }} labelInValue>
          {this.props.honoraire.map(element => {
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
      testsMedical,
      children,
      ...restProps
    } = this.props;
    if (editing && title === "Tests Medical") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("honoraires", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: testsMedical
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing) {
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
    } else return <td {...restProps}>{children}</td>;
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}
class NormeTable extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "", testsMedical: [] };
    this.columns = [
      {
        title: "Age min",
        dataIndex: "ageMin",
        editable: true
      },
      {
        title: "Age max",
        dataIndex: "ageMax",
        editable: true
      },
      {
        title: "Capital min",
        dataIndex: "capitalMin",
        editable: true
      },
      {
        title: "Capital max",
        dataIndex: "capitalMax",
        editable: true
      },
      {
        title: "Tests Medical",
        dataIndex: "honoraires",
        editable: true,
        render: honoraires => (
          <span>
            {honoraires.map(tag => {
              let color = "volcano";
              return (
                <Tag color={color} key={tag}>
                  {tag.code.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "operation",
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
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Fermer</a>
              </Popconfirm>
            </span>
          ) : (
            <a
              disabled={editingKey !== ""}
              onClick={() => this.edit(record.key)}
            >
              Modifier
            </a>
          );
        }
      }
    ];
  }

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
        let honoraire = [];
        let honoraireList = [];
        row.honoraires.forEach(element => {
          honoraire.push({ id: element.key, libelle: element.label });

          honoraireList.push({ id: element.key });
        });
        delete row.honoraires;
        let myRow = { ...row, honoraires: honoraire };

        newData.splice(index, 1, {
          ...item,
          ...myRow
        });
        const request = {
          ageMin: row.ageMin,
          ageMax: row.ageMax,
          capitalMin: row.capitalMin,
          capitalMax: row.capitalMax,
          honoraires: honoraireList
        };
        this.setState({ data: newData, editingKey: "" });
        this.updateNormes(item.id, request);
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  updateNormes = (id, Data) => {
    updateNorme(id, Data)
      .then(response => {
        if (response.status === 200) {
          notification.success({
            message: "Les normes sont  bien modifiées."
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

  edit(key) {
    this.setState({ editingKey: key });
    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      let tests = [];
      item.honoraires.forEach(element => {
        tests.push({
          key: element.id,
          value: element.id,
          label: element.libelle
        });
      });

      this.setState({ testsMedical: [...tests] });
    }
  }

  rechercheNorme = id => {
    getNormeById(id)
      .then(response => {
        let newDataList = [];
        response.data.forEach(element => {
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
    console.log(this.props.record);
    this.rechercheNorme(this.props.record.id);
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
      } else
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.title,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
            honoraire: this.props.honoraire,
            testsMedical: this.state.testsMedical
          })
        };
    });
    return (
      <div>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              hideOnSinglePage: true,
              defaultPageSize: 50
            }}
          />
        </EditableContext.Provider>
      </div>
    );
  }
}
export default Form.create({ name: "global_state" })(NormeTable);
