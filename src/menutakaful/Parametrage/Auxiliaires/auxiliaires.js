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
import AjouterAuxiliaire from "./AjouterAuxiliaire";
import {
  getTypeAuxiliaire,
  getAuxiliaires,
  updateAuxiliaire
} from "./AuxiliaireAPI";
import { getColumnSearchProps } from "../ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;
class Auxiliaires extends Component {
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
        title: "Nom",
        dataIndex: "nom",
        key: "nom",
        width: "20%",
        ...getColumnSearchProps("nom", "Nom", this)
      },
      {
        title: "Prénom",
        dataIndex: "prenom",
        key: "prenom",
        width: "20%",
        ...getColumnSearchProps("prenom", "Prénom", this)
      },
      {
        title: "Raison Sociale",
        dataIndex: "raisonSociale",
        key: "raison_sociale",
        width: "20%",
        ...getColumnSearchProps("raisonSociale", "Raison Sociale", this)
      },
      {
        title: "Type auxiliaire ",
        dataIndex: "typeAuxiliaire.libelle",
        key: "typeAuxiliaire",
        width: "20%",
        ...getColumnSearchProps("typeAuxiliaire", "typeAuxiliaire", this)
      },
      {
        title: "Type Fiscal",
        dataIndex: "typeFiscal",
        key: "typeFiscal",
        width: "20%",
        ...getColumnSearchProps("typeFiscal", "typeFiscal", this)
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
  componentDidMount() {
    this.getAuxiliaire();
    this.getTypeAux();
  }
  async getAuxiliaire() {
    let auxiliaireResponse = await getAuxiliaires();

    this.setState({
      data: auxiliaireResponse.data.content
    });
  }
  async getTypeAux() {
    let auxiliaireResponse = await getTypeAuxiliaire();

    this.setState({
      auxiliaire: auxiliaireResponse.data.content
    });
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

  async updateAux(id, body) {
    try {
      let response = await updateAuxiliaire(id, body);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la modification est bien faite"
        });
        //window.location.reload();
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
      console.log("auxiliaire value:", values);
      if (!err) {
        this.updateAux(this.state.keyRecord, values);
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
      adressComplete: value.adressComplete,
      email: value.email,
      faxe: value.faxe,
      ir: value.ir,
      nom: value.nom,
      patente: value.patente,
      prenom: value.prenom,
      raisonSociale: value.raisonSociale,
      registreCommerce: value.registreCommerce,
      specialite: value.specialite,
      tel: value.tel,
      typePersonne: value.typePersonne,
      typeFiscal:value.typeFiscal,
      typeAuxiliaireId: value.typeAuxiliaire.id,
      cin: value.cin,
      identifiantFiscal: value.identifiantFiscal,
      rib: value.rib
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <ComponentTitle title="Gestion des auxiliaires" />
        <AjouterAuxiliaire />
        <Table
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
        />
        <Drawer
          title="Modification d'auxiliaire"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Type auxiliaire">
                  {getFieldDecorator("typeAuxiliaireId")(
                    <Select
                      placeholder="cliquez pour ajouter un profile"
                      optionLabelProp="label"
                    >
                      {this.state.auxiliaire.map(element => {
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
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Raison sociale">
                  {getFieldDecorator("raisonSociale")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le raison sociale d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Adresse Postal">
                  {getFieldDecorator("adressComplete")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez l'adresse d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Adresse éléctronique">
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "L'e-mail n'est pas valid"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez l'email d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Téléphone">
                  {getFieldDecorator("tel", {
                    rules: [
                      {
                        pattern: new RegExp("^[0][5-7]{1}[0-9]{8}"),
                        message: "Wrong format!"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le télépone d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Faxe">
                  {getFieldDecorator("faxe", {
                    rules: [
                      {
                        pattern: new RegExp("^[0][5]{1}[0-9]{8}"),
                        message: "Wrong format!"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le faxe d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Patente">
                  {getFieldDecorator("patente")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez la patente d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Registre commerce">
                  {getFieldDecorator("registreCommerce")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le registre commerce d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="N°Identifiant fiscal">
                  {getFieldDecorator("identifiantFiscal")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez l'identifiant fiscal"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Cin">
                  {getFieldDecorator("cin")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le cin d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nom">
                  {getFieldDecorator("nom")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le nom d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Prénom">
                  {getFieldDecorator("prenom")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le prenom d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Spécialité">
                  {getFieldDecorator("specialite")(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez la spécialité d'auxiliaire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Type ">
                  {getFieldDecorator("typePersonne")(
                    <Select placeholder="Choisissez le type de personne">
                      <Option value="Physique">Physique</Option>
                      <Option value="Morale">Morale</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="RIB">
                  {getFieldDecorator("rib",
                  ({
                    rules: [
                      {
                        pattern: new RegExp("^[0-9]{24}"),
                        message: "Wrong format!"
                      }
                    ]
                  })
                  )(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le rib d'auxiliaire"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                      maxLength="24"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Type Fiscal ">
                  {getFieldDecorator("typeFiscal")(
                    <Select placeholder="Choisissez le type Fiscal">
                      <Option value="IS">IS</Option>
                      <Option value="IR">IR</Option>
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
export default Form.create()(Auxiliaires);
