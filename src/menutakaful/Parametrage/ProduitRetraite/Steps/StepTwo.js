import "antd/dist/antd.css";

import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Row,
  Select
} from "antd";
import React from "react";

import {
  currencyFormatter,
  currencyParser,
  formItemInputWithAddons,
  formItemLayout
} from "../../../../util/Helpers";
import { prev } from "./StepsServices/prev";
import { getPoolInvestissment } from "../ProduitRetraiteAPI";

const { Option } = Select;
const naturesFiscale = [
  { name: "Epargne", value: "EPARGNE" },
  { name: "Retraite complémentaire", value: "RETRAITE" }
];

class StepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 3,
      poolInvestissments: [],
      regimeFiscal: [
        { name: "Retraite complémentaire", value: "RETRAITE" },
        { name: "Vie capitalisation", value: "VIE" }
      ],
      modeGestion: [
        { name: "Moudaraba", value: "MOUDARABA" },
        { name: "WAKALABILISTITMAR", value: "WAKALABILISTITMAR" }
      ],
      modeCalculCapitalConstitue: [
        {
          name:
            "Méthode 1 – Début de période + cotisations du mois (non investies",
          value: "METHOD1"
        },
        { name: "Méthode 2 – Fin de période", value: "METHOD2" }
      ],
      modeGestionValue: "",
      naturesFiscale: "",
      visibilite: this.props.visibilite.value,
      renouvellementContratTaciteReconduction: this.props
        .renouvellementContratTaciteReconduction.value
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.numeroCompte !== "" &&
        values.libelleCompte !== "" &&
        values.dureeMinimalSouscription !== "" &&
        values.montantMinContribution !== "" &&
        values.tauxRendementAvantImposition !== "" &&
        values.natureFiscale !== "" &&
        values.poolInvestissment !== undefined
      ) {
        this.props.submit();
      }
    });
  };
  onChangeNatureFiscale = e => {
    this.setState({
      naturesFiscale: e
    });
  };
  onChangeAbattement = () => {
    let abattement = this.state.abattement;
    this.setState({
      abattement: !abattement
    });
  };
  handleChangeModeGestion = e => {
    this.setState({
      modeGestionValue: e
    });
  };

  handleChangeModeCalcul = e => {
    this.setState({
      modeCalculCapitalConstitueValue: e
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
    const { current } = this.state;

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form
            {...formItemLayout}
            id="steptwogenerale"
            onSubmit={this.handleSubmit}
          >
            <Col span={20}>
              <Divider orientation="left">Informations générales</Divider>
            </Col>
            <Row>
              <Col span={10}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"N° Compte Takaful"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("numeroCompte", {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Intitulé du Compte Takaful"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("libelleCompte", {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Durée minimale de souscription"}
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
                      type="number"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Renouvellement par tacite reconduction"}
                    </label>
                  }
                >
                  {getFieldDecorator(
                    "renouvellementContratTaciteReconduction",
                    {
                      initialValue: this.state
                        .renouvellementContratTaciteReconduction
                    }
                  )(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={
                        this.state.renouvellementContratTaciteReconduction
                      }
                      onChange={this.onChange}
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
                {formItemInputWithAddons(
                  "Minimum de la contribution initiale",
                  "montantMinContribution",
                  "DH",
                  getFieldDecorator
                )}
                {formItemInputWithAddons(
                  "Taux de rendement cible avant imposition",
                  "tauxRendementAvantImposition",
                  "%",
                  getFieldDecorator
                )}
              </Col>
              <Col span={13}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Mode de gestion"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("modeGestion", {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Select
                      placeholder="-sélectionnez -"
                      onChange={this.handleChangeModeGestion}
                    >
                      {this.state.modeGestion.map(element => {
                        return (
                          <Option value={element.value} label={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                {this.state.modeGestionValue === "WAKALABILISTITMAR"
                  ? formItemInputWithAddons(
                      "Frais fixe WakalabilIstithmar",
                      "fraisFixeWakalabilIstithmar",
                      "DH",
                      getFieldDecorator
                    )
                  : null}
                {this.state.modeGestionValue === "WAKALABILISTITMAR"
                  ? formItemInputWithAddons(
                      "Surperformance WakalabilIstithmar",
                      "surperformanceWakalabilIstithmar",
                      "%",
                      getFieldDecorator
                    )
                  : null}
                {this.state.modeGestionValue === "MOUDARABA"
                  ? formItemInputWithAddons(
                      "Profit Moudaraba",
                      "profitMoudaraba",
                      "%",
                      getFieldDecorator
                    )
                  : null}
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Mode de calcul du capital constitué revalorisé"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("modeCalculCapitalConstitue", {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Select
                      placeholder="-sélectionnez -"
                      onChange={this.handleChangeModeCalcul}
                    >
                      {this.state.modeCalculCapitalConstitue.map(element => {
                        return (
                          <Option value={element.value} label={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Col span={20}>
              <Divider orientation="left">Informations fiscales</Divider>
            </Col>
            <Row>
              <Col span={10}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Pool d'investissement"}
                    </label>
                  }
                  hasFeedback
                >
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
                          <Option value={element.id} label={element.libelle}>
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Nature fiscale du produit"}
                    </label>
                  }
                >
                  {getFieldDecorator("natureFiscale", {
                    rules: [
                      {
                        required: true,
                        message: "entrez la nature fiscale"
                      }
                    ]
                  })(
                    <Select
                      placeholder="-sélectionnez -"
                      onChange={this.onChangeNatureFiscale}
                    >
                      {naturesFiscale.map(element => {
                        return (
                          <Option value={element.value} label={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                {this.state.naturesFiscale === "RETRAITE" ? (
                  <Form.Item label="Avec abattement">
                    {getFieldDecorator("visibilite", {
                      initialValue: this.state.visibilite
                    })(
                      <Radio.Group
                        buttonStyle="solid"
                        defaultValue={this.state.visibilite}
                        onChange={this.onChangeAbattement}
                      >
                        <Radio.Button value={true}>Oui</Radio.Button>
                        <Radio.Button value={false}>Non</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>
                ) : null}

                {this.state.naturesFiscale === "RETRAITE" &&
                this.state.abattement
                  ? formItemInputWithAddons(
                      "Revenu global imposable",
                      "revenuGlobal",
                      "DH",
                      getFieldDecorator
                    )
                  : null}
              </Col>
              <Col span={10}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Régime fiscale"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("regimeFiscal", {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Select
                      placeholder="-sélectionnez -"
                      onChange={this.handleChange}
                    >
                      {this.state.regimeFiscal.map(element => {
                        return (
                          <Option value={element.value} label={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Col span={24} style={{ marginTop: 30 }}>
              {current > 0 && (
                <Button onClick={() => prev(this)}>
                  <Icon type="arrow-left" />
                  Précédent
                </Button>
              )}
              {current === 3 && (
                <Button
                  type="primary"
                  form="steptwogenerale"
                  htmlType="submit"
                  style={{ marginLeft: 8, marginBottom: 25 }}
                >
                  <Icon type="save" />
                  Enregistrer
                </Button>
              )}
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
      tauxRendementAvantImposition: Form.createFormField({
        ...props.tauxRendementAvantImposition,
        value: props.tauxRendementAvantImposition.value
      }),
      poolInvestissment: Form.createFormField({
        ...props.poolInvestissment,
        value: props.poolInvestissment.value
      }),
      natureFiscale: Form.createFormField({
        ...props.natureFiscale,
        value: props.natureFiscale.value
      }),
      revenuGlobal: Form.createFormField({
        ...props.revenuGlobal,
        value: props.revenuGlobal.value
      }),
      regimeFiscal: Form.createFormField({
        ...props.regimeFiscal,
        value: props.regimeFiscal.value
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

      visibilite: Form.createFormField({
        ...props.visibilite,
        value: props.visibilite.value
      })
    };
  }
})(StepTwo);
