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
import { next } from "./StepsServices/next";
import { prev } from "./StepsServices/prev";
import {
  formItemLayout,
  formItemInputWithAddons,
  currencyFormatter,
  currencyParser
} from "../../../../util/Helpers";

const { Option } = Select;

class StepModalite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 2,
      rachatTotal: this.props.rachatTotal.value,
      rachatPartiel: this.props.rachatPartiel.value,
      natureConditionDisciplinaireTotale: [
        { name: "Montant fixe", value: "FIXE" },
        { name: "Pourcentage", value: "POURCENTAGE" },
        { name: "Montant à saisir", value: "ASAISIR" }
      ],
      natureConditionDisciplinaireTotaleValue: this.props
        .natureConditionDisciplinaireTotale.value,
      natureConditionDisciplinairePartielValue: this.props
        .natureConditionDisciplinairePartiel.value,
      conditionDisciplinairePartiel: this.props.conditionDisciplinairePartiel
        .value,
      conditionDisciplinaireTotale: this.props.conditionDisciplinaireTotale
        .value
    };
  }
  radioGroup = (label, field, fieldDecorater, defaultValue) => {
    const fieldToAdd = field;
    return (
      <Form.Item
        label={<label style={{ whiteSpace: "normal" }}>{label}</label>}
      >
        {fieldDecorater(fieldToAdd, {
          initialValue: defaultValue
        })(
          <Radio.Group buttonStyle="solid" defaultValue={defaultValue}>
            <Radio.Button value={true}>Oui</Radio.Button>
            <Radio.Button value={false}>Non</Radio.Button>
          </Radio.Group>
        )}
      </Form.Item>
    );
  };

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
  onChangeNatureConditionDT = e => {
    this.setState({
      natureConditionDisciplinaireTotaleValue: e
    });
  };
  onChangeNatureConditionDP = e => {
    this.setState({
      natureConditionDisciplinairePartielValue: e
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.natureConditionDisciplinaireTotale !== "" &&
        values.natureConditionDisciplinairePartiel !== ""
      ) {
        next(this, 2);
      }
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
            id="stepmodalite"
            onSubmit={this.handleSubmit}
          >
            <Col span={20}>
              <Divider orientation="left">Modalités de rachat</Divider>
            </Col>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      Application de rachat totale
                    </label>
                  }
                >
                  {getFieldDecorator("rachatTotal", {
                    initialValue: this.state.rachatTotal
                  })(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={this.state.rachatTotal}
                      onChange={this.onChangeRachatTotal}
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
                {this.state.rachatTotal ? (
                  <Form.Item
                    label={
                      <label style={{ whiteSpace: "normal" }}>
                        Durée minimale de souscription
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
                      <Input
                        addonAfter="Mois"
                        placeholder="avant d’opérer une demande de rachat total"
                      />
                    )}
                  </Form.Item>
                ) : null}
                {this.state.rachatTotal
                  ? this.radioGroup(
                      "Application de condition disciplinaire totale",
                      "conditionDisciplinaireTotale",
                      getFieldDecorator,
                      this.state.conditionDisciplinaireTotale
                    )
                  : null}
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Nature de la condition disciplinaire"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("natureConditionDisciplinaireTotale", {
                    rules: [{ required: true }]
                  })(
                    <Select
                      placeholder="Selectionnez ..."
                      onChange={this.onChangeNatureConditionDT}
                    >
                      {this.state.natureConditionDisciplinaireTotale.map(
                        element => {
                          return (
                            <Option value={element.value} label={element.value}>
                              {element.name}
                            </Option>
                          );
                        }
                      )}
                    </Select>
                  )}
                </Form.Item>
                {this.state.natureConditionDisciplinaireTotaleValue === "FIXE"
                  ? formItemInputWithAddons(
                      "Valeur de la condition disciplinaire",
                      "valeurConditionDisciplinaireTotale",
                      "DH",
                      getFieldDecorator
                    )
                  : null}
                {this.state.natureConditionDisciplinaireTotaleValue ===
                "POURCENTAGE"
                  ? formItemInputWithAddons(
                      "Valeur de la condition disciplinaire",
                      "valeurConditionDisciplinaireTotale",
                      "%",
                      getFieldDecorator
                    )
                  : null}
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Application de rachat partiel"}
                    </label>
                  }
                >
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
                {this.state.rachatPartiel
                  ? formItemInputWithAddons(
                      "Maximum du montant de rachat partiel",
                      "maximumMontantRachatPartiel",
                      "%",
                      getFieldDecorator
                    )
                  : null}
                {this.state.rachatPartiel
                  ? formItemInputWithAddons(
                      "Nombre maximum de rachat partiel",
                      "nombreMaximumRachatPartiel",
                      "",
                      getFieldDecorator
                    )
                  : null}
                {this.state.rachatPartiel ? (
                  <Form.Item
                    label={
                      <label style={{ whiteSpace: "normal" }}>
                        {"Durée minimale de souscription"}
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
                        placeholder="avant une demande de rachat partiel"
                        type="number"
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                ) : null}
                {this.state.rachatPartiel
                  ? this.radioGroup(
                      "Application de condition discip partiel",
                      "conditionDisciplinairePartiel",
                      getFieldDecorator,
                      this.state.conditionDisciplinairePartiel
                    )
                  : null}
                <Form.Item
                  label={
                    <label style={{ whiteSpace: "normal" }}>
                      {"Nature de la condition disciplinaire"}
                    </label>
                  }
                  hasFeedback
                >
                  {getFieldDecorator("natureConditionDisciplinairePartiel", {
                    rules: [{ required: true }]
                  })(
                    <Select
                      placeholder="Selectionnez ..."
                      onChange={this.onChangeNatureConditionDP}
                    >
                      {this.state.natureConditionDisciplinaireTotale.map(
                        element => {
                          return (
                            <Option value={element.value} label={element.value}>
                              {element.name}
                            </Option>
                          );
                        }
                      )}
                    </Select>
                  )}
                </Form.Item>
                {this.state.natureConditionDisciplinairePartielValue === "FIXE"
                  ? formItemInputWithAddons(
                      "Valeur de la condition disciplinaire",
                      "valeurConditionDisciplinairePartiel",
                      "DH",
                      getFieldDecorator
                    )
                  : null}
                {this.state.natureConditionDisciplinairePartielValue ===
                "POURCENTAGE"
                  ? formItemInputWithAddons(
                      "Valeur de la condition disciplinaire",
                      "valeurConditionDisciplinairePartiel",
                      "%",
                      getFieldDecorator
                    )
                  : null}
              </Col>
            </Row>
            <Col span={24}>
              <Form.Item>
                {current > 0 && (
                  <Button style={{ marginLeft: 8 }} onClick={() => prev(this)}>
                    <Icon type="arrow-left" />
                    Précédent
                  </Button>
                )}
                {current === 2 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginBottom: "25px", marginLeft: "10px" }}
                  >
                    Suivant
                    <Icon type="arrow-right" />
                  </Button>
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
      maximumMontantRachatPartiel: Form.createFormField({
        ...props.maximumMontantRachatPartiel,
        value: props.maximumMontantRachatPartiel.value
      }),
      nombreMaximumRachatPartiel: Form.createFormField({
        ...props.nombreMaximumRachatPartiel,
        value: props.nombreMaximumRachatPartiel.value
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
      })
    };
  }
})(StepModalite);
