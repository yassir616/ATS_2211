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
  Tag,
  Icon
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { LABORATOIRE } from "../../../../../constants/index";
import {
  getAcceptationlaboByAcceptation,
  getAcceptationlaboByAcceptationsLaboratoire,
  updateAcceptationTestMedical
} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "laboratoire") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.laboratoires.map(element => {
            return (
              <Option key={element.id} value={element.id} label={element.nom}>
                {element.nom}
              </Option>
            );
          })}
        </Select>
      );
    } else if (
      this.props.inputType === "date analyse" ||
      this.props.inputType === "date réception"
    ) {
      return <DatePicker className="date-style"></DatePicker>;
    } else if (this.props.inputType === "Tests Medical") {
      let array = [];
      this.props.produit.normes.forEach(norme => {
        norme.honoraires.forEach(honoraire => {
          if (honoraire.typeAuxiliaireHon.libelle === LABORATOIRE) {
            array.push({ value: honoraire.id, label: honoraire.libelle });
          }
        });
      });
      return (
        <Select mode="multiple" style={{ width: "100%" }} labelInValue>
          {array.map(element => {
            return (
              <Option
                key={element.id}
                value={element.value}
                label={element.label}
              >
                {element.label}
              </Option>
            );
          })}
        </Select>
      );
    }
    return <TextArea rows={2} />;
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
    } else if (editing && title === "observations") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("observations", {
              rules: [
                {
                  // required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex][title]
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "laboratoire") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("laboratoire", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: {
                key: record[dataIndex].laboratoire.id,
                label: record[dataIndex].laboratoire.nom
              }
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "date réception") {
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
              initialValue: moment(record[dataIndex].dateReception)
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "date analyse") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateAnalyse", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: moment(record[dataIndex].dateAnalyse)
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
    this.state = { data: [], editingKey: "", testsMedical: [] };
    this.columns = [
      {
        title: "laboratoire",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.laboratoire.nom}</span>
        )
      },
      {
        title: "date analyse",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.dateAnalyse}</span>
      },
      {
        title: "date réception",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.dateReception}</span>
        )
      },
      {
        title: "observations",
        dataIndex: "acceptationLaboratoire",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.observations}</span>
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
                  {tag.libelle.toUpperCase()}
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
        let honoraire = [];
        row.honoraires.forEach(element => {
          honoraire.push({ id: element.key, libelle: element.label });
        });
        delete row.honoraires;

        // Convert FormatDate (dateAnalyse,dateReception)
        row.dateAnalyse = row.dateAnalyse.format("DD-MM-YYYY");
        row.dateReception = row.dateReception.format("DD-MM-YYYY");

        row.laboratoire = {
          id: row.laboratoire.key,
          nom: row.laboratoire.label
        };
        let myRow = {
          acceptationLaboratoire: { ...item.acceptationLaboratoire, ...row },
          honoraires: honoraire
        };

        newData.splice(index, 1, {
          ...item,
          ...myRow
        });

        this.setState({ data: newData, editingKey: "" });

        this.updateTestMedical(item.id, { ...item, ...myRow });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  updateTestMedical = (id, Data) => {
    updateAcceptationTestMedical(id, Data)
      .then(response => {
        if (response.status === 200) {
          notification.success({
            message: "acceptation laboratoire bien modifier !"
          });
        }
      })
      .catch(error => {
        if (error.response.data.message === "wrong data") {
          notification.error({
            message: "acception laboratoire ne ce trouve pas"
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

    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      let tests = [];

      // Convert FormatDate (dateAnalyse,dateReception)
      item.acceptationLaboratoire.dateAnalyse = moment(item.acceptationLaboratoire.dateAnalyse,'DD-MM-YYYY').format( "YYYY-MM-DD");
      item.acceptationLaboratoire.dateReception = moment(item.acceptationLaboratoire.dateReception,'DD-MM-YYYY').format( "YYYY-MM-DD");

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

  async acceptationsLabo(id) {
    let Response = await getAcceptationlaboByAcceptation(id);
    console.log("response data = ");
    console.log(Response.data);
    let newDataList = [];

    for (const element of Response.data) {
      let responseAcc = await getAcceptationlaboByAcceptationsLaboratoire(
        id,
        element.id
      );

      let key = { key: responseAcc.data.id };
      let elementone = { ...responseAcc.data, ...key };
      newDataList.push(elementone);
    }
    this.setState({
      data: [...newDataList]
    });
  }

  componentDidMount() {
    this.acceptationsLabo(this.props.record.id);
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
            laboratoires: this.props.laboratoires,
            produit: this.props.record.contrat.produit,
            testsMedical: this.state.testsMedical
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

const LaboratoireTable = Form.create()(EditableTable);

export default LaboratoireTable;
