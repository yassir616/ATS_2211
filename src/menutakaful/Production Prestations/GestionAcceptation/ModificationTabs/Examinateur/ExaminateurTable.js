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
import { MEDECIN_EXAMINATEUR } from "../../../../../constants/index";
import {
  getAcceptationExaminateurByAcceptation,
  getAcceptationTestByAcceptationsExaminateur,
  updateAcceptationTestMedical
} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "Medecin") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.medecins.map(element => {
            return (
              <Option key={element.id} value={element.id} label={element.nom}>
                {element.nom}
              </Option>
            );
          })}
        </Select>
      );
    } else if (this.props.inputType === "Verdict") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.verdicts.map(element => {
            return (
              <Option
                key={element.id}
                value={element.id}
                label={element.status}
              >
                {element.status}
              </Option>
            );
          })}
        </Select>
      );
    } else if (
      this.props.inputType === "Date visite" ||
      this.props.inputType === "Date réception"
    ) {
      return <DatePicker className="date-style"></DatePicker>;
    } else if (this.props.inputType === "Tests Medical") {
      let array = [];
      this.props.produit.normes.forEach(norme => {
        norme.honoraires.forEach(honoraire => {
          if (honoraire.typeAuxiliaireHon.libelle === MEDECIN_EXAMINATEUR) {
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
    } else if (
      this.props.inputType === "Observations" ||
      this.props.inputType === "Observation verdict"
    ) {
      return <TextArea rows={2} />;
    }
    return <Input></Input>;
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
    } else if (editing && title === "Observations") {
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
              initialValue: record[dataIndex].observation
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
              initialValue: record[dataIndex].motif
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Observation verdict") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("observationsVerdict", {
              rules: [
                {
                  // required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex].observationsVerdict
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Medecin") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("medecin", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: {
                key: record[dataIndex].medecin.id,
                label: record[dataIndex].medecin.nom
              }
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
                key: record[dataIndex].verdict.id,
                label: record[dataIndex].verdict.status
              }
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
              initialValue: moment(record[dataIndex].dateReception)
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Date visite") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateVisite", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: moment(record[dataIndex].dateVisite)
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
    this.state = {
      data: [],
      editingKey: "",
      testsMedical: [],
      listOnglets: []
    };
    this.columns = [
      {
        title: "Medecin",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.medecin.nom}</span>
      },
      {
        title: "Date visite",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.dateVisite}</span>
      },
      {
        title: "Date réception",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.dateReception}</span>
        )
      },
      {
        title: "Observations",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.observation}</span>
      },
      {
        title: "Verdict",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.verdict.status}</span>
        )
      },
      {
        title: "Observation verdict",
        dataIndex: "acceptationExaminateur",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.observationsVerdict}</span>
        )
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
        title: "Operation",
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
                title="êtes-vous certain de vouloir annuler ?"
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

        // Convert FormatDate (dateAnalyse,dateVisite)
        row.dateReception = row.dateReception.format("DD-MM-YYYY");
        row.dateVisite = row.dateVisite.format("DD-MM-YYYY");

        row.medecin = { id: row.medecin.key, nom: row.medecin.label };
        row.verdict = { id: row.verdict.key, status: row.verdict.label };

        let myRow = {
          acceptationExaminateur: { ...item.acceptationExaminateur, ...row },
          honoraires: honoraire
        };
        console.log(myRow);
        console.log(newData);
        newData.splice(index, 1, {
          ...item,
          ...myRow
        });

        this.setState({ data: newData, editingKey: "" });
        console.log(this.state.data);

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
            message: "acceptation Examinateur bien modifier !"
          });
        }
      })
      .catch(error => {
        if (error.response.data.message === "wrong data") {
          notification.error({
            message: "acception Examinateur ne ce trouve pas"
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

      // Convert FormatDate (dateReception,dateVisite)
      item.acceptationExaminateur.dateReception = moment(item.acceptationExaminateur.dateReception,'DD-MM-YYYY').format( "YYYY-MM-DD");
      item.acceptationExaminateur.dateVisite = moment(item.acceptationExaminateur.dateVisite,'DD-MM-YYYY').format( "YYYY-MM-DD");
      
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
  async acceptationsExaminateur(id) {
    let Response = await getAcceptationExaminateurByAcceptation(id);
    let newDataList = [];
    for (const element of Response.data) {
      let responseAcc = await getAcceptationTestByAcceptationsExaminateur(
        id,
        element.id
      );
      let list = [...this.state.listOnglets];
      if (
        responseAcc.data.acceptationExaminateur.verdict.status ===
        "Expertise médecin conseil"
      ) {
        list.push({
          key: "medecinConseil",
          tab: "Médecin Conseil"
        });
        this.setState({ listOnglets: [...list] });
        this.props.onglet(list);
      }
      if (
        responseAcc.data.acceptationExaminateur.verdict.status === "Réassurance"
      ) {
        list.push({
          key: "reassurance",
          tab: "Réassurance"
        });
        this.setState({ listOnglets: [...list] });
        this.props.onglet(list);
      }
      let key = { key: responseAcc.data.id };
      let elementone = { ...responseAcc.data, ...key };
      newDataList.push(elementone);
    }
    this.setState({
      data: [...newDataList]
    });
  }

  componentDidMount() {
    this.acceptationsExaminateur(this.props.record.id);
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
            medecins: this.props.medecins,
            produit: this.props.record.contrat.produit,
            testsMedical: this.state.testsMedical,
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
const ExaminateurTable = Form.create()(EditableTable);
export default ExaminateurTable;
