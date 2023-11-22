/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Button, Col, Form, Icon, Row, Select } from "antd";
import React from "react";
import { next } from "./StepsServices/next";
import { getAllPartenaire } from "../../partenaire/PartenaireAPI";
import {
  getCategorie,
  getRisque,
  selectStepZero
} from "../../ProduitDeces/ProduitDecesAPI";
import {
  BRANCH_TYPE_DECES_ET_RETRAITE,
  BRANCH_TYPE_RETRAITE
} from "../../../../constants";
const { Option } = Select;
class StepZero extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      risques: [],
      categories: [],
      partenaire: [],
      current: 0
    };
  }

  handleChange(value) {}

  componentDidMount() {
    this.getAllCategorie();
    this.getAllPartenaires();
    this.getAllRisque(BRANCH_TYPE_RETRAITE);
  }

  async getAllPartenaires() {
    let response = await getAllPartenaire();
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.risque !== "" &&
        values.categorie !== "" &&
        values.partenaire !== ""
      ) {
        next(this, 0);
      }
    });
  };

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
          <Form id="formZero" {...formItemLayout} onSubmit={this.handleSubmit}>
            {/*RISQUE :*/}
            <Col span={7}>
              <Form.Item label="Risque : " hasFeedback>
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
            {/*CATEGORIE : */}
            <Col span={8}>
              <Form.Item label="Catégorie : " hasFeedback>
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
            {/*INTERMEDIAIRE:*/}
            <Col span={9}>
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
                    placeholder="cliquez pour choisir un type"
                    onChange={this.handleChangeSelect}
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
            </Col>
            {/*NEXT BUTTON*/}
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
      })
    };
  }
})(StepZero);
