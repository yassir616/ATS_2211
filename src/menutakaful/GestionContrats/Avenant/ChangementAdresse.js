/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Divider,
  Select,
  InputNumber,
  Button,
  Descriptions,
  notification,
  AutoComplete
} from "antd";
import { getVois } from "../../Participants/ParticipantAPI";
import { getAllVille } from "../../../util/VillesAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;
class ChangementAdresse extends Component {
  state = {
    vois: [],
    villes: []
  };
  async componentDidMount() {
    let voisResponce = await getVois();
    this.getAllVilles();
    this.setState({ vois: [...voisResponce.data] });
  }

  async getAllVilles() {
    let responseVille = await getAllVille();
    let helpArray = [];
    responseVille.data.forEach(element => {
      const object = element.name;
      helpArray.push(object);
    });
    this.setState({ villes: helpArray });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        const key = `open${Date.now()}`;
        const btn = (
          <div>
            <Button
              type="primary"
              onClick={() => this.handleConfirm(values, key)}
              className="not-rounded"
            >
              Confirmer
            </Button>
            <Button
              onClick={() => notification.close(key)}
              style={{ marginLeft: 8 }}
              className="not-rounded"
            >
              Fermer
            </Button>
          </div>
        );
        notification.info({
          message: "Confirmation",
          description: (
            <div>
              <Divider />
              <Descriptions bordered>
                <Descriptions.Item label="Pays">
                  {values.adressPays}
                </Descriptions.Item>
                <Descriptions.Item label="Ville">
                  {values.adressVille.label}
                </Descriptions.Item>
                <Descriptions.Item label="Voie">
                  {values.adressVois}
                </Descriptions.Item>
                <Descriptions.Item label="Code Postal">
                  {values.adressCodePostal}
                </Descriptions.Item>
                <Descriptions.Item label="Numéro">
                  {values.adressNumero}
                </Descriptions.Item>
                <Descriptions.Item label="Complément d'adresse">
                  {values.adressComplement}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ),
          btn,
          key,
          style: {
            width: 880,
            marginLeft: 335 - 1280
          },
          duration: 0
        });
      }
    });
  };

  handleConfirm = (values, keyn) => {
    this.props.saveRequest(values);
    notification.close(keyn);

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => notification.close(key)}
      >
        Confirm
      </Button>
    );
    notification.info({
      message: "confirmation",
      description: "l'avenant vien d'etre ajoute au contrat",
      btn,
      duration: 0,
      key
    });
  };

  render() {
    const adresse = this.props.adresse;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <h4>Adresse :</h4>
            <Divider></Divider>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Pays">
              {getFieldDecorator("adressPays", {
                rules: [{ required: true, message: "selecte un pays" }]
              })(<Input placeholder="pays" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ville">
              {getFieldDecorator("adressVille", {
                rules: [{ required: true, message: "selecte une ville" }]
              })(
                <AutoComplete
                  size="default"
                  dataSource={this.state.villes}
                  onSelect={this.onChangeVille}
                  allowClear={false}
                  labelInValue
                  placeholder="ajouter une ville"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Voie">
              {getFieldDecorator("adressVois", {
                rules: [{ required: true, message: "selecte une vois" }]
              })(
                <Select placeholder="Voie">
                  {this.state.vois.map(element => {
                    return (
                      <Option key={element.id} value={element.value}>
                        {element.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Code Postal">
              {getFieldDecorator("adressCodePostal", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <InputNumber
                  className="not-rounded"
                  style={{ width: "100%" }}
                  placeholder="entrez le Code Postal"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Numéro">
              {getFieldDecorator("adressNumero", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <InputNumber
                  className="not-rounded"
                  style={{ width: "100%" }}
                  placeholder="entrez le Numero"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                  min="0"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Complément d'adresse">
              {getFieldDecorator("adressComplement")(
                <Input
                  className="not-rounded"
                  style={{ width: "100%" }}
                  placeholder="entrez le un complément"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Adresse Complete">
              {getFieldDecorator("adressComplete")(
                <Input className="not-rounded" style={{ width: "100%" }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Button
          key="submit"
          type="primary"
          onClick={this.handleSubmit}
          className="not-rounded"
        >
          Ajouter
        </Button>
      </Form>
    );
  }
}

export default Form.create()(ChangementAdresse);
