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
import React from "react";
import { next } from "./StepsServices/next";
import { prev } from "./StepsServices/prev";
import {
  formItemLayout,
  formItemInputWithAddons
} from "../../../../util/Helpers";
import { getPeriodicite } from "../../../GestionContrats/ContratsAPI";

const { Option } = Select;
const dateFormat = "DD-MM-YYYY";
class StepOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      periodicite: []
    };
  }

  selectMultiple = (field, context, fieldDecorater, toMap, label) => {
    const selectField = field;
    return (
      <Form.Item label={label}>
        {" "}
        {fieldDecorater(selectField, {
          rules: [{ required: true, message: "Champs Obligatoire !" }]
        })(
          <Select
            mode="multiple"
            placeholder="Selectionnez ..."
            onChange={context.handleChange}
          >
            {toMap.map(element => {
              return (
                <Option key={element.id} value={element.id} label={element.abb}>
                  {element.libelle}
                </Option>
              );
            })}
          </Select>
        )}
      </Form.Item>
    );
  };

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
        next(this, 1);
      }
    });
  };

  componentDidMount() {
    this.getAllPeriodicite(this);
  }

  getAllPeriodicite = async context => {
    let response = await getPeriodicite();
    context.setState({
      periodicite: response.data.content
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form
            {...formItemLayout}
            id="infoGenerales"
            onSubmit={this.handleSubmit}
          >
            <Col span={20}>
              <Divider orientation="left">Informations générales</Divider>
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
              {formItemInputWithAddons(
                "Frais gestion WAKALA",
                "fraisGestion",
                "%",
                getFieldDecorator
              )}
              {formItemInputWithAddons(
                "Frais d'acquisition",
                "fraisAcquisition",
                "%",
                getFieldDecorator
              )}
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

              {formItemInputWithAddons(
                "TVA frais de gestion",
                "tvaFraisGestion",
                "%",
                getFieldDecorator
              )}
              {formItemInputWithAddons(
                "TVA frais d'acquisition",
                "tvaFraisAcquisition",
                "%",
                getFieldDecorator
              )}
            </Col>
            {/** ------------------------------- */}
            <Col span={20}>
              <Divider orientation="left">Homologation</Divider>
            </Col>
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    {"Numéro d'homologation"}
                  </label>
                }
                hasFeedback
              >
                {getFieldDecorator("numeroHomologation", {
                  rules: [
                    {
                      required: true,
                      message: "enter le numéro d'homologation"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label={
                  <label style={{ whiteSpace: "normal" }}>
                    {"Date d'homologation"}
                  </label>
                }
                hasFeedback
              >
                {getFieldDecorator("dateHomologation", {
                  rules: [
                    {
                      required: true,
                      message: "entrez la date d'homologation "
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
              {this.selectMultiple(
                "periodicites",
                this,
                getFieldDecorator,
                this.state.periodicite
              )}
            </Col>
            <Col span={24}>
              <Form.Item>
                {current > 0 && (
                  <Button style={{ marginLeft: 8 }} onClick={() => prev(this)}>
                    <Icon type="arrow-left" />
                    Précédent
                  </Button>
                )}
                {current === 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginBottom: "25px", marginLeft: "10px" }}
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
      }),
      fraisGestion: Form.createFormField({
        ...props.fraisGestion,
        value: props.fraisGestion.value
      }),
      fraisAcquisition: Form.createFormField({
        ...props.fraisAcquisition,
        value: props.fraisAcquisition.value
      }),
      tvaFraisAcquisition: Form.createFormField({
        ...props.tvaFraisAcquisition,
        value: props.tvaFraisAcquisition.value
      }),
      tvaFraisGestion: Form.createFormField({
        ...props.tvaFraisGestion,
        value: props.tvaFraisGestion.value
      })
    };
  }
})(StepOne);
