/* eslint-disable react/prop-types */
import "./AjouterAuxiliaire.css";
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  notification,
  Row,
  Select,
  Divider,
  InputNumber
} from "antd";
import React, { Component } from "react";
import { getTypeAuxiliaire, ajoutAuxiliaire } from "./AuxiliaireAPI";
import { getVois } from "../../Participants/ParticipantAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;

class AjouterAuxiliaire extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, auxiliaire: [], vois: [] };
  }
  componentDidMount() {
    this.getTypeAux();
    this.getVois();
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  async getTypeAux() {
    let auxiliaireResponse = await getTypeAuxiliaire();

    this.setState({
      auxiliaire: auxiliaireResponse.data.content
    });
  }

  async getVois() {
    let vois = await getVois();

    this.setState({
      vois: [...vois.data]
    });
  }
  async ajouterAux(values) {
    try {
      let response = await ajoutAuxiliaire(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la création d'auxiliaire est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "auxiliaire already exists") {
        notification.error({
          message: "cet auxiliaire existe déjà."
        });
      } else {
        notification.error({
          message: "Takaful",
          description:
            error.message ||
            "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
        });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log("values:", values);
      if (!err) {
        this.ajouterAux(values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button type="primary" className="add-button" onClick={this.showDrawer}>
          <Icon type="plus" /> Nouvel auxiliaire
        </Button>
        <Drawer
          title="Création Nouvel auxiliaire "
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
              <Col span={12}>
                <Form.Item label="RIB">
                  {getFieldDecorator("rib", {
                    rules: [
                      {
                        pattern: new RegExp("^[0-9]{24}"),
                        message: "Le rib n'est pas valid"
                      }
                    ]
                  })(
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
              <Col span={24}>
                <h4>Adresse :</h4>
                <Divider></Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pays">
                  {getFieldDecorator("adressPays", {
                    rules: [{ required: true, message: "selecte un pays" }]
                  })(<Input placeholder="pays" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ville">
                  {getFieldDecorator("adressVille", {
                    rules: [{ required: true, message: "selecte une ville" }]
                  })(<Input placeholder="ville" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Voie">
                  {getFieldDecorator("adressVois", {
                    rules: [{ required: true, message: "selecte une vois" }]
                  })(
                    <Select placeholder="Voie">
                      {this.state.vois.map(element => {
                        return (
                          <Option key={element.id} value={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Code Postal">
                  {getFieldDecorator("adressCodePostal", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le Code Postal"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Numéro">
                  {getFieldDecorator("adressNumero", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le Numero"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                      min="0"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Complément d'adresse">
                  {getFieldDecorator("adressComplement")(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le un complément"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Adresse Complete">
                  {getFieldDecorator("adressComplete")(
                    <Input className="not-rounded" style={{ width: "100%" }} />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Type Fiscal">
                {getFieldDecorator("typeFiscal")(
                <Select placeholder="Choisissez le type Fiscal" style={{ width: "100%" }}>
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
                Ajouter
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(AjouterAuxiliaire);
