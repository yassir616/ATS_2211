/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Col, Form, Input, Radio, Row } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { Label } from "semantic-ui-react";

const { TextArea } = Input;

class StepFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showField: false,
      invaliditeOuMaladieShowField: this.props.invaliditeOuMaladie.value,
      maladiesOuOperationChirurgicaleShowField: this.props
        .maladiesOuOperationChirurgicale.value,
      suspendreAtiviteDeuxDernierAnneeShowField: this.props
        .suspendreAtiviteDeuxDernierAnnee.value,
      pensionIncapacite: this.props.pensionIncapacite.value
    };
  }
  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {});
  };
  onChange = e => {
    this.setState({
      dureeContrat: e.target.value,
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e.target.value)
    });
    this.props.form.setFieldsValue({
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e.target.value),
      dureeContrat: parseInt(e.target.value)
    });
  };
  onChangePeriodicite = value => {
    if (value.label === "Unique avec étalement") {
      this.setState({ showField: true });
    } else {
      this.setState({ showField: false });
    }
  };
  partnerChange = value => {
    this.setState({
      produits: this.props.produits.filter(
        item => item.partenaire.raisonSocial === value.label
      )
    });
  };
  handleInvaliditeOuMaladiechange = e => {
    this.setState({
      invaliditeOuMaladieShowField: !this.state.invaliditeOuMaladieShowField
    });
  };
  handleMaladiesOuOperationChirurgicaleChange = e =>
    this.setState({
      maladiesOuOperationChirurgicaleShowField: !this.state
        .maladiesOuOperationChirurgicaleShowField
    });
  handlesuspendreAtiviteDeuxDernierAnneechange = e =>
    this.setState({
      suspendreAtiviteDeuxDernierAnneeShowField: !this.state
        .suspendreAtiviteDeuxDernierAnneeShowField
    });

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Col span={24} offset={1}>
          <Form onSubmit={this.handleSabmit} id="steptwo">
            <Col span={6}>
              <Label style={{ marginBottom: "5px" }}>
                Souffrez-vous d’une invalidité ou d’une maladie ?
              </Label>
              <Form.Item>
                {getFieldDecorator("invaliditeOuMaladie", {
                  rules: [{ required: false }],
                  valuePropName: "checked",
                  initialValue: this.state.invaliditeOuMaladieShowField
                })(
                  <Radio.Group
                    style={{ marginBottom: 25 }}
                    buttonStyle="solid"
                    className="prelevement"
                    defaultValue={this.state.invaliditeOuMaladieShowField}
                    onChange={this.handleInvaliditeOuMaladiechange}
                  >
                    <Radio.Button value={false}>Non</Radio.Button>
                    <Radio.Button value={true}>Oui</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              {this.state.invaliditeOuMaladieShowField && (
                <Form.Item>
                  <Label style={{ marginBottom: "5px" }}>laquelle ?</Label>
                  {getFieldDecorator("quelleMaladieOuInvalidite", {
                    rules: [{ required: false }]
                  })(<TextArea style={{ marginRight: "10px" }}></TextArea>)}
                </Form.Item>
              )}
              <Label style={{ marginBottom: "5px" }}>
                {" "}
                Bénéficiez-vous d’une pension d’incapacité ?
              </Label>
              <Form.Item>
                {getFieldDecorator("pensionIncapacite", {
                  rules: [{ required: false }],
                  valuePropName: "checked",
                  initialValue: this.state.pensionIncapacite
                })(
                  <Radio.Group
                    className="prelevement"
                    style={{ marginBottom: 25 }}
                    buttonStyle="solid"
                    defaultValue={this.state.pensionIncapacite}
                  >
                    <Radio.Button value={false}>Non</Radio.Button>
                    <Radio.Button value={true}>Oui</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={7} offset={1}>
              <Label style={{ marginBottom: "5px" }}>
                {" "}
                Avez-vous souffert de maladies critiques ou subi des opérations
                chirurgicales ?
              </Label>
              <Form.Item>
                {getFieldDecorator("maladiesOuOperationChirurgicale", {
                  rules: [{ required: false }],
                  initialValue: this.state
                    .maladiesOuOperationChirurgicaleShowField
                })(
                  <Radio.Group
                    className="prelevement"
                    style={{ marginBottom: 25 }}
                    buttonStyle="solid"
                    defaultValue={
                      this.state.maladiesOuOperationChirurgicaleShowField
                    }
                    onChange={this.handleMaladiesOuOperationChirurgicaleChange}
                  >
                    <Radio.Button value={false}>Non</Radio.Button>
                    <Radio.Button value={true}>Oui</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              {this.state.maladiesOuOperationChirurgicaleShowField && (
                <Form.Item>
                  <Label style={{ marginBottom: "5px" }}>Quand et où ?</Label>
                  {getFieldDecorator(
                    "maladiesOuOperationChirurgicaleQuandEtOu",
                    {
                      rules: [{ required: false }]
                    }
                  )(<TextArea></TextArea>)}
                </Form.Item>
              )}
            </Col>
            <Col span={7} offset={1}>
              <Label style={{ marginBottom: "5px" }}>
                {" "}
                étiez-vous obligés de suspendre votre activité pour une durée
                supérieure à 15 jours durant les deux dernières années ?
              </Label>
              <Form.Item>
                {getFieldDecorator("suspendreAtiviteDeuxDernierAnnee", {
                  rules: [{ required: false }],
                  initialValue: this.state
                    .suspendreAtiviteDeuxDernierAnneeShowField
                })(
                  <Radio.Group
                    className="prelevement"
                    style={{ marginBottom: 25 }}
                    buttonStyle="solid"
                    defaultValue={
                      this.state.suspendreAtiviteDeuxDernierAnneeShowField
                    }
                    onChange={this.handlesuspendreAtiviteDeuxDernierAnneechange}
                  >
                    <Radio.Button value={false}>Non</Radio.Button>
                    <Radio.Button value={true}>Oui</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              {this.state.suspendreAtiviteDeuxDernierAnneeShowField && (
                <Form.Item>
                  <Label style={{ marginBottom: "5px" }}>
                    pourquoi ? et pour combien de temps ?
                  </Label>
                  {getFieldDecorator(
                    "suspendreAtiviteDeuxDernierAnneePourquiEtTemps",
                    {
                      rules: [{ required: false }]
                    }
                  )(<TextArea></TextArea>)}
                </Form.Item>
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
      maladiesOuOperationChirurgicaleQuandEtOu: Form.createFormField({
        ...props.maladiesOuOperationChirurgicaleQuandEtOu,
        value: props.maladiesOuOperationChirurgicaleQuandEtOu.value
      }),
      maladiesOuOperationChirurgicale: Form.createFormField({
        ...props.maladiesOuOperationChirurgicale,
        value: props.maladiesOuOperationChirurgicale.value
      }),
      quelleMaladieOuInvalidite: Form.createFormField({
        ...props.quelleMaladieOuInvalidite,
        value: props.quelleMaladieOuInvalidite.value
      }),
      suspendreAtiviteDeuxDernierAnneePourquiEtTemps: Form.createFormField({
        ...props.suspendreAtiviteDeuxDernierAnneePourquiEtTemps,
        value: props.suspendreAtiviteDeuxDernierAnneePourquiEtTemps.value
      }),
      invaliditeOuMaladie: Form.createFormField({
        ...props.invaliditeOuMaladie,
        value: props.invaliditeOuMaladie.value
      }),
      pensionIncapacite: Form.createFormField({
        ...props.pensionIncapacite,
        value: props.pensionIncapacite.value
      }),
      suspendreAtiviteDeuxDernierAnnee: Form.createFormField({
        ...props.suspendreAtiviteDeuxDernierAnnee,
        value: props.suspendreAtiviteDeuxDernierAnnee.value
      }),
      dureeContrat: Form.createFormField({
        ...props.dureeContrat,
        value: props.dureeContrat.value
      }),
      preiodicite: Form.createFormField({
        ...props.preiodicite,
        value: props.preiodicite.value
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
      })
    };
  }
})(StepFour);
