/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Button, Col, Form, Icon, Row, Select } from "antd";
import React, { Component } from "react";
import { getAllPartenaire } from "../../partenaire/PartenaireAPI";
import { getCategorie, getRisque, getSousCategorie } from "../ProduitDecesAPI";
import {
  BRANCH_TYPE_DECES,
  BRANCH_TYPE_DECES_ET_RETRAITE
} from "../../../../constants";
const { Option } = Select;
class StepZero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      risques: [],
      categories: [],
      sousCategories: [],
      partenaire: [],
      current: 0,
      type: []
    };
  }
  next = () => {
    if (this.state.current === 0) {
      const current = this.state.current + 1;
      this.setState({ current });
      this.props.check(this.state.type, current);
    }
  };
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
    this.props.check(current);
  }
  handleChangeRisque = value => {
    this.setState({
      type: this.state.risques.filter(item => item.id === value)[0]
    });
  };
  componentDidMount() {
    this.getAllRisque(BRANCH_TYPE_DECES);
    this.getAllCategorie();
    this.getAllSousCategorie();
    this.getAllPartenaires();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.risque !== "" &&
        values.categorie !== "" &&
        values.partenaire !== ""
      ) {
        this.next();
      }
    });
  };
  async getAllPartenaires() {
    let response = await getAllPartenaire();

    let array = [];

    response.data.content.forEach(element => {
      if (
        element.brancheType === BRANCH_TYPE_DECES_ET_RETRAITE ||
        element.brancheType === BRANCH_TYPE_DECES
      )
        array.push(element);
    });
    this.setState({
      partenaire: response.data.content
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
  async getAllSousCategorie() {
    let response = await getSousCategorie();

    console.log("response:", response);
    this.setState({
      sousCategories: response.data.content
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 12 }
      }
    };
    const { current } = this.state;
    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayout} id="formZero" onSubmit={this.handleSubmit}>
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
                    onChange={this.handleChangeRisque}
                  >
                    {this.state.risques.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.name}
                        >
                          {element.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
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
              <Form.Item label="Intermédiaire" hasFeedback>
                {getFieldDecorator("partenaire", {
                  rules: [
                    {
                      required: true,
                      message: "choisissez un intermédiaire "
                    }
                  ]
                })(
                  <Select
                    onChange={this.handleChangeSelect}
                    placeholder="-sélectionnez -"
                  >
                    {this.state.partenaire.map(element => {
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
              <Form.Item label="Sous catégorie" hasFeedback>
                {getFieldDecorator("sousCategorie", {
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
                    {this.state.sousCategories.map(element => {
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
            <Col span={24}>
              <Form.Item>
                {current === 0 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginBottom: "25px" }}
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
      sousCategorie: Form.createFormField({
        ...props.sousCategorie,
        value: props.sousCategorie.value
      })
    };
  }
})(StepZero);
