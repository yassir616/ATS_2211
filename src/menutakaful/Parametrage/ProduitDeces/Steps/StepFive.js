/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { getAllPartenaire } from "../../partenaire/PartenaireAPI";
import { getAllPointVente } from "../../pointvente/PointVenteAPI";
import { getTypePrestation } from "../../TypePrestation/PrestationAPI";
import { getOption } from "../../../EchangeFichiersInformatiques/EchangeFileAPI";

let id = 0;
let i = 0;
let j = 0;
const { Option } = Select;
const dateFormat = "DD-MM-YYYY";
var selected = [];

class StepFive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commissions: [],
      references: {},
      option: [],
      points: {},
      count: 0,
      current: 6,
      typeTar: "",
      typePrestation: [],
      adresse: [],
      pointVente: [],
      partenaire: []
    };
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  removed = c => {
    const { form } = this.props;
    // can use data-binding to get
    const cleFieldValue = form.getFieldValue("cle");
    // We need at least one passenger
    if (cleFieldValue.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      cle: cleFieldValue.filter(p => p !== c)
    });
  };

  handleChanged = e => this.setState({ [e.target.name]: e.target.value });

  removeOption = o => {
    const { form } = this.props;
    // can use data-binding to get
    const optFieldValue = form.getFieldValue("opt");
    // We need at least one passenger
    if (optFieldValue.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      opt: optFieldValue.filter(p => p !== o)
    });
  };

  add = () => {
    if (this.state.typeTar !== "") {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      });
    } else {
      message.warning("Choississez le type de tarrification");
    }
  };

  ajout = () => {
    const { form } = this.props;
    // can use data-binding to get
    const cle = form.getFieldValue("cle");
    const nextCle = cle.concat(i++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      cle: nextCle
    });
  };

  ajouter = () => {
    const { form } = this.props;
    const opt = form.getFieldValue("opt");
    const nextOpt = opt.concat(j++);
    form.setFieldsValue({
      opt: nextOpt
    });
  };

  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let references = [];
      references = {
        ageEcheance: values.ageEcheance,
        pointVente: values.pointVente,
        numeroCompte: values.numeroCompte,
        codeCompte: values.codeCompte,
        libelleAgence: values.libelleAgence,
        responsableProduction: values.responsableProduction,
        responsablePrestation: values.responsablePrestation
      };

      let data = [];
      let index = 0;
      for (index; index < values.cle.length; index++) {
        data = {
          commissionPartenaire: values.commissionPartenaire[index],
          dateDebut: values.debut[index],
          tva: values.tva[index]
        };
        this.state.commissions.push(data);
      }
      let data3 = [];
      for (index = 0; index < values.opt.length; index++) {
        data3 = {
          libelle: values.libelle[index],
          max: values.max[index],
          min: values.min[index]
        };
        this.state.option.push(data3);
      }
      if (
        values.ageEcheance !== null &&
        values.pointVente !== undefined &&
        values.numeroCompte !== null &&
        values.codeCompte !== null &&
        values.libelleAgence !== null
      ) {
        this.props.check(
          this.state.commissions,
          references,
          this.state.option,
          this.state.current
        );
      }
    });
  };

  prev() {
    const currentStep = this.state.current - 1;
    this.props.check(
      this.state.commissions,
      this.state.references,
      this.state.option,
      currentStep
    );
  }

  handleChange(value) {
    selected = value;
  }

  componentDidMount() {
    this.getAllTypePrestation();
    this.getAllPointVentes();
    this.getAllOption();
    this.getAllPartenaires();
  }
  async getAllPointVentes() {
    let response = await getAllPointVente();
    this.setState({
      pointVente: response.data.content
    });
  }

  async getAllPartenaires() {
    let response = await getAllPartenaire();
    this.setState({
      partenaire: response.data.content
    });
  }

  async getAllOption() {
    let response = await getOption();
    this.setState({
      option: response.data.content
    });
  }

  async getAllTypePrestation() {
    let response = await getTypePrestation();
    this.setState({
      typePrestation: response.data.content
    });
  }

  handleChangeTarrification = value => {
    this.setState({
      typeTar: value
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    keys.map((k, index) => (
      <div>
        <Row span={24}>
          <Col span={4}>
            <Form.Item label="Durée" required={false}>
              {getFieldDecorator(`dureeMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Mois" placeholder="Min" />)}
              {getFieldDecorator(`dureeMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Mois" placeholder="Max" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Age" required={false}>
              {getFieldDecorator(`ageMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Ans" placeholder="Min" />)}
              {getFieldDecorator(`ageMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Ans" placeholder="Max" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Capital" required={false}>
              {getFieldDecorator(`capitalMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Dhs" placeholder="Min" />)}
              {getFieldDecorator(`capitalMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Dhs" placeholder="Max" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Différé" required={false}>
              {getFieldDecorator(`differeMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Mois" placeholder="Min" />)}
              {getFieldDecorator(`differeMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input addonAfter="Mois" placeholder="Max" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label={this.state.typeTar} required={false} key={k}>
              {getFieldDecorator(`tauxFor[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs Obligatoire."
                  }
                ]
              })(
                this.state.typeTar === "Taux" ? (
                  <Input addonAfter="%" placeholder="Taux" />
                ) : (
                  <Input addonAfter="%" placeholder="Forfait" />
                )
              )}

              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </div>
    ));
    getFieldDecorator("opt", { initialValue: [] });
    const opt = getFieldValue("opt");
    const formItems2 = opt.map((o, index) => (
      <div>
        <Row span={24}>
          <Col span={6} offset={1}>
            <Form.Item label="Libelle" required={false}>
              {getFieldDecorator(`libelle[${o}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="Min" required={false} key={o}>
              {getFieldDecorator(`min[${o}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs Obligatoire."
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="Max" required={false}>
              {getFieldDecorator(`max[${o}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(<Input />)}

              {opt.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removeOption(o)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </div>
    ));

    getFieldDecorator("cle", { initialValue: [] });
    const cle = getFieldValue("cle");
    const formItems1 = cle.map((c, index) => (
      <div>
        <Row span={24}>
          <Col span={7} offset={1}>
            <Form.Item label="Commission partenaire" required={false}>
              {getFieldDecorator(`commissionPartenaire[${c}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true
                  }
                ]
              })(<Input addonAfter="%" />)}
            </Form.Item>
          </Col>

          <Col span={7} offset={1}>
            <Form.Item label="Début">
              {getFieldDecorator(`debut[${c}]`, {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <DatePicker
                  format={dateFormat}
                  onChange={this.onChangeDate}
                ></DatePicker>
              )}
            </Form.Item>
          </Col>
          <Col span={5} offset={0}>
            <Form.Item label="TVA" required={false} key={c}>
              {getFieldDecorator(`tva[${c}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input addonAfter="%" />)}

              {cle.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removed(c)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </div>
    ));
    return (
      <Row>
        <Col span={24}>
          <Form id="laststep" onSubmit={this.handleSubmited}>
            <Col span={24}>
              <Divider orientation="left">Modalités prestations</Divider>
            </Col>

            <Col span={8} offset={1}>
              <Form.Item label="Age échéance">
                {getFieldDecorator("ageEcheance", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <Input
                    addonAfter="ANS"
                    name="ageEcheance"
                    onChange={this.handleChanged}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Divider orientation="left">Gestoinnaire de la police</Divider>
            </Col>

            <Col span={8} offset={1}>
              <Form.Item label="Responsable production">
                {getFieldDecorator("responsableProduction", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire"
                    }
                  ]
                })(<Input name="responsableProduction" />)}
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Form.Item label="Responsable prestation">
                {getFieldDecorator("responsablePrestation", {
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire"
                    }
                  ]
                })(<Input name="responsablePrestation" />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Divider orientation="left">Point de ventes</Divider>
            </Col>
            <Col span={14} offset={1}>
              <Form.Item label="Points de ventes">
                {getFieldDecorator(
                  "pointVente",

                  {
                    rules: [{ required: true, message: "Format invalide!" }]
                  }
                )(
                  <Select
                    name="motivations"
                    mode="multiple"
                    placeholder="Selectionnez ..."
                    onChange={this.handleChange}
                  >
                    {this.state.pointVente.map(element => {
                      return (
                        <Option value={element.id} label={element.libelle}>
                          {element.libelle}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Divider orientation="left">Références bancaire</Divider>
            </Col>

            <Col span={6} offset={1}>
              <Form.Item label="Numéro compte">
                {getFieldDecorator("numeroCompte", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(<Input name="numeroCompte" onChange={this.handleChanged} />)}
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="Libellé agence">
                {getFieldDecorator("libelleAgence", {
                  rules: [{ required: true, message: "Champs Obligatoire !" }]
                })(
                  <Input name="libelleAgence" onChange={this.handleChanged} />
                )}
              </Form.Item>
            </Col>
            <Col span={6} offset={2}>
              <Form.Item label="Code Compte">
                {getFieldDecorator("codeCompte", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(<Input name="codeCompte" onChange={this.handleChanged} />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider orientation="left">Commission</Divider>
              {formItems1}

              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={this.ajout}
                  style={{ width: "60%" }}
                >
                  <Icon type="plus" /> Ajouter
                </Button>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Divider orientation="left">Option Assurance</Divider>
              {formItems2}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={this.ajouter}
                  style={{ width: "60%" }}
                >
                  <Icon type="plus" /> Ajouter
                </Button>
              </Form.Item>
            </Col>
            <Divider />
            <Form.Item {...formItemLayoutWithOutLabel}></Form.Item>
            <Form.Item>
              <Form.Item>
                {this.state.current === 6 && (
                  <Button type="primary" form="laststep" htmlType="submit">
                    <Icon type="save" />
                    Enregistrer
                  </Button>
                )}
                {this.state.current > 0 && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    <Icon type="arrow-left" />
                    Précédent
                  </Button>
                )}
              </Form.Item>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create({ name: "global_state" })(StepFive);
