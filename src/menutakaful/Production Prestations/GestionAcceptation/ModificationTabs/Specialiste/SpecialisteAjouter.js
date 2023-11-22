/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import { Form, Select, Button, DatePicker, Input, notification ,Spin } from "antd";
import {
  ajouterAcceptationSpecialiste,
  ajouterAcceptationTestMedical,
  getAcceptationSpecialisteByAcceptation
} from "../../AcceptationsAPI";

const { Option } = Select;
const { TextArea } = Input;

class LaboForm extends Component {
  state = { 
    medSpecialiste:[],
    statuts: false ,  
    loading: false 
  };
  handleSubmit = e => {
    this.setState({ loading: true , statuts: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterSpecialiste(values);
      }
    });
  };

  componentDidMount() {

    this.acceptationsMedecinSpecialiste(this.props.record.id);
  }

  async acceptationsMedecinSpecialiste(id) {
    let response = await getAcceptationSpecialisteByAcceptation(id);
    console.log("response:", response.data);
    if (response.data.length !== 0) {
      this.setState({ medSpecialiste: response.data ,statuts: true });
    }
  }
  async ajouterSpecialiste(values) {
    try {
      values.dateConsultation = values.dateConsultation.format("YYYY-MM-DD");
      values.specialiste = { id: values.specialiste };
      values.acceptation = this.props.record;
      let response = await ajouterAcceptationSpecialiste(values);

      let tests = {
        acceptationSpecialiste: { id: response.data.id },
        acceptation: { id: this.props.record.id }
      };
      let responseTest = await ajouterAcceptationTestMedical(tests);

      if (response.status === 200 && responseTest.status === 200) {
        this.props.parentCallback(response.data);
        notification.success({
          message: "bien ajouté"
        });
        this.setState({ loading: false });
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description: "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Spin spinning={this.state.loading}>
      <Form hideRequiredMark {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Specialiste" hasFeedback>
          {getFieldDecorator("specialiste", {
            valuePropName: "selected",
            rules: [
              {
                required: true,
                message: "sélectionnez un Specialiste"
              }
            ]
          })(
            <Select placeholder="sélectionnez">
              {this.props.specialistes.map(element => {
                return (
                  <Option
                    key={element.id}
                    value={element.id}
                    label={element.nom}
                  >
                    {element.nom}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Specialité" hasFeedback>
          {getFieldDecorator("specialite", {
            valuePropName: "selected",

            rules: [
              {
                required: true,
                message: "Tapez une specialité"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Nature de test" hasFeedback>
          {getFieldDecorator("natureTest", {
            valuePropName: "selected",

            rules: [
              {
                required: true,
                message: "Tapez une nature de test"
              }
            ]
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Date de consultation" hasFeedback>
          {getFieldDecorator("dateConsultation", {
            valuePropName: "selected",

            rules: [
              {
                required: true,
                message: "selectionnez une date de consultation"
              }
            ]
          })(<DatePicker className="date-style"></DatePicker>)}
        </Form.Item>
        <Form.Item label="Observations" hasFeedback>
          {getFieldDecorator("observations")(<TextArea rows={4} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button 
          type="primary" 
          htmlType="submit"
          disabled={this.state.statuts}>
            Ajouter
          </Button>
        </Form.Item>
      </Form>
      </Spin>
    );
  }
}

const SpecialisteAjouter = Form.create()(LaboForm);

export default SpecialisteAjouter;
