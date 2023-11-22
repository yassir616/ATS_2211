/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  DatePicker,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
  Icon
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import {
  getAcceptationReassuranceByAcceptation,
  updateAcceptationReassurance
} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "Verdict") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.verdicts.map(element => {
            return (
              <Option value={element.id} label={element.status}>
                {element.status}
              </Option>
            );
          })}
        </Select>
      );
    } else if (
      this.props.inputType === "Date réception" ||
      this.props.inputType === "Date reassurance"
    ) {
      return <DatePicker className="date-style"></DatePicker>;
    } else if (
      this.props.inputType === "Observation" ||
      this.props.inputType === "Observation verdict"
    ) {
      return <TextArea rows={2} />;
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
    if (editing && title === "Observation") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("observation", {
              rules: [
                {
                  // required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Observation verdict") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("observationVerdict", {
              rules: [
                {
                  // required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Verdict") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("verdict", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: {
                key: record[dataIndex].id,
                label: record[dataIndex].status
              }
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Date reassurance") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateReassurance", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: moment(record[dataIndex])
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Date réception") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateReception", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: moment(record[dataIndex])
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Taux de Surprime") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("tauxSurprime", {
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
    } else if (editing && title === "Motif") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("motif", {
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
class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: "" };
    this.columns = [
      {
        title: "Date réception",
        dataIndex: "dateReception",
        editable: true,
        render: dateConsultation => (
          <span>{moment(dateConsultation).format("YYYY-MM-DD")}</span>
        )
      },
      {
        title: "Date reassurance",
        dataIndex: "dateReassurance",
        editable: true,
        render: dateConsultation => (
          <span>{moment(dateConsultation).format("YYYY-MM-DD")}</span>
        )
      },
      {
        title: "Observation",
        dataIndex: "observation",
        editable: true
      },
      {
        title: "Taux de Surprime",
        dataIndex: "tauxSurprime",
        editable: true
      },
      {
        title: "Verdict",
        dataIndex: "verdict",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.status}</span>
      },

      {
        title: "Observation verdict",
        dataIndex: "observationVerdict",
        editable: true
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
                title="êtes-vous certain de vouloir annuler??"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Annuler</a>
              </Popconfirm>
            </span>
          ) : (
            <a
              disabled={editingKey !== ""}
              onClick={() => this.edit(record.key)}
            >
              <Icon
                type="edit"
                style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
              />
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

        row.dateReassurance = row.dateReassurance.format("YYYY-MM-DD");
        row.dateReception = row.dateReception.format("YYYY-MM-DD");
        row.tauxSurprime = parseFloat(row.tauxSurprime);
        row.verdict = { id: row.verdict.key, status: row.verdict.label };

        newData.splice(index, 1, {
          ...item,
          ...row
        });

        this.setState({ data: newData, editingKey: "" });

        this.updateReassurance(item.id, { ...item, ...row });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  updateReassurance = (id, Data) => {
    updateAcceptationReassurance(id, Data)
      .then(response => {
        if (response.status === 200) {
          notification.success({
            message: "acceptation reassurance bien modifier !"
          });
        }
      })
      .catch(error => {
        if (error.response.data.message === "wrong data") {
          notification.error({
            message: "acception reassurance ne ce trouve pas"
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              "Désolé! Quelque chose a mal tourné. Veuillez réessayer!"
          });
        }
      });
  };
  edit(key) {
    this.setState({ editingKey: key });
  }

  async acceptationsSpecialiste(id) {
    let Response = await getAcceptationReassuranceByAcceptation(id);
    let newDataList = [];
    for (const element of Response.data) {
      let key = { key: element.id };
      let elementone = { ...element, ...key };
      newDataList.push(elementone);
    }

    this.setState({
      data: [...newDataList]
    });
  }

  componentDidMount() {
    this.acceptationsSpecialiste(this.props.record.id);
  }
  componentDidUpdate(prevProps, _) {
    if (this.props.dataTable !== prevProps.dataTable) {
      let list = [...this.state.data];

      list.push(this.props.dataTable);
      this.setState({ data: [...list] });
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
      } else
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.title,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
            produit: this.props.record.contrat.produit,
            verdicts: this.props.verdicts
          })
        };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 50
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const ReassuranceTable = Form.create()(EditableTable);

export default ReassuranceTable;
