/* eslint-disable react/prop-types */
import "./CreatePointVente.css";
import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  message,
  notification,
  Row,
  Select,
  Upload,
  InputNumber,
  Divider
} from "antd";
import React, { Component } from "react";
import { getAllPartenaire } from "../partenaire/PartenaireAPI";
import { addPointVente, getTypePointVente } from "./PointVenteAPI";
import { getAllSecteur, getVois } from "../../Participants/ParticipantAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const FormItem = Form.Item;
const { Option } = Select;

export class CreatePointVente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abreviation: {
        value: ""
      },
      codeCaps: {
        value: ""
      },
      codeInterne: {
        value: ""
      },
      codeResponsable: {
        value: ""
      },
      ice: {
        value: ""
      },
      libelle: {
        value: ""
      },
      logo: {
        value: ""
      },
      nomResponsable: {
        value: ""
      },
      patente: {
        value: ""
      },
      secteurActiviteId: {
        value: ""
      },
      partenaire: "",
      secteurActivite: "",
      typePointVente: "",
      partenaireTB: [],
      secteurActiviteTB: [],
      typePointVenteTB: [],
      vois: [],
      display : true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = e => {
    this.setState({
      partenaire: e
    });
  };
  handleChangeDisplay =()=>
  {
    this.setState({
      display : false
    });
  }
  handleDeleteDisplay=()=>
  {
    this.setState({
      display : true
    });
  }

  handleChangeSecteurActivite = e => {
    this.setState({
      secteurActivite: e
    });
  };

  handleChangeTypePointVente = e => {
    this.setState({
      typePointVente: e
    });
  };

  componentDidMount() {
    this.getPartenaire();
    this.getsecteurActiviteId();
    this.getTypePointVenteId();
    this.getVois();
  }

  async getsecteurActiviteId() {
    let response = await getAllSecteur();
    this.setState({
      secteurActiviteTB: response.data.content
    });
  }

  async getPartenaire() {
    let response = await getAllPartenaire();
    this.setState({
      partenaireTB: response.data.content
    });
  }

  async getTypePointVenteId() {
    let response = await getTypePointVente();
    this.setState({
      typePointVenteTB: response.data.content
    });
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  async ajouterPointVente(values) {
    try {
      let response = await addPointVente(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "La creation est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "Ce point vente existe déja") {
        notification.error({
          message: "Ce point vente existe déja."
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

  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const createPointVenteRequest = {
          abb: this.state.abreviation.value,
          codeCaps: this.state.codeCaps.value,
          codeInterne: this.state.codeInterne.value,
          codeResponsable: this.state.codeResponsable.value,
          ice: this.state.ice.value,
          libelle: this.state.libelle.value,
          logo: this.state.logo.value,
          nomResponsable: this.state.nomResponsable.value,
          patente: this.state.patente.value,
          partenairepvId: this.state.partenaire,
          secteurActiviteId: this.state.secteurActivite,
          typePointVenteId: this.state.typePointVente,
          adressPays: values.adressPays,
          adressVille: values.adressVille,
          adressVois: values.adressVois,
          adressCodePostal: values.adressCodePostal,
          adressNumero: values.adressNumero,
          adressComplement: values.adressComplement,
          adressComplete: values.adressComplete,
          telephone: values.telephone,
          email: values.email,
          code:values.code,
          rib:values.rib
        };
        this.ajouterPointVente(createPointVenteRequest);
      }
    });
  }

  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  async getVois() {
    let vois = await getVois();

    this.setState({
      vois: [...vois.data]
    });
  }
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text"
      },
      onChange(info) {
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Button
          type="primary"
          className="add-button"
          onClick={this.showDrawer}
          style={{ borderRadius: "0px" }}
        >
          <Icon type="plus" /> Nouveau point vente
        </Button>
        <Drawer
          title="créer nouveau point de vente"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark> 
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Intermédiaire"
                  validateStatus={this.state.partenaire.validateStatus}
                >
                  <Select
                    placeholder="Intermédiaire"
                    name="partenaire"
                    optionLabelProp="label"
                    onChange={this.handleChange}
                  >
                    {this.state.partenaireTB.map(partenaire => {
                      return (
                        <Option
                          key={partenaire.id}
                          label={partenaire.code}
                          value={partenaire.id}
                        >
                          {partenaire.code}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Patente"
                  validateStatus={this.state.patente.validateStatus}
                >
                  <Input
                    size="default"
                    name="patente"
                    autoComplete="off"
                    placeholder="patente"
                    value={this.state.patente.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Abréviation"
                  validateStatus={this.state.abreviation.validateStatus}
                >
                  <Input
                    size="default"
                    name="abreviation"
                    autoComplete="off"
                    placeholder="Code"
                    value={this.state.abreviation.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Code ACAPS"
                  validateStatus={this.state.codeCaps.validateStatus}
                >
                  <Input
                    size="default"
                    name="codeCaps"
                    autoComplete="off"
                    placeholder="Code ACAPS"
                    value={this.state.codeCaps.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Code Interne"
                  validateStatus={this.state.codeInterne.validateStatus}
                >
                  <Input
                    size="default"
                    name="codeInterne"
                    autoComplete="off"
                    placeholder="Code"
                    value={this.state.codeInterne.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Code Responsable"
                  validateStatus={this.state.codeResponsable.validateStatus}
                >
                  <Input
                    size="default"
                    name="codeResponsable"
                    autoComplete="off"
                    placeholder="Code ACAPS"
                    value={this.state.codeResponsable.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="ICE"
                  validateStatus={this.state.ice.validateStatus}
                >
                  <Input
                    size="default"
                    name="ice"
                    autoComplete="off"
                    placeholder="Code"
                    value={this.state.ice.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Libelle"
                  validateStatus={this.state.libelle.validateStatus}
                >
                  <Input
                    size="default"
                    name="libelle"
                    autoComplete="off"
                    placeholder="Libelle"
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Téléphone">
                  {getFieldDecorator("telephone", {
                    rules: [{ required: true, message: "Tapez Téléphone" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez Téléphone"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email">
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "L'e-mail n'est pas valid"
                      },
                      {
                        required: true,
                        message: "Svp entré votre E-mail!"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      type="email"
                      placeholder="Email@example.com"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="logo"
                  validateStatus={this.state.logo.validateStatus}
                >
                  <Input
                    size="default"
                    name="logo"
                    autoComplete="off"
                    placeholder="logo"
                    value={this.state.logo.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> Importer
                  </Button>
                </Upload>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Nom Responsable"
                  validateStatus={this.state.nomResponsable.validateStatus}
                >
                  <Input
                    size="default"
                    name="nomResponsable"
                    autoComplete="off"
                    placeholder="Nom Responsable"
                    value={this.state.nomResponsable.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="Secteur d'activité">
                  <Select
                    placeholder="secteurActivite"
                    name="secteurActivite"
                    onChange={this.handleChangeSecteurActivite}
                    optionLabelProp="label"
                  >
                    {this.state.secteurActiviteTB.map(element => {
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
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Type de point de vente">
                  <Select
                    placeholder="typePointVente"
                    name="typePointVente"
                    onChange={this.handleChangeTypePointVente}
                    optionLabelProp="label"
                  >
                    {this.state.typePointVenteTB.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.code}
                        >
                          {element.code}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
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
              <Col span={24}>
                <h4>Compte Bancaire :</h4>
                <Divider></Divider>
              </Col>
            </Row>
            {/* <Row><Col span={12}>  
            <Button
                onClick={this.handleChangeDisplay}
                type="primary"
                className="add-button"
                style={{ borderRadius: "0px" }}
              >
               <Icon type="plus" />
              </Button></Col></Row> */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Code">
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "selectionnez un code" }]
                  })(<Input placeholder="code" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="RIB">
                  {getFieldDecorator("rib", {
                 rules: [
                  {
                    required: true,
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
           {/*  <Row gutter={16} hidden={this.state.display}>
              <Col span={12}>
                <Form.Item label="Code">
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "selectionnez un code" }]
                  })(<Input placeholder="code" />)}
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
              <Button
                onClick={this.handleDeleteDisplay}
                type="primary"
                style={{ borderRadius: "0px" }}
              >
              <Icon type="delete" />
              </Button>
            </Row> */}
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
  validateTest = abreviation => {};
}

export default Form.create()(CreatePointVente);
