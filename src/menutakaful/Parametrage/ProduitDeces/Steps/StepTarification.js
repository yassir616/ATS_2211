/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";
let id = 0;
const { Option } = Select;
let current = 3;
class StepFive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tarrifications: [],
      count: 0,
      current: 3,
      typeTar: ""
    };
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    if (this.state.typeTar !== "") {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      });
    } else {
      message.warning("Choississez le type de tarrification");
    }
  };

  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values:", values);
      current = this.state.current + 1;
      let data2 = [];
      for (var index = 0; index < values.keys.length; index++) {
        this.state.typeTar === "Taux"
          ? (data2 = {
              capitalMax: parseInt(values.capitalMax[index].replace(/\s/g, "")),
              capitalMin: parseInt(values.capitalMin[index].replace(/\s/g, "")),
              ageMax: parseInt(values.ageMax[index].replace(/\s/g, "")),
              ageMin: parseInt(values.ageMin[index].replace(/\s/g, "")),
              dureeMax: parseInt(values.dureeMax[index].replace(/\s/g, "")),
              dureeMin: parseInt(values.dureeMin[index].replace(/\s/g, "")),
              differeMax: parseInt(values.differeMax[index].replace(/\s/g, "")),
              differeMin: parseInt(values.differeMin[index].replace(/\s/g, "")),
              taux: parseFloat(values.tauxAnnuel[index]),
              tauxMensuelle: parseFloat(values.tauxMensuelle[index])
            })
          : (data2 = {
              capitalMax: parseInt(values.capitalMax[index].replace(/\s/g, "")),
              capitalMin: parseInt(values.capitalMin[index].replace(/\s/g, "")),
              ageMax: parseInt(values.ageMax[index].replace(/\s/g, "")),
              ageMin: parseInt(values.ageMin[index].replace(/\s/g, "")),
              dureeMax: parseInt(values.dureeMax[index].replace(/\s/g, "")),
              dureeMin: parseInt(values.dureeMin[index].replace(/\s/g, "")),
              differeMax: parseInt(values.differeMax[index].replace(/\s/g, "")),
              differeMin: parseInt(values.differeMin[index].replace(/\s/g, "")),
              forfait: values.tauxFor[index]
            });
        this.state.tarrifications.push(data2);
      }
      this.props.check(this.state.tarrifications, this.state.typeTar, current);
    });
  };

  prev() {
    const currentPrev = this.state.current - 1;
    this.setState({ currentPrev });
    this.props.check(
      this.state.tarrifications,
      this.state.typeTar,
      currentPrev
    );
  }

  handleChangeTarrification = value => {
    this.setState({
      typeTar: value
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <div>
        <Row span={24}>
          <Col span={4}>
            <Form.Item label="Durée" required={false}>
              {getFieldDecorator(`dureeMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Mois"
                  placeholder="Min"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
              {getFieldDecorator(`dureeMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Mois"
                  placeholder="Max"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Age" required={false}>
              {getFieldDecorator(`ageMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Ans"
                  placeholder="Min"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
              {getFieldDecorator(`ageMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  formatter={currencyFormatter}
                  parser={currencyParser}
                  addonAfter="Ans"
                  placeholder="Max"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Capital" required={false}>
              {getFieldDecorator(`capitalMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Dhs"
                  placeholder="Min"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
              {getFieldDecorator(`capitalMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Dhs"
                  placeholder="Max"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Différé" required={false}>
              {getFieldDecorator(`differeMin[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Mois"
                  placeholder="Min"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
              {getFieldDecorator(`differeMax[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Mois"
                  placeholder="Max"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
          {this.state.typeTar === "Taux" ? (
            <Col span={4} offset={1}>
              <Form.Item label="Taux" required={false}>
                {getFieldDecorator(`tauxMensuelle[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(<Input addonAfter="% Mensuelle" placeholder="Mensuelle" />)}
                {getFieldDecorator(`tauxAnnuel[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      message: "Champs obligatoire."
                    }
                  ]
                })(<Input addonAfter="% Annuel" placeholder="Annuel" />)}
                {keys.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(k)}
                  />
                ) : null}
              </Form.Item>
            </Col>
          ) : (
            <Form.Item label={this.state.typeTar} required={false} key={k}>
              {getFieldDecorator(`tauxFor[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs Obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="%"
                  placeholder="Forfait"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </Form.Item>
          )}
        </Row>
      </div>
    ));

    return (
      <Row>
        <Col span={24}>
          <Form id="laststep" onSubmit={this.handleSubmited}>
            <Divider orientation="left">Tarification</Divider>
            <Row gutter={[16, 8]}>
              <Col span={4} offset={1}>
                Type de tarification:{" "}
              </Col>
              <Col flex="auto" span={12}>
                <Select
                  onChange={this.handleChangeTarrification}
                  placeholder="- Veuillez sélectionner -"
                  style={{ width: "16em" }}
                >
                  <Option value="Taux">Taux</Option>
                  <Option value="Forfait">Forfait</Option>
                </Select>
              </Col>
              <Col span={24}>{formItems}</Col>
            </Row>
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
                <Icon type="plus" /> Ajouter
              </Button>
            </Form.Item>
            <Col span={24} offset={1}>
              <Form.Item>
                {this.state.current === 3 && (
                  <Button type="primary" htmlType="submit">
                    Suivant <Icon type="arrow-right" />
                  </Button>
                )}
                {this.state.current > 0 && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    <Icon type="arrow-left" />
                    Précédent
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
export default Form.create({ name: "global_state" })(StepFive);
