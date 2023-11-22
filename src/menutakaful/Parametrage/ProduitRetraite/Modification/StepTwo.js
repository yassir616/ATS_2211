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
  formItemLayoutResponsive
} from "../../../../util/Helpers";

const { Option } = Select;
class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionsDisciplinaires: [
        {
          value: "FIXE",
          name: "Montant fixe"
        },
        {
          value: "POURCENTAGE",
          name: "Pourcentage"
        },
        {
          value: "ASAISIR",
          name: "Montant à saisir"
        }
      ],
      rachatTotal: this.props.rachatTotal.value,
      rachatPartiel: this.props.rachatPartiel.value,
      conditionDisciplinairePartiel: this.props.conditionDisciplinairePartiel
        .value,
      conditionDisciplinaireTotale: this.props.conditionDisciplinaireTotale
        .value,
      natureConditionDisciplinairePartiel: this.props
        .natureConditionDisciplinairePartiel.value,
      natureConditionDisciplinaireTotale: this.props
        .natureConditionDisciplinaireTotale.value
    };
  }
  onChangeRachatTotal = e => {
    this.setState({
      rachatTotal: e.target.value
    });
  };
  onChangeRachatPartiel = e => {
    this.setState({
      rachatPartiel: e.target.value
    });
  };
  onChangeApplicationConditionDisciplinairePartiel = e => {
    this.setState({
      conditionDisciplinairePartiel: e.target.value
    });
  };

  onChangeApplicationConditionDisciplinaireTotale = e => {
    this.setState({
      conditionDisciplinaireTotale: e.target.value
    });
  };

  onChangeNatureConditionDisciplinairePartiel = e => {
    this.setState({
      natureConditionDisciplinairePartiel: e
    });
  };
  onChangeNatureConditionDisciplinaireTotale = e => {
    this.setState({
      natureConditionDisciplinaireTotale: e
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayoutResponsive} id="formadd">
            <Col span={20}>
              <Divider orientation="left">Modalités de rachat total</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Application de rachat total ">
                {getFieldDecorator("rachatTotal", { initialValue: false })(
                  <Radio.Group
                    buttonStyle="solid"
                    defaultValue={false}
                    onChange={this.onChangeRachatTotal}
                  >
                    <Radio.Button value={true}>Oui</Radio.Button>
                    <Radio.Button value={false}>Non</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>

            {this.state.rachatTotal ? (
              <Col span={11}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      Durée Minimale Souscription Avant Rachat Total
                    </label>
                  }
                >
                  {getFieldDecorator(
                    "dureeMinimalSouscriptionAvantRachatTotal",
                    {
                      rules: [
                        {
                          required: true,
                          pattern: new RegExp(/^[0-9\b]+$/),
                          message: "Format invalide!"
                        }
                      ]
                    }
                  )(
                    <InputNumber
                      addonAfter="Mois"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            ) : null}
            {this.state.rachatTotal ? (
              <Col span={11}>
                <Form.Item label="Application de la condition disciplinaire ">
                  {getFieldDecorator("conditionDisciplinaireTotale", {
                    initialValue: false
                  })(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={false}
                      onChange={
                        this.onChangeApplicationConditionDisciplinaireTotale
                      }
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            ) : null}
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    Nature de la condition disciplinaire
                  </label>
                }
                hasFeedback
              >
                {getFieldDecorator("natureConditionDisciplinaireTotale", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez une condition "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.onChangeNatureConditionDisciplinaireTotale}
                  >
                    {this.state.conditionsDisciplinaires.map(element => {
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
            {this.state.natureConditionDisciplinaireTotale !== "ASAISIR" ? (
              <Col span={11}>
                {formItemInputWithAddons(
                  "Valeur de la condition disciplinaire",
                  "valeurConditionDisciplinaireTotale",
                  this.state.natureConditionDisciplinaireTotale === "FIXE"
                    ? "DHS"
                    : "%",
                  getFieldDecorator
                )}
              </Col>
            ) : null}

            <Col span={20}>
              <Divider orientation="left">Modalités de rachat Partiel</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Application de rachat partiel ">
                {getFieldDecorator("rachatPartiel", {
                  initialValue: false
                })(
                  <Radio.Group
                    buttonStyle="solid"
                    defaultValue={false}
                    onChange={this.onChangeRachatPartiel}
                  >
                    <Radio.Button value={true}>Oui</Radio.Button>
                    <Radio.Button value={false}>Non</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>

            {this.state.rachatPartiel ? (
              <Col span={11}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      Durée Minimale Souscription Avant Rachat Partiel
                    </label>
                  }
                >
                  {getFieldDecorator(
                    "dureeMinimalSouscriptionAvantRachatPartiel",
                    {
                      rules: [
                        {
                          required: true,
                          pattern: new RegExp(/^[0-9\b]+$/),
                          message: "Format invalide!"
                        }
                      ]
                    }
                  )(
                    <InputNumber
                      addonAfter="Mois"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            ) : null}
            {this.state.rachatPartiel ? (
              <Col span={11}>
                <Form.Item label="Application de la condition disciplinaire ">
                  {getFieldDecorator("conditionDisciplinairePartiel", {
                    initialValue: false
                  })(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={false}
                      onChange={
                        this.onChangeApplicationConditionDisciplinairePartiel
                      }
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            ) : null}
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    Nature de la condition disciplinaire
                  </label>
                }
                hasFeedback
              >
                {getFieldDecorator("natureConditionDisciplinairePartiel", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez une condition "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.onChangeNatureConditionDisciplinairePartiel}
                  >
                    {this.state.conditionsDisciplinaires.map(element => {
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
            {this.state.natureConditionDisciplinairePartiel !== "ASAISIR" ? (
              <Col span={11}>
                {formItemInputWithAddons(
                  "Valeur de la condition disciplinaire",
                  "valeurConditionDisciplinairePartiel",
                  this.state.natureConditionDisciplinairePartiel === "FIXE"
                    ? "DHS"
                    : "%",
                  getFieldDecorator
                )}
              </Col>
            ) : null}

            {this.state.rachatPartiel ? (
              <Col span={11}>
                {formItemInputWithAddons(
                  "Valeur de la condition disciplinaire",
                  "valeurConditionDisciplinairePartiel",
                  "%",
                  getFieldDecorator
                )}
              </Col>
            ) : null}
            {this.state.rachatPartiel ? (
              <Col span={11}>
                <Form.Item label="Nombre maximum de rachat partiel">
                  {getFieldDecorator("nombreMaximumRachatPartiel", {
                    rules: [
                      {
                        required: true,
                        message: "Champs Obligatoire"
                      }
                    ]
                  })(
                    <InputNumber
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            ) : null}
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
      rachatTotal: Form.createFormField({
        ...props.rachatTotal,
        value: props.rachatTotal.value
      }),
      dureeMinimalSouscriptionAvantRachatTotal: Form.createFormField({
        ...props.dureeMinimalSouscriptionAvantRachatTotal,
        value: props.dureeMinimalSouscriptionAvantRachatTotal.value
      }),
      conditionDisciplinaireTotale: Form.createFormField({
        ...props.conditionDisciplinaireTotale,
        value: props.conditionDisciplinaireTotale.value
      }),
      natureConditionDisciplinaireTotale: Form.createFormField({
        ...props.natureConditionDisciplinaireTotale,
        value: props.natureConditionDisciplinaireTotale.value
      }),
      valeurConditionDisciplinaireTotale: Form.createFormField({
        ...props.valeurConditionDisciplinaireTotale,
        value: props.valeurConditionDisciplinaireTotale.value
      }),
      rachatPartiel: Form.createFormField({
        ...props.rachatPartiel,
        value: props.rachatPartiel.value
      }),
      dureeMinimalSouscriptionAvantRachatPartiel: Form.createFormField({
        ...props.dureeMinimalSouscriptionAvantRachatPartiel,
        value: props.dureeMinimalSouscriptionAvantRachatPartiel.value
      }),
      conditionDisciplinairePartiel: Form.createFormField({
        ...props.conditionDisciplinairePartiel,
        value: props.conditionDisciplinairePartiel.value
      }),
      natureConditionDisciplinairePartiel: Form.createFormField({
        ...props.natureConditionDisciplinairePartiel,
        value: props.natureConditionDisciplinairePartiel.value
      }),
      valeurConditionDisciplinairePartiel: Form.createFormField({
        ...props.valeurConditionDisciplinairePartiel,
        value: props.valeurConditionDisciplinairePartiel.value
      }),
      maximumMontantRachatPartiel: Form.createFormField({
        ...props.maximumMontantRachatPartiel,
        value: props.maximumMontantRachatPartiel.value
      }),
      nombreMaximumRachatPartiel: Form.createFormField({
        ...props.nombreMaximumRachatPartiel,
        value: props.nombreMaximumRachatPartiel.value
      })
    };
  }
})(StepTwo);
