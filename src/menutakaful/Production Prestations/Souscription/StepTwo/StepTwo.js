/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
  notification,
  Button
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";
import { ADMIN } from "../../../../constants";
import { getAllPointVente } from "../../../Parametrage/pointvente/PointVenteAPI";
const dateFormat = "DD-MM-YYYY";
const { Option } = Select;
class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleAdmin: false,
      pointsVentes: this.props.currentUser.pointVentes,
      periodicites: [],
      showField: false,
      points: [],
      produits: [],
      dateEffet: moment(moment(), "YYYY-MM-DD"), //.add(1, "days"),
      dateEcheance: this.props.dateEcheance.value,
      dureeContrat: this.props.dureeContrat.value,
      selectedProduct: this.props.selectedProduct.value,
     intermediare : this.props.currentUser.pointVentes[0].partenairepv.raisonSocial,
     intermediareID :  this.props.currentUser.pointVentes[0].partenairepv.id
    };
  }

  componentDidMount() {
    this.props.currentUser.roles.forEach(role => {
      if (role.name === ADMIN) {
        this.setState({
          roleAdmin: true
        });
      }
      if (role.name != ADMIN && this.state.pointsVentes.length === 1) {
        this.props.form.setFieldsValue({
          pointVente: this.state.pointsVentes[0].id
        });
      }
    });
    if (this.props.consumeData !== null) {
      if (this.props.consumeData.dureeContrat === null) {
        notification.open({
          message: "La durée du contrat manquante."
        });
      }
      if (this.props.consumeData.dateEcheance === null) {
        notification.open({
          message: "Date d'écheance manquant."
        });
      }
      if (this.props.consumeData.partenaire === null) {
        notification.open({
          message: "Le partenaire manquant."
        });
      }

      this.props.form.setFieldsValue({
        dateEffet: moment(moment(), "YYYY-MM-DD").add(1, "days"),
        dureeContrat: this.props.consumeData.dureeContrat,
        dateEcheance: moment.addRealMonth(
          this.state.dateEffet,
          this.props.consumeData.dureeContrat
        ),
        partenaire: {
          key: this.props.consumeData.partenaire.id,
          label: this.props.consumeData.partenaire.raisonSocial
        }
      });
      let date = moment.addRealMonth(
        this.state.dateEffet,
        this.props.consumeData.dureeContrat
      );

      let age = moment(date).diff(
        moment(this.props.assure.value.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
      if (this.props.consumeData != null) {
        age = moment(date).diff(
          moment(
            this.props.consumeData.assure.dateNaissance,
            "DD-MM-YYYY"
          ).format(),
          "years"
        );
        this.recherchePointVente(this.props.consumeData.partenaire.id);
      }
      console.log("age consume:", age);
      if (age >= 70) {
        this.props.form.setFieldsValue({
          dureeContrat: ""
        });
        const key = `open${Date.now()}`;
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => notification.close(key)}
          >
            Confirm
          </Button>
        );
        notification.error({
          message: "TAKAFUL",
          description: "l'âge du sociètaire à l'echeance dépasse 70.",
          btn,
          duration: 0,
          key
        });
      }
      this.setState({
        produits: this.props.produits.filter(
          item =>
            item.partenaire.raisonSocial ===
            this.props.consumeData.partenaire.raisonSocial
        )
      });

      console.log("test produits");
      console.log(this.state.produits);
      if (this.props.consumeData.produit !== null) {
        this.props.form.setFieldsValue({
          produit: {
            key: this.props.consumeData.produit.id,
            label: this.props.consumeData.produit.code
          }
        });
      }
    } else {
      this.props.form.setFieldsValue({
        dateEffet: this.state.dateEffet
      });
    }
  }

  async recherchePointVente(type) {
    let response = await getAllPointVente();
    console.log("response point:", response);
    let newDataList = [];
    this.props.currentUser.roles.forEach(element1 => {
      if (element1.name === "ADMIN") {
        response.data.content.forEach(elementPartenaire => {
          if (elementPartenaire.partenairepv.id === type) {
            newDataList.push(elementPartenaire);
            console.log("response newdatalist:", newDataList);
            this.setState({
              points: newDataList
            });
          }
        });
      }
    });
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
    const age = moment(value).diff(
      moment(this.props.assure.value.dateNaissance, "DD-MM-YYYY").format(),
      "years"
    );

    if (age >= 70) {
      this.props.form.setFieldsValue({
        dureeContrat: " "
      });

      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => notification.close(key)}
        >
          Confirm
        </Button>
      );
      notification.error({
        message: "TAKAFUL",
        description: "l'âge du sociètaire à l'échéance dépasse 70.",
        btn,
        duration: 0,
        key
      });
    }
  };

  disabledDate = current => {
    return current;
    // &&
    // current >
    //   moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").add(2, "days")
  };

  disabledDateEcheance = current => {
    return current && current < this.state.dateEffet.endOf("day");
  };

  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll();
  };
  onChange = e => {
    let date = moment.addRealMonth(this.state.dateEffet, e);
    this.setState({
      dureeContrat: e,
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e)
    });
    this.props.form.setFieldsValue({
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e),
      dureeContrat: parseInt(e)
    });
    const age = moment(date).diff(
      moment(this.props.assure.value.dateNaissance, "DD-MM-YYYY").format(),
      "years"
    );

    if (age >= 70) {
      e = "";
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => notification.close(key)}
        >
          Confirm
        </Button>
      );
      notification.error({
        message: "TAKAFUL",
        description: "l'âge du sociètaire à l'echeance dépasse 70.",
        btn,
        duration: 0,
        key
      });
    }
  };
  onChangeProduit = value => {
    let selectedproduit = this.state.produits.filter(
      item => item.code === value.label
    );

    if (selectedproduit[0].normes.length === 0) {
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => notification.close(key)}
        >
          Confirm
        </Button>
      );
      this.setState({ booleen: true });
      notification.error({
        message: "TAKAFUL",
        description: "Le produit choisi n'a aucune norme de séléction.",
        btn,
        duration: 0,
        key
      });
    }
    this.setState({
      periodicites: selectedproduit[0].periodicites,
      selectedProduct: selectedproduit[0].code
    });
  };
  partnerChange = value => {
    console.log("value partener:", value);
    this.recherchePointVente(value.key);
    this.setState({
      produits: this.props.produits.filter(
        item => item.partenaire.raisonSocial === value.label
      )
    });
    this.props.form.setFieldsValue({
      produit: "",
      preiodicite: ""
    });
  };
  onChangePointDeVente = () => {
    this.props.form.setFieldsValue({
      produit: "",
      preiodicite: ""
    });
  };
  onChangePeriodicite = value => {
    if (value.label === "Unique avec étalement") {
      this.setState({ showField: true });
    } else {
      this.setState({ showField: false });
    }
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
                  this.props.consumeData == null ? (
                    <InputNumber
                      type="number"
                      className="number-input"
                      onChange={this.onChange}
                      addonAfter="Mois"
                      defaultValue={this.state.dureeContrat}
                      placeholder="durée de contrat"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  ) : (
                    <Input disabled addonAfter="Mois"></Input>
                  )
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
                  this.state.roleAdmin ? (
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
                  ) : (
                    <Select
                    placeholder="Intermédiaire"
                    onSelect={this.partnerChange}
                    labelInValue
                  >
                  
                        <Option
                          key={this.state.intermediareID}
                          value={this.state.intermediare}
                          label={this.state.intermediare}
                        >
                          {this.state.intermediare}
                        </Option>
                  </Select>
                  )
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
                  this.props.consumeData == null ? (
                    <DatePicker
                      className="date-style"
                      format={dateFormat}
                      disabledDate={this.disabledDateEcheance}
                      onChange={this.handleEcheanceDateChange}
                      disabled
                    ></DatePicker>
                  ) : (
                    <DatePicker disabled></DatePicker>
                  )
                )}
              </Form.Item>
              <Form.Item label="Agence" hasFeedback>
                {getFieldDecorator("pointVente", {
                  rules: [
                    {
                      required: true,
                      message: "selectionnez un Intermédiaire"
                    }
                  ]
                })(
                  this.state.roleAdmin ? (
                    <Select
                      placeholder="Agence"
                      onChange={this.onChangePointDeVente}
                    >
                      {this.state.points.map(element => {
                        return (
                          <Option key={element.id} value={element.id}>
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  ) : (
                    <Select
                      placeholder="Agence"
                      onChange={this.onChangePointDeVente}
                    >
                      {this.state.pointsVentes.map(element => {
                        return (
                          <Option key={element.id} value={element.id}>
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )
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
                {getFieldDecorator("preiodicite", {
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
              {this.state.showField && (
                <Form.Item label="Nombre mensualités d’étalement de la prime unique:">
                  {getFieldDecorator(
                    "NombreMensualitesEtalementLaPrimeUnique",
                    {
                      rules: [
                        {
                          required: true,
                          message: "Format invalide !"
                        }
                      ]
                    }
                  )(
                    <InputNumber
                      className="number-input"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              )}
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
      dateEffet: Form.createFormField({
        ...props.dateEffet,
        value: props.dateEffet.value
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
      }),
      partenaire: Form.createFormField({
        ...props.partenaire,
        value: props.partenaire.value
      }),
      selectedProduct: Form.createFormField({
        ...props.selectedProduct,
        value: props.selectedProduct.value
      })
    };
  }
})(StepTwo);
