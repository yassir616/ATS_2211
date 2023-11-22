/* eslint-disable react/prop-types */
import "./StepThree.css";
import "antd/dist/antd.css";
import {
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  DatePicker,
  InputNumber
} from "antd";
import React, { Component } from "react";
import Beneficiaire from "./beneficiare/Beneficiaire";
import { currencyFormatter, currencyParser } from "../../../../../util/Helpers";

const dateFormat = "DD-MM-YYYY";

const { Option } = Select;
class StepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deductibiliteFiscale: this.props.deductibiliteFiscale.value,
      attributionIrrevocable: this.props.attributionIrrevocable.value,
      beneficiairesCasDeces: [
        {
          value: "HERITIERS",
          name: "Heritiers"
        },
        {
          value: "PERSONNEDESIGNEE",
          name: "Personne designée"
        }
      ],
      montantContributionInitiale: "",
      montantContributionPeriodique: "",
      beneficiaireEnDecess: [],
      nombrePeriodicite: "",
      beneficiaireCasDeces: ""
    };
  }

  handleCallback = beneficiaireData => {
    this.setState({ beneficiaireEnDecess: beneficiaireData });
    this.props.form.setFieldsValue({
      beneficiaireEnDeces: beneficiaireData
    });
    this.props.getBenefeciaireState(beneficiaireData);
  };

  onChangeBeneficiaireCasDeces = e => {
    this.setState({
      beneficiaireCasDeces: e
    });
  };

  onChangeApplicationAttributionIrrevocable = e => {
    this.setState({
      attributionIrrevocable: e.target.value
    });
  };

  onChangeDeductibiliteFiscale = e => {
    this.setState({
      deductibiliteFiscale: e.target.value
    });
  };

  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {});
  };

  onChangePrenom = e => {
    this.setState({
      prenom: e.value
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { beneficiaireEnDeces } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };

    return (
      <div>
        <Row>
          <Col span={24} offset={1}>
            <Form
              {...formItemLayout}
              onSubmit={this.handleSabmit}
              id="stepthree"
            >
              <Col span={10}>
                <Form.Item label="Déductibilite Fiscale">
                  {getFieldDecorator("deductibiliteFiscale")(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={this.state.deductibiliteFiscale}
                      onChange={this.onChangeDeductibiliteFiscale}
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="Montant Contribution Initiale ">
                  {getFieldDecorator("montantContributionInitiale", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="DHS" className="number-input" />)}
                </Form.Item>
                <Form.Item label="Montant Contribution Periodique ">
                  {getFieldDecorator("montantContributionPeriodique", {
                    rules: [
                      {
                        pattern: new RegExp(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/),
                        required: true,
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="DHS" className="number-input" />)}
                </Form.Item>
                <Form.Item label="Date de Prelevement" hasFeedback>
                  {getFieldDecorator("datePrelevement", {
                    rules: [
                      {
                        required: true,
                        message: "entrez la Date de prelevement"
                      }
                    ]
                  })(
                    <DatePicker
                      className="date-style"
                      format={dateFormat}
                    ></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Application de l'attribution irrévocable ">
                  {getFieldDecorator("attributionIrrevocable", {
                    initialValue: this.state.attributionIrrevocable
                  })(
                    <Radio.Group
                      buttonStyle="solid"
                      defaultValue={this.state.attributionIrrevocable}
                      onChange={this.onChangeApplicationAttributionIrrevocable}
                    >
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="Nombre de périodicités">
                  {getFieldDecorator("nombrePeriodicite", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(
                    <InputNumber
                      className="number-input"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Beneficiaire en cas de deces " hasFeedback>
                  {getFieldDecorator("beneficiaireCasDeces", {
                    rules: [
                      {
                        required: true,
                        message: "choisissez une condition "
                      }
                    ]
                  })(
                    <Select
                      placeholder="-sélectionnez -"
                      onChange={this.onChangeBeneficiaireCasDeces}
                    >
                      {this.state.beneficiairesCasDeces.map(element => {
                        return (
                          <Option
                            value={element.value}
                            label={element.name}
                            key={element.id}
                          >
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {this.props.beneficiaireCasDeces.value === "PERSONNEDESIGNEE" ? (
                <Beneficiaire stepThreeCallBack={this.handleCallback}>
                  {beneficiaireEnDeces}
                </Beneficiaire>
              ) : null}
            </Form>
          </Col>
        </Row>
      </div>
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
      deductibiliteFiscale: Form.createFormField({
        ...props.deductibiliteFiscale,
        value: props.deductibiliteFiscale.value
      }),
      attributionIrrevocable: Form.createFormField({
        ...props.attributionIrrevocable,
        value: props.attributionIrrevocable.value
      }),
      beneficiaireCasDeces: Form.createFormField({
        ...props.beneficiaireCasDeces,
        value: props.beneficiaireCasDeces.value
      }),
      montantContributionInitiale: Form.createFormField({
        ...props.montantContributionInitiale,
        value: props.montantContributionInitiale.value
      }),
      montantContributionPeriodique: Form.createFormField({
        ...props.montantContributionPeriodique,
        value: props.montantContributionPeriodique.value
      }),
      nombrePeriodicite: Form.createFormField({
        ...props.nombrePeriodicite,
        value: props.nombrePeriodicite.value
      }),
      beneficiaireEnDeces: Form.createFormField({
        ...props.beneficiaireEnDeces,
        value: props.beneficiaireEnDeces.value
      }),
      datePrelevement: Form.createFormField({
        ...props.datePrelevement,
        value: props.datePrelevement.value
      })
    };
  }
})(StepThree);
