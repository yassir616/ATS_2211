/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Col, Divider, Form, Input, Row, Select } from "antd";
import React, { Component } from "react";
import { getPeriodicite } from "../../../GestionContrats/ContratsAPI";
import { getCategorie, getRisque } from "../ProduitDecesAPI";
import {
  BRANCH_TYPE_DECES,
  BRANCH_TYPE_DECES_ET_RETRAITE
} from "../../../../constants";
const { Option } = Select;
class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      risques: [],
      categories: [],
      periodicite: []
    };
  }

  componentDidMount() {
    this.getAllRisque(BRANCH_TYPE_DECES);
    this.getAllCategorie();
    this.getAllPeriodicite();
  }

  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }

  async getAllRisque(value) {
    let response = await getRisque(value);
    this.setState({
      risques: response.data.content
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayout} id="formadd">
            <Col span={20}>
              <Divider orientation="left">Informations générales</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Risque" hasFeedback>
                {getFieldDecorator("risque", {
                  rules: [
                    {
                      required: true,
                      message: "Choisissez un risque"
                    }
                  ]
                })(
                  <Select
                    placeholder="-sélectionnez -"
                    onChange={this.handleChange}
                  >
                    {this.state.risques.map(element => {
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
            <Col span={11}>
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
            <Col span={11}>
              <Form.Item label="Libelle">
                {getFieldDecorator("libelle", {
                  rules: [
                    {
                      required: true,
                      message: "entrez la libelle"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11}>
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
              <Divider orientation="left">Périodicité</Divider>
            </Col>
            <Col span={24} offset={2}>
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
      periodicites: Form.createFormField({
        ...props.periodicites,
        value: props.periodicites.value
      })
    };
  }
})(StepOne);
