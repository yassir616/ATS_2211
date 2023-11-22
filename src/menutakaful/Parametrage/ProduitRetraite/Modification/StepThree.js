/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select
} from "antd";
import React, { Component } from "react";

import {
  currencyFormatter,
  currencyParser,
  formItemInputWithAddons,
  formItemInputWithoutAddons
} from "../../../../util/Helpers";
import { getPoolInvestissment } from "../ProduitRetraiteAPI";
const { Option } = Select;
class StepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poolInvestissments: [],
      naturesFiscales: [
        {
          value: "EPARGNE",
          name: "Epargne"
        },
        {
          value: "RETRAITE",
          name: "Retraite complémentaire"
        }
      ],
      modesGestions: [
        {
          value: "MOUDARABA",
          name: "Moudaraba"
        },
        {
          value: "WAKALABILISTITMAR",
          name: "WakalabillIstithmar"
        }
      ],
      modeCapitalReconstitue: [
        {
          value: "METHOD1",
          name:
            "Méthode 1 – Début de période + cotisations du mois (non investies"
        },
        {
          value: "METHOD2",
          name: "Méthode 2 – Fin de période"
        }
      ],
      regimeFiscal: [
        {
          value: "RETRAITE",
          name: "Retraite complémentaire"
        },
        {
          value: "VIE",
          name: "Vie capitalisation"
        }
      ],
      natureFiscale: this.props.record.natureFiscale,
      abattementFiscal: true,
      modeGestion: this.props.record.modeGestion,
      revenuGlobal: this.props.record.revenuGlobal
    };
  }

  onChangeNatureFiscale = e => {
    this.setState({
      natureFiscale: e
    });
  };

  onChangeModeGestion = e => {
    this.setState({
      modeGestion: e
    });
  };

  onChangeRevenuGlobal = e => {
    this.setState({
      revenuGlobal: e
    });
  };
  onChangeAbattementFiscal = e => {
    this.setState({
      abattementFiscal: e.target.value,
      revenuGlobal: e.target.value ? this.state.revenuGlobal : ""
    });
  };
  componentDidMount() {
    this.getAllPoolInvestissment(this);
  }

  getAllPoolInvestissment = async context => {
    let response = await getPoolInvestissment();
    context.setState({
      poolInvestissments: response.data.content
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };
    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayout} id="formadd">
            <Col span={20}>
              <Divider orientation="left">Paramètres globaux</Divider>
            </Col>
            <Col span={11}>
              {formItemInputWithoutAddons(
                "Numéro Compte Takaful",
                "numeroCompte",
                getFieldDecorator
              )}
            </Col>
            <Col span={11}>
              {formItemInputWithoutAddons(
                "Intitulé du compte Takaful",
                "libelleCompte",
                getFieldDecorator
              )}
            </Col>
            <Col span={11}>
              <Form.Item label="Pool d'investissement" hasFeedback>
                {getFieldDecorator("poolInvestissment", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez un pool "
                    }
                  ]
                })(
                  <Select mode="multiple" placeholder="Selectionnez ...">
                    {this.state.poolInvestissments.map(element => {
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
            <Col span={20}>
              <Divider orientation="left">Paramètres de fiscalité</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Nature fiscale " hasFeedback>
                {getFieldDecorator("natureFiscale", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez une nature fiscale "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.onChangeNatureFiscale}
                  >
                    {this.state.naturesFiscales.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.value}
                          label={element.name}
                        >
                          {element.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {this.state.natureFiscale === "RETRAITE" ? (
              <Col span={11}>
                <Form.Item label="Retraite avec abattement fiscale">
                  {getFieldDecorator("retraiteAbattementFiscale", {
                    valuePropName: "unchecked",
                    initialValue: this.state.abattementFiscal
                  })(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={this.state.abattementFiscal}
                      onChange={this.onChangeAbattementFiscal}
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            ) : null}

            {this.state.abattementFiscal &&
            this.state.natureFiscale === "RETRAITE" ? (
              <Col span={11}>
                <Form.Item label="Revenu global">
                  {getFieldDecorator("revenuGlobal", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <InputNumber
                      value={this.state.revenuGlobal}
                      addonAfter="DHS"
                      onChange={this.onChangeRevenuGlobal}
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            ) : null}

            <Col span={11}>
              <Form.Item label="Régime fiscale " hasFeedback>
                {getFieldDecorator("regimeFiscal", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez un régime fiscale "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.handleChange}
                  >
                    {this.state.regimeFiscal.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.value}
                          label={element.name}
                        >
                          {element.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    Taux Rendement Avant Imposition
                  </label>
                }
              >
                {getFieldDecorator("tauxRendementAvantImposition", {
                  rules: [
                    {
                      required: true,
                      message: "Champs Obligatoire"
                    }
                  ]
                })(
                  <InputNumber
                    addonAfter="%"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={20}>
              <Divider orientation="left">Paramètres de souscription</Divider>
            </Col>
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    Durée Minimale de Souscription
                  </label>
                }
              >
                {getFieldDecorator("dureeMinimalSouscription", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9\b]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <InputNumber
                    addonAfter="Mois"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    Renouvellement Contrat par tacite de reconduction
                  </label>
                }
              >
                {getFieldDecorator("renouvellementContratTaciteReconduction", {
                  valuePropName: "unchecked",
                  initialValue: false
                })(
                  <Radio.Group
                    buttonStyle="solid"
                    defaultValue={true}
                    onChange={this.onChange}
                  >
                    <Radio.Button value={true}>Oui</Radio.Button>
                    <Radio.Button value={false}>Non</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              {formItemInputWithAddons(
                "Montant minimal de contribution",
                "montantMinContribution",
                "DHS",
                getFieldDecorator
              )}
            </Col>
            <Col span={11}>
              <Form.Item label="Mode de gestion" hasFeedback>
                {getFieldDecorator("modeGestion", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez un mode de gestion "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.onChangeModeGestion}
                  >
                    {this.state.modesGestions.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.value}
                          label={element.name}
                        >
                          {element.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {this.state.modeGestion !== "MOUDARABA" ? (
              <Col span={11}>
                {formItemInputWithAddons(
                  "Frais fixe WAKALA BILISTITHMAR",
                  "fraisFixeWakalabilIstithmar",
                  "DHS",
                  getFieldDecorator
                )}
              </Col>
            ) : null}

            {this.state.modeGestion !== "MOUDARABA" ? (
              <Col span={11}>
                {formItemInputWithAddons(
                  "Superformance WAKALA BIL ISTITHMAR",
                  "surperformanceWakalabilIstithmar",
                  "%",
                  getFieldDecorator
                )}
              </Col>
            ) : null}
            {this.state.modeGestion === "MOUDARABA" ? (
              <Col span={11}>
                {formItemInputWithAddons(
                  "Profit Moudaraba",
                  "profitMoudaraba",
                  "%",
                  getFieldDecorator
                )}
              </Col>
            ) : null}
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    Mode de Calcul du Capital Constitue
                  </label>
                }
                hasFeedback
              >
                {getFieldDecorator("modeCalculCapitalConstitue", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez un mode de gestion "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.handleChange}
                  >
                    {this.state.modeCapitalReconstitue.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.value}
                          label={element.name}
                        >
                          {element.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create({
  name: "global_state",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      numeroCompte: Form.createFormField({
        ...props.numeroCompte,
        value: props.numeroCompte.value
      }),
      libelleCompte: Form.createFormField({
        ...props.libelleCompte,
        value: props.libelleCompte.value
      }),
      natureFiscale: Form.createFormField({
        ...props.natureFiscale,
        value: props.natureFiscale.value
      }),
      tauxRendementAvantImposition: Form.createFormField({
        ...props.tauxRendementAvantImposition,
        value: props.tauxRendementAvantImposition.value
      }),
      revenuGlobal: Form.createFormField({
        ...props.revenuGlobal,
        value: props.revenuGlobal.value
      }),
      dureeMinimalSouscription: Form.createFormField({
        ...props.dureeMinimalSouscription,
        value: props.dureeMinimalSouscription.value
      }),
      renouvellementContratTaciteReconduction: Form.createFormField({
        ...props.renouvellementContratTaciteReconduction,
        value: props.renouvellementContratTaciteReconduction.value
      }),
      montantMinContribution: Form.createFormField({
        ...props.montantMinContribution,
        value: props.montantMinContribution.value
      }),
      modeGestion: Form.createFormField({
        ...props.modeGestion,
        value: props.modeGestion.value
      }),
      fraisFixeWakalabilIstithmar: Form.createFormField({
        ...props.fraisFixeWakalabilIstithmar,
        value: props.fraisFixeWakalabilIstithmar.value
      }),
      surperformanceWakalabilIstithmar: Form.createFormField({
        ...props.surperformanceWakalabilIstithmar,
        value: props.surperformanceWakalabilIstithmar.value
      }),
      profitMoudaraba: Form.createFormField({
        ...props.profitMoudaraba,
        value: props.profitMoudaraba.value
      }),
      modeCalculCapitalConstitue: Form.createFormField({
        ...props.modeCalculCapitalConstitue,
        value: props.modeCalculCapitalConstitue.value
      }),
      regimeFiscal: Form.createFormField({
        ...props.regimeFiscal,
        value: props.regimeFiscal.value
      }),
      poolInvestissment: Form.createFormField({
        ...props.poolInvestissment,
        value: props.poolInvestissment.value
      })
    };
  }
})(StepThree);
