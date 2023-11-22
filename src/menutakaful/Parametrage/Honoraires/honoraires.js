/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Table
} from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import AjouterHonoraire from "./AjouterHonoraire";
import { getTypeAuxiliaire } from "../Auxiliaires/AuxiliaireAPI";
import { getHonoraire, updateHonoraire } from "./HonorairesAPI";
import { getColumnSearchProps } from "../ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;
class Honoraires extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      searchText: "",
      searchedColumn: "",
      record: {},
      value: "",
      keyRecord: "",
      auxiliaire: []
    };
    this.columns = [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        width: "20%",
        editable: true,
        ...getColumnSearchProps("code", "code", this)
      },
      {
        title: "Libelle",
        dataIndex: "libelle",
        key: "libelle",
        width: "20%",
        editable: true,
        ...getColumnSearchProps("libelle", "libelle", this)
      },
      {
        title: "Montant",
        dataIndex: "montantHonoraire",
        key: "montant",
        width: "20%",
        editable: true,
        ...getColumnSearchProps("montant", "montant", this)
      },
      {
        title: "Type auxiliaire",
        dataIndex: "typeAuxiliaireHon.code",
        key: "type",
        width: "20%",
        editable: true,
        ...getColumnSearchProps("type", "type", this)
      },
      {
        title: "Opérations",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <a
                href="#top"
                type="primary"
                onClick={() => this.handleSelectChange(record)}
                style={{ borderRadius: "0px" }}
              >
                Modifier
              </a>
            </span>
          );
        }
      }
    ];
    this.getTypeAux = this.getTypeAux.bind();
  }

  async getTypeAux() {
    this.setState({
      auxiliaire: await getTypeAuxiliaire().data.content
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  rechercheHonoraire = () => {
    getHonoraire()
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
    this.rechercheHonoraire();
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

  async updateHon(id, body) {
    try {
      let response = await updateHonoraire(id, body);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la modification est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message ||
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.updateHon(this.state.keyRecord, values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSelectChange = value => {
    this.setState({ visible: true, keyRecord: value.id });
    this.props.form.setFieldsValue({
      code: value.code,
      libelle: value.libelle,
      montantHonoraire: value.montantHonoraire,
      typeAuxiliaireId: value.typeAuxiliaireHon.id
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <ComponentTitle title="Gestion des honoraires" />
        <AjouterHonoraire />
        <Table
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
        />
        <Drawer
          title="Création d'un nouvel honoraire"
          width={320}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Code :">
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "Tapez le code" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le code d'honoraire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Libelle :">
                  {getFieldDecorator("libelle", {
                    rules: [{ required: true, message: "Tapez le libelle" }]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le libelle d'honoraire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Montant :">
                  {getFieldDecorator("montantHonoraire", {
                    rules: [{ required: true, message: "Tapez le montant" }]
                  })(
                    <InputNumber
                      className="not-rounded"
                      placeholder="Tapez le montant d'honoraire"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Type auxiliaire :">
                  {getFieldDecorator("typeAuxiliaireId", {
                    rules: [
                      {
                        required: true,
                        message: "Choisissez le type auxiliaire"
                      }
                    ]
                  })(
                    <Select
                      placeholder="cliquez pour ajouter un profile"
                      optionLabelProp="label"
                    >
                      {this.state.auxiliaire.map(element => {
                        return (
                          <Option
                            key={element.id}
                            value={element.id}
                            label={element.code}
                          >
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div className="submit-cancel">
              <Button
                className="not-rounded"
                onClick={this.onClose}
                style={{ marginRight: 8 }}
              >
                Fermer
              </Button>
              <Button className="not-rounded" type="primary" htmlType="submit">
                Modifier
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}
export default Form.create()(Honoraires);
