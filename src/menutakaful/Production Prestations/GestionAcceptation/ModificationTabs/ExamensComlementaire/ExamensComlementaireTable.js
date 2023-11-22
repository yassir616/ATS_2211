import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Table,
  Input,
  Select,
  Popconfirm,
  Form,
  Tag,
  DatePicker,
  notification,
  Icon,
} from "antd";
import moment from "moment";
import { LABORATOIRE } from "../../../../../constants/index";
import { getAcceptationExamnsByAcceptation,
        getAcceptationTestMedicalByAcceptationExamensComplementaire,
        updateAcceptationTestMedical, } from "../../AcceptationsAPI";

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
          {this.props.laboratoires.map((element) => {
            return (
              <Option value={element.id} label={element.nom}>
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
    } else if (this.props.inputType === "Test Medical") {
      let array = [];
      this.props.produit.normes.forEach((norme) => {
        norme.honoraires.forEach((honoraire) => {
          if (honoraire.typeAuxiliaireHon.libelle === LABORATOIRE) {
            array.push({ value: honoraire.id, label: honoraire.libelle });
          }
        });
      });
      return (
        <Select style={{ width: "100%" }} labelInValue>
          {array.map((element) => {
            return (
              <Option key={element.id} value={element.value} label={element.label}>
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
    if (editing && title === "Test Medical") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("honoraires", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: testsMedical,
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
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex][title],
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
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: {
                key: record[dataIndex].laboratoire.id,
                label: record[dataIndex].laboratoire.nom,
              },
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
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: moment(record[dataIndex].dateReception),
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "date analyse") {
      moment(record[dataIndex].dateAnalyse);
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateAnalyse", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: moment(record[dataIndex].dateAnalyse),
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
        dataIndex: "acceptationExamens",
        editable: true,

        render: (acceptationExamensComplementaire) => (
          <span>{acceptationExamensComplementaire.laboratoire.nom}</span>
        ),
      },
      {
        title: "date analyse",
        dataIndex: "acceptationExamens",
        editable: true,
        render: acceptationExamensComplementaire => (
          <span>{acceptationExamensComplementaire.dateAnalyse}</span>
        )
      },
      {
        title: "date réception",
        dataIndex: "acceptationExamens",
        editable: true,
        render: acceptationExamensComplementaire => (
          <span>{acceptationExamensComplementaire.dateReception}</span>
        )
        
      },
      {
        title: "observations",
        dataIndex: "acceptationExamens",
        editable: true,

        render: (acceptationExamensComplementaire) => (
          <span>{acceptationExamensComplementaire.observations}</span>
        ),
      },
      {
        title: "Test Medical",
        dataIndex: "acceptationExamens",
        editable: true,
        render: acceptationExamensComplementaire => 
        <span>{acceptationExamensComplementaire.test}</span>,
        
      },
    ];
  }

  isEditing = (record) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        let honoraire = [];
        row.honoraires.forEach(element => {
          honoraire.push({ id: element.key, libelle: element.label });
        });

        delete row.honoraires;
        row.dateAnalyse = row.dateAnalyse.format("YYYY-MM-DD");
        row.dateReception = row.dateReception.format("YYYY-MM-DD");
        row.laboratoire = {
          id: row.laboratoire.key,
          nom: row.laboratoire.label,
        };
        let myRow = {
          acceptationExamens: { ...item.acceptationExamens, ...row },
          honoraires: honoraire,
        };

        newData.splice(index, 1, {
          ...item,
          ...myRow,
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
      .then((response) => {
        if (response.status === 200) {
          notification.success({
            message: "acceptation Examens Complementaire bien modifier !",
          });
        }
      })
      .catch((error) => {
        if (error.response.data.message === "wrong data") {
          notification.error({
            message: "acception Examens Complementaire ne ce trouve pas",
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              "Désolé! Quelque chose a mal tourné. Veuillez réessayer!",
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
  async acceptationExamensComplementaire(id) {
    let Response = await getAcceptationExamnsByAcceptation(id);
    console.log("testttt",Response);
    let newDataList = [];
    for (const element of Response.data) {
      let responseAcc = await getAcceptationTestMedicalByAcceptationExamensComplementaire(
        id,
        element.id
      );
      
      let key = { key: responseAcc.data.id };
      let elementone = { ...responseAcc.data, ...key };
      newDataList.push(elementone);
    }
    this.setState({
      data: [...newDataList],
    });
  }
 // TODO : modification not working + not getting medical tests
  componentDidMount() {
    this.acceptationExamensComplementaire(this.props.record.id);
    console.log("complementaire:", this.props);
    console.log("test medical",this.props.tests);
  }
  componentDidUpdate(prevProps, _){
    if(this.props.dataTable !== prevProps.dataTable){

      let list  = [...this.state.data]

      list.push(this.props.dataTable)   
      this.setState({data : [...list] })

    }
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      } 
      else
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.title,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
            laboratoires: this.props.laboratoires,
            produit: this.props.record.contrat.produit,
            testsMedical: this.state.testsMedical,

          }),
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
            defaultPageSize: 50,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const ExamensComlementaireTable = Form.create()(EditableTable);

export default ExamensComlementaireTable;
