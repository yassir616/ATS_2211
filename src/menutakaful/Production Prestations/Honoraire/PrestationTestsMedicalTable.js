/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Table,
  Input,
  Popconfirm,
  Select ,
  Icon,
Form} from "antd";
import React, { Component } from "react";
import {
  updateMontant
} from "../../Parametrage/TypePrestation/PrestationAPI";

const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();
class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "Montant honoraire") {
    
      return (
         <Input></Input>
      );
    }
    return <Input></Input>;
  };
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      montantHonoraire,
      children,
      ...restProps
    } = this.props;
    if (editing && title === "Montant honoraire") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 ,width:"70%"}}>
            {getFieldDecorator("montantHonoraire", {
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
class PrestationTestsMedicalHonoraire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      editingKey: "",
      loading: false,
      montantHonoraire: 0

    };
  this.columns = [
    {
      title: "Code Acceptation",
      dataIndex: "code"
    },
    {
      title: "Nom assuré",
      dataIndex: "Nom"
    },
    {
      title: "Intitule Test",
      dataIndex: "Intitule",
    },
    {
      title: "Libelle",
      dataIndex: "libelle",
     
    },
    {
      title: "Montant honoraire",
      dataIndex: "montantHonoraire",
      editable: true,
      
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a
                  onClick={() => this.save(form, record.idDetail)}
                  style={{ marginRight: 8 }}
                >
                  Enregistrer
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="êtes-vous certain de vouloir annuler ?"
              onConfirm={() => this.cancel(record.idDetail)}
            >
              <a>Annuler</a>
            </Popconfirm>
          </span>
        ) : (
          <a
            disabled={editingKey !== ""}
            onClick={() => this.edit(record.idDetail)}
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
  /*state = {
    data: [],
    editingKey: "",
    showDetailPrestation: false,
    detailPrestation: [],
    loading: false,
    montantHonoraire: this.props.montantHonoraire
  };
*/

  isEditing = record => record.idDetail === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: "" });
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
  
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.idDetail);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({
          data: newData,
          editingKey: ""
        });
         this.updateMontant({ ...item, ...row});
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  async updateMontant(data) {
    let response = await updateMontant(data.idDetail,data.numeroSinistre,data.montantHonoraire,data.typeFiscal);
    console.log(response);
  }

  componentDidMount() {
    this.state.data = this.props.data;
  }
   /*componentDidUpdate() {
    console.log("componentDidUpdate 2");
    console.log(this.state.data);
    this.state.data = this.props.data; 
  
  } */ 
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
            montantHonoraire: this.state.montantHonoraire
          })
        };
      
    });
    
    return (
      <EditableContext.Provider value={this.props.form}>
      <Table
        components={components}
        style={{ marginTop: "50px" }}
        rowKey={record => record.idDetail}
        columns={columns}
        rowClassName="editable-row"
        dataSource={this.props.data}
        pagination={{ hideOnSinglePage: true }}
        loading={this.state.loading}
        // expandedRowRender={expandedRowRender}
        // expandRowByClick
        bordered
      />
      </EditableContext.Provider>
    );
  }
}
const PrestationTestsMedicalHonorair = Form.create()(PrestationTestsMedicalHonoraire);
export default PrestationTestsMedicalHonorair;
