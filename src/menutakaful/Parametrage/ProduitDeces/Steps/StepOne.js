/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { getPeriodicite } from "../../../GestionContrats/ContratsAPI";

const dateFormat = "DD-MM-YYYY";
const { Option } = Select;
class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periodicite: [],
      current: 1
    };
  }
  componentDidMount() {
    this.getAllPeriodicite();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.libelle !== "" &&
        values.code !== "" &&
        values.numeroHomologation !== "" &&
        values.dateHomologation !== "" &&
        values.periodicites !== undefined
      ) {
        this.next();
      }
    });
  };

  next = () => {
    if (this.state.current === 1) {
      const current = this.state.current + 1;
      this.setState({ current });
      this.props.check(current);
    }
  };

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
    this.props.check(current);
  }
  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;
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
          <Form {...formItemLayout} id="formadd" onSubmit={this.handleSubmit}>
            <Col span={20}>
              <Divider orientation="left">Informations générales</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Libellé">
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
              <Divider orientation="left">Homologation</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Numéro d'homologation" hasFeedback>
                {getFieldDecorator("numeroHomologation", {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Date d'homologation" hasFeedback>
                {getFieldDecorator("dateHomologation", {
                  rules: [
                    {
                      required: true,
                      message: "entrez le code "
                    }
                  ]
                })(
                  <DatePicker
                    format={dateFormat}
                    onChange={this.onChangeDate}
                  ></DatePicker>
                )}
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
                  <Select mode="multiple" placeholder="Selectionnez ...">
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
            <Col span={24}>
              <Form.Item>
                {current === 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginBottom: "25px" }}
                  >
                    Suivant
                    <Icon type="arrow-right" />
                  </Button>
                )}
                {current > 0 && (
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
      numeroHomologation: Form.createFormField({
        ...props.numeroHomologation,
        value: props.numeroHomologation.value
      }),
      dateHomologation: Form.createFormField({
        ...props.dateHomologation,
        value: props.dateHomologation.value
      }),
      periodicites: Form.createFormField({
        ...props.periodicites,
        value: props.periodicites.value
      })
    };
  }
})(StepOne);
