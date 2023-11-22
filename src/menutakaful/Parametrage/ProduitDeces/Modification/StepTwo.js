/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import { Col, Divider, Form, Input, Row, Select } from "antd";
import React, { Component } from "react";
import { getTypePrestation } from "../../TypePrestation/PrestationAPI";
import { getExclusion } from "../../../EchangeFichiersInformatiques/EchangeFileAPI";
let exclusFamille = "Deces";
const { Option } = Select;
class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exclusions: [],
      typePrestation: []
    };
  }

  componentDidMount() {
    this.getAllExclusion(exclusFamille);

    this.getAllTypePrestation();
  }

  async getAllExclusion(famille) {
    let response = await getExclusion(famille);
    this.setState({
      exclusions: response.data.content
    });
  }

  async getAllTypePrestation() {
    let response = await getTypePrestation();
    this.setState({
      typePrestation: response.data.content
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
              <Form.Item label="Frais de gestion WAKALA">
                {getFieldDecorator("fraisGestion", {
                  rules: [
                    {
                      required: true,
                      message: "Champs Obligatoire"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="TVA frais de gestion">
                {getFieldDecorator("tvaFraisGestion", {
                  rules: [
                    {
                      required: true,
                      message: "Champs Obligatoire"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Frais d'acquisition">
                {getFieldDecorator("fraisAcquisition", {
                  rules: [
                    {
                      required: true,
                      message: "Champs Obligatoire"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="TVA frais d'acquisition'">
                {getFieldDecorator("tvaFraisGestion", {
                  rules: [
                    {
                      required: true,
                      message: "Champs Obligatoire"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>

            <Col span={11}>
              <Form.Item label="Taux taxe">
                {getFieldDecorator("taxe", {
                  rules: [
                    {
                      required: true,
                      message: "Champs Obligatoire"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={20}>
              <Divider orientation="left">Exclusion</Divider>
            </Col>
            <Col span={24} offset={2}>
              <Form.Item>
                {" "}
                {getFieldDecorator("exclusion", {
                  rules: [{ required: true, message: "Exclusion is required!" }]
                })(
                  <Select mode="multiple" placeholder="Selectionnez ...">
                    {this.state.exclusions.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.exclusionNom}
                        >
                          {element.exclusionNom}
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
      }),
      exclusion: Form.createFormField({
        ...props.exclusion,
        value: props.exclusion.value
      })
    };
  }
})(StepTwo);
