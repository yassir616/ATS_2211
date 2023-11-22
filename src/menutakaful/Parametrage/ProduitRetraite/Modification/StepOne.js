/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Col, Divider, Form, Input, Row, Select } from "antd";
import React, { Component } from "react";
import {
  formItemInputWithAddons,
  formItemLayoutResponsive
} from "../../../../util/Helpers";
import { getAllPartenaire } from "../../partenaire/PartenaireAPI";
import { getPeriodicite } from "../../../GestionContrats/ContratsAPI";
import { getCategorie } from "../../ProduitDeces/ProduitDecesAPI";

const produits = [
  "Epargne investissement Takaful Al Akhdar Bank – Retraite avec stratégie d’investissement active",
  "EpargneinvestissementTakaful Al Yousr Bank – Retraiteavec stratégie d’investissement active",
  "Epargne investissement Takaful Bureaux directs – Retraite avec stratégie d’investissement active"
];
const { Option } = Select;
class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      periodicite: [],
      partenaires: []
    };
  }

  componentDidMount() {
    this.getAllCategorie();
    this.getAllPeriodicite();
    this.getAllPartenaires();
  }

  async getAllPartenaires() {
    let response = await getAllPartenaire();
    this.setState({
      partenaires: response.data.content
    });
  }
  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }
  async getAllCategorie() {
    let response = await getCategorie();
    this.setState({
      categories: response.data.content
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayoutResponsive} id="formadd">
            <Col span={20}>
              <Divider orientation="left">Informations générales</Divider>
            </Col>
            <Col span={10}>
              <Form.Item label="Catégorie" hasFeedback>
                {getFieldDecorator("categorie", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez une catégorie "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.handleChange}
                  >
                    {this.state.categories.map(element => {
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
            <Col span={10}>
              <Form.Item label="Intermediaire" hasFeedback>
                {getFieldDecorator("partenaire", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez un intermediaire "
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.handleChange}
                  >
                    {this.state.partenaires.map(element => {
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
            </Col>

            <Col span={10}>
              <Form.Item label="Libelle">
                {getFieldDecorator("libelle", {
                  rules: [
                    {
                      required: true,
                      message: "entrez la libelle"
                    }
                  ]
                })(
                  <Select placeholder="-sélectionnez -">
                    {produits.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element}
                          label={element}
                        >
                          {element}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Abréviation">
                {getFieldDecorator("code", {
                  rules: [
                    {
                      required: true,
                      message: "entrez le code "
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={20}>
              <Divider orientation="left"></Divider>
            </Col>

            <Col span={10}>
              {formItemInputWithAddons(
                "Frais de gestion WAKALA",
                "fraisGestion",
                "%",
                getFieldDecorator
              )}
            </Col>
            <Col span={10}>
              {formItemInputWithAddons(
                "TVA frais de gestion",
                "tvaFraisGestion",
                "%",
                getFieldDecorator
              )}
            </Col>
            <Col span={10}>
              {formItemInputWithAddons(
                "Frais d'acquisition",
                "fraisAcquisition",
                "%",
                getFieldDecorator
              )}
            </Col>
            <Col span={10}>
              {formItemInputWithAddons(
                "TVA frais d'acquisition",
                "tvaFraisGestion",
                "%",
                getFieldDecorator
              )}
            </Col>

            <Col span={20}>
              <Divider orientation="left">Périodicité</Divider>
            </Col>
            <Col span={20} offset={2}>
              <Form.Item>
                {" "}
                {getFieldDecorator("periodicites", {
                  rules: [{ required: true, message: "Champs Obligatoire !" }]
                })(
                  <Select
                    mode="multiple"
                    placeholder="Selectionnez ..."
                    onChange={this.handleChange}
                  >
                    {this.state.periodicite.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.abb}
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

export default Form.create({
  name: "global_state",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      libelle: Form.createFormField({
        ...props.libelle,
        value: props.libelle.value
      }),
      code: Form.createFormField({
        ...props.code,
        value: props.code.value
      }),
      risque: Form.createFormField({
        ...props.risque,
        value: props.risque.value
      }),
      categorie: Form.createFormField({
        ...props.categorie,
        value: props.categorie.value
      }),

      partenaire: Form.createFormField({
        ...props.partenaire,
        value: props.partenaire.value
      }),
      periodicites: Form.createFormField({
        ...props.periodicites,
        value: props.periodicites.value
      }),
      fraisGestion: Form.createFormField({
        ...props.fraisGestion,
        value: props.fraisGestion.value
      }),
      tvaFraisGestion: Form.createFormField({
        ...props.tvaFraisGestion,
        value: props.tvaFraisGestion.value
      }),
      fraisAcquisition: Form.createFormField({
        ...props.fraisAcquisition,
        value: props.fraisAcquisition.value
      }),
      tvaFraisAcquisition: Form.createFormField({
        ...props.tvaFraisAcquisition,
        value: props.tvaFraisAcquisition.value
      }),
      montantAccessoire: Form.createFormField({
        ...props.montantAccessoire,
        value: props.montantAccessoire.value
      }),
      taxe: Form.createFormField({
        ...props.taxe,
        value: props.taxe.value
      })
    };
  }
})(StepOne);
