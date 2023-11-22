import "antd/dist/antd.css";
import {
  DatePicker,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
  Icon,
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { getAcceptationSpecialisteByAcceptation,updateAcceptationSpecialiste} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "Specialiste") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.specialistes.map((element) => {
            return (
              <Option value={element.id} label={element.nom}>
                {element.nom}
              </Option>
            );
          })}
        </Select>
      );
    } else if (this.props.inputType === "Date consultation") {
      return <DatePicker className="date-style"></DatePicker>;
    } else if (this.props.inputType === "observations") {
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
    if (editing && title === "observations") {
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
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Specialiste") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("specialiste", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: {
                key: record[dataIndex].id,
                label: record[dataIndex].nom,
              },
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Date consultation") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateConsultation", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: moment(record[dataIndex]),
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Nature de test") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("natureTest", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Specialité") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("specialite", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
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
        title: "Specialiste",
        dataIndex: "specialiste",
        editable: true,
        render: (specialiste) => <span>{specialiste.nom}</span>,
      },
      {
        title: "Specialité",
        dataIndex: "specialite",
        editable: true,
      },
      {
        title: "Nature de test",
        dataIndex: "natureTest",
        editable: true,
      },
      {
        title: "Date consultation",
        dataIndex: "dateConsultation",
        editable: true,
        render: (dateConsultation) => (
          <span>{moment(dateConsultation).format("YYYY-MM-DD")}</span>
        ),
      },
      {
        title: "observations",
        dataIndex: "observations",
        editable: true,
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

        row.dateConsultation = row.dateConsultation.format("YYYY-MM-DD");
        row.specialiste = {
          id: row.specialiste.key,
          nom: row.specialiste.label,
        };

        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        this.setState({ data: newData, editingKey: "" });

        this.updateSpecialiste(item.id, { ...item, ...row });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  updateSpecialiste = (id, Data) => {
    updateAcceptationSpecialiste(id, Data)
      .then((response) => {
        if (response.status === 200) {
          notification.success({
            message: "acceptation specialiste bien modifier !",
          });
        }
      })
      .catch((error) => {
        if (error.response.data.message === "wrong data") {
          notification.error({
            message: "acception specialiste ne ce trouve pas",
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
  }

  async acceptationsSpecialiste(id) {
    let Response = await getAcceptationSpecialisteByAcceptation(id);
    let newDataList = [];
    for (const element of Response.data) {
      let key = { key: element.id };
      let elementone = { ...element, ...key };
      newDataList.push(elementone);
    }

    this.setState({
      data: [...newDataList],
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
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      } else
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.title,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
            specialistes: this.props.specialistes,
            produit: this.props.record.contrat.produit,
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

const SpecialisteTable = Form.create()(EditableTable);

export default SpecialisteTable;
