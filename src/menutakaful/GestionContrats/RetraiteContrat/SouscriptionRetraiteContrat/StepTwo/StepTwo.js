/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { currencyFormatter, currencyParser } from "../../../../../util/Helpers";

const dateFormat = "DD-MM-YYYY";
const { Option } = Select;
class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointsVentes: this.props.currentUser.pointVentes,
      periodicites: [],
      showField: false,
      produits: [],
      dateEffet: moment(moment(), "YYYY-MM-DD").add(1, "days"),
      dateEcheance: this.props.dateEcheance.value,
      dureeContrat: this.props.dureeContrat.value,
      compteJoint: this.props.compteJoint.value,
      selectedProduct: ""
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      dateEffet: this.state.dateEffet
    });
    if (this.state.pointsVentes.length === 1) {
      this.props.form.setFieldsValue({
        pointVente: this.state.pointsVentes[0].id
      });
    }
  }

  handleEffetDateChange = value => {
    if (this.state.dateEcheance !== null) {
      let echeanceDate = this.state.dateEcheance;
      this.setState({
        dateEffet: value,
        dureeContrat: echeanceDate.diff(value, "months")
      });
    }
  };

  handleEcheanceDateChange = value => {
    let effetDate = this.state.dateEffet;
    this.setState({
      dateEcheance: value,
      dureeContrat: value.diff(effetDate, "months")
    });
    this.props.form.setFieldsValue({
      dureeContrat: value.diff(effetDate, "months")
    });
  };

  disabledDate = current => {
    return (
      current &&
      current <
        moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").add(2, "days")
    );
  };

  disabledDateEcheance = current => {
    return current && current < this.state.dateEffet.endOf("day");
  };

  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll();
  };

  onChange = e => {
    this.setState({
      dureeContrat: e,
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e)
    });
    this.props.form.setFieldsValue({
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e),
      dureeContrat: parseInt(e)
    });
  };

  onChangeProduit = value => {
    let selectedProduct = this.state.produits.filter(
      item => item.code === value.label
    );
    this.setState({
      periodicites: selectedProduct[0].periodicites,
      selectedProduct: selectedProduct[0],
      dureeContrat: selectedProduct[0].dureeMinimalSouscription
    });
  };

  partnerChange = value => {
    this.setState({
      produits: this.props.produits.filter(
        item => item.partenaire.raisonSocial === value.label
      )
    });
    this.props.form.setFieldsValue({
      produit: "",
      periodicite: ""
    });
  };

  onChangePointDeVente() {
    this.props.form.setFieldsValue({
      produit: "",
      periodicite: "",
      partenaire: ""
    });
  }

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
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayout} onSubmit={this.handleSabmit} id="steptwo">
            <Col span={10}>
              <Form.Item label="Date d'effet" hasFeedback>
                {getFieldDecorator("dateEffet", {
                  valuePropName: "selected",
                  rules: [
                    {
                      required: true,
                      message: "entre la Date d'effet"
                    }
                  ]
                })(
                  <DatePicker
                    className="date-style"
                    format={dateFormat}
                    disabledDate={this.disabledDate}
                    defaultValue={this.state.dateEffet}
                    onChange={this.handleEffetDateChange}
                  ></DatePicker>
                )}
              </Form.Item>
              <Form.Item label="Durée de contrat">
                {getFieldDecorator("dureeContrat", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9\b]+$/),
                      message: "Format invalide !"
                    }
                  ]
                })(
                  <InputNumber
                    type="number"
                    className="number-input"
                    onChange={this.onChange}
                    addonAfter="Mois"
                    initialValue={this.state.dureeContrat}
                    min={
                      this.state.selectedProduct.dureeMinimalSouscription || ""
                    }
                    placeholder="durée de contrat"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}
              </Form.Item>
              <Form.Item label="Intermédiaire" hasFeedback>
                {getFieldDecorator("partenaire", {
                  rules: [
                    {
                      required: true,
                      message: "selectionnez un Intermédiaire"
                    }
                  ]
                })(
                  <Select
                    placeholder="Intermédiaire"
                    onSelect={this.partnerChange}
                    labelInValue
                  >
                    {this.props.partenaires.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.raisonSocial}
                        >
                          {element.raisonSocial}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Compte joint">
                {getFieldDecorator("compteJoint", {
                  valuePropName: "checked",
                  initialValue: this.state.compteJoint
                })(
                  <Radio.Group
                    buttonStyle="solid"
                    defaultValue={this.state.compteJoint}
                  >
                    <Radio.Button value={true}>Oui</Radio.Button>
                    <Radio.Button value={false}>Non</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={10}>
              <Form.Item label="Date d'échéance" hasFeedback>
                {getFieldDecorator("dateEcheance", {
                  rules: [
                    {
                      required: true,
                      message: "selectionnez une date d'echeance"
                    }
                  ]
                })(
                  <DatePicker
                    className="date-style"
                    format={dateFormat}
                    disabledDate={this.disabledDateEcheance}
                    onChange={this.handleEcheanceDateChange}
                  ></DatePicker>
                )}
              </Form.Item>
              <Form.Item label="Agence" hasFeedback>
                {getFieldDecorator("pointVente", {
                  rules: [
                    {
                      required: true,
                      message: "selectionnez une agence"
                    }
                  ]
                })(
                  <Select
                    placeholder="agence"
                    defaultValue={
                      this.state.pointsVentes.length === 1 &&
                      this.state.pointsVentes[0].id
                    }
                    onChange={this.onChangePointDeVente}
                  >
                    {this.state.pointsVentes.map(element => {
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
              <Form.Item label="Produit" hasFeedback>
                {getFieldDecorator("produit", {
                  rules: [
                    {
                      required: true,
                      message: "selectionnez un produit"
                    }
                  ]
                })(
                  <Select
                    placeholder="produit"
                    onChange={this.onChangeProduit}
                    labelInValue
                  >
                    {this.state.produits.map(element => {
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
                )}
              </Form.Item>
              <Form.Item label="Préiodicité" hasFeedback>
                {getFieldDecorator("periodicite", {
                  rules: [
                    {
                      required: true,
                      message: "selectionnez une preiodicite"
                    }
                  ]
                })(
                  <Select
                    onChange={this.onChangePeriodicite}
                    placeholder="Préiodicité"
                    labelInValue
                  >
                    {this.state.periodicites.map(element => {
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
          </Form>
        </Col>
      </Row>
    );
  }
}

moment.addRealMonth = function addRealMonth(d, m) {
  var fm = moment(d).add(m, "M");
  var fmEnd = moment(fm).endOf("month");
  return d.date() !== fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
    ? fm.add(1, "d")
    : fm;
};

export default Form.create({
  name: "global_state",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      NombreMensualitesEtalementLaPrimeUnique: Form.createFormField({
        ...props.NombreMensualitesEtalementLaPrimeUnique,
        value: props.NombreMensualitesEtalementLaPrimeUnique.value
      }),
      compteJoint: Form.createFormField({
        ...props.compteJoint,
        value: props.compteJoint.value
      }),
      dateEffet: Form.createFormField({
        ...props.dateEffet,
        value: props.dateEffet.value
      }),
      dureeContrat: Form.createFormField({
        ...props.dureeContrat,
        value: props.dureeContrat.value
      }),
      periodicite: Form.createFormField({
        ...props.periodicite,
        value: props.periodicite.value
      }),
      dateEcheance: Form.createFormField({
        ...props.dateEcheance,
        value: props.dateEcheance.value
      }),
      pointVente: Form.createFormField({
        ...props.pointVente,
        value: props.pointVente.value
      }),
      produit: Form.createFormField({
        ...props.produit,
        value: props.produit.value
      }),
      partenaire: Form.createFormField({
        ...props.partenaire,
        value: props.partenaire.value
      })
    };
  }
})(StepTwo);
