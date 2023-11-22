import React, { Component } from "react";
import "antd/dist/antd.css";
import {ajouterAcceptationTestMedical,ajouterAcceptationLaboratoire } from "../../AcceptationsAPI";
import {
  Form,
  Select,
  Button,
  DatePicker,
  Checkbox,
  Col,
  Row,
  Input,
  notification,
  Spin
} from "antd";

const { Option } = Select;
const { TextArea } = Input;

class LaboForm extends Component {
  state = { honoraires: [], loading: false };

  handleSubmit = (e) => {
    
    this.setState({ loading: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterLaboratoire(values);
      }
    });
  };

  componentDidMount() {
    let uniqueNames = [];
    let uniqueArray = [];
    const { produit } = this.props.record.contrat;

    produit.normes.forEach(norme => {
      norme.honoraires.forEach(honoraire => {
        if (honoraire.typeAuxiliaireHon.libelle === "LABORATOIRE") {
          uniqueNames.push({ label: honoraire.libelle, value: honoraire.id });

          let jsonObject = uniqueNames.map(JSON.stringify);

          let uniqueSet = new Set(jsonObject);
          uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        }
      });
    });
    this.setState({ honoraires: [...uniqueArray] });
  }

  async ajouterLaboratoire(values) {
    try {
      values.dateAnalyse = values.dateAnalyse.format("YYYY-MM-DD");
      values.dateReception = values.dateReception.format("YYYY-MM-DD");
      values.laboratoire = { id: values.laboratoire };
      values.acceptation = this.props.record;
      let response = await ajouterAcceptationLaboratoire(values);

      let testsArray = [];
      values.tests.forEach((element) => {
        let object = { id: element };
        testsArray.push(object);
      });
      let tests = {
        acceptationLaboratoire: { id: response.data.id },
        acceptation: { id: this.props.record.id },
        honoraires: testsArray,
      };
      let responseTest = await ajouterAcceptationTestMedical(tests);

      if (response.status === 200 && responseTest.status === 200) {
        this.props.parentCallback(responseTest.data);

        notification.success({
          message: "bien ajouté",
          
        });
        
    this.setState({ loading: false });
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!",
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Spin spinning={this.state.loading}>
      <Form hideRequiredMark {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Laboratoire" hasFeedback>
          {getFieldDecorator("laboratoire", {
            valuePropName: "selected",
            rules: [
              {
                required: true,
                message: "sélectionnez un laboratoire",
              },
            ],
          })(
            <Select placeholder="sélectionnez">
              {this.props.laboratoires.map((element) => {
                return (
                  <Option value={element.id} label={element.raisonSociale}>
                    {element.raisonSociale}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Date Analyse" hasFeedback>
          {getFieldDecorator("dateAnalyse", {
            valuePropName: "selected",

            rules: [
              {
                required: true,
                message: "selectionnez une date d'analyse",
              },
            ],
          })(<DatePicker className="date-style"></DatePicker>)}
        </Form.Item>

        <Form.Item label="Date réception" hasFeedback>
          {getFieldDecorator("dateReception", {
            valuePropName: "selected",

            rules: [
              {
                required: true,
                message: "selectionnez une date de réception",
              },
            ],
          })(<DatePicker className="date-style"></DatePicker>)}
        </Form.Item>
        <Form.Item label="Tests Médicaux">
          {getFieldDecorator("tests", {
            valuePropName: "checked",
          })(
            <Checkbox.Group style={{ width: "100%" }}>
              <Row>
                {this.state.honoraires.map((element) => {
                  return (
                    <Col span={8}>
                      <Checkbox value={element.value} label={element.label}>
                        {element.label}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          )}
        </Form.Item>
        <Form.Item label="Observations" hasFeedback>
          {getFieldDecorator("observations")(<TextArea rows={4} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Ajouter
          </Button>
        </Form.Item>
      </Form>
      </Spin>
    );
  }
}

const Laboratoire = Form.create()(LaboForm);

export default Laboratoire;
