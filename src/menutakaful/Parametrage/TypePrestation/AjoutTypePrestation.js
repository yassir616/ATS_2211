import "./AjoutTypePrestation.css";
import "antd/dist/antd.css";

import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  notification,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { ajoutPrestation } from "./PrestationAPI";
import { getFamilleProduit } from "../ProduitDeces/ProduitDecesAPI";
const { Option } = Select;
class AjoutTypePrestation extends Component {
  state = { visible: false, familles: [] };
  componentDidMount() {
    this.getAllFamille();
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  async getAllFamille() {
    let response = await getFamilleProduit();

    this.setState({
      familles: response.data.content
    });
  }
  async ajouterPrestation(values) {
    try {
      let response = await ajoutPrestation(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "La creation du type prestation est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "Ce type prestation existe déja") {
        notification.error({
          message: "Ce type prestation existe déja."
        });
      } else {
        notification.error({
          message: "Takaful",
          description:
            error.message ||
            "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
        });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterPrestation(values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button type="primary" className="add-button" onClick={this.showDrawer}>
          <Icon type="plus" /> Nouveau type prestation
        </Button>
        <Drawer
          title="Création d'un nouveau type prestation"
          onClose={this.onClose}
          width="300"
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Code">
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "Tapez le code" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le code"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Libelle">
                  {getFieldDecorator("libelle", {
                    rules: [{ required: true, message: "Tapez le libelle" }]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le libelle"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Nom">
                  {getFieldDecorator("name", {
                    rules: [{ required: true, message: "Tapez le nom" }]
                  })(
                    <Input className="not-rounded" placeholder="Tapez le nom" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Famille">
                  {getFieldDecorator("familleId", {
                    rules: [
                      { required: true, message: "Choisissez la famille" }
                    ]
                  })(
                    <Select
                      style={{ width: "100%" }}
                      placeholder="cliquez pour choisir la famille"
                    >
                      {this.state.familles.map(element => {
                        return (
                          <Option value={element.id} label={element.name}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <div className="submit-cancel">
              <Button
                className="not-rounded"
                onClick={this.onClose}
                style={{ marginRight: 8 }}
              >
                Fermer
              </Button>
              <Button className="not-rounded" type="primary" htmlType="submit">
                Ajouter
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(AjoutTypePrestation);
