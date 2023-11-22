/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Icon,
  Input,
  InputNumber,
  notification,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { createPersonneMorale } from "../../../../../Participants/ParticipantAPI";
import { getAllVille } from "../../../../../../util/VillesAPI";
import {
  currencyFormatter,
  currencyParser
} from "../../../../../../util/Helpers";

const { Option } = Select;

class AddPerMorale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      villes: [],
      visible: false,
      pays: "",
      ville: "",
      vois: "",
      complement: "",
      numero: "",
      adresscomplet: ""
    };
  }

  async getAllVilles() {
    let responseVille = await getAllVille();
    this.setState({ villes: responseVille.data });
  }

  componentDidMount() {
    this.getAllVilles();
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        values.typePersonneMorale = { id: values.typePersonneMorale };
        values.secteurActivite = { id: values.secteurActivite };
        this.createPersonMorale(values);
      }
    });
  };

  async createPersonMorale(model) {
    try {
      console.log(model);
      let response = await createPersonneMorale(model);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "personne bien ajoute"
        });
        this.props.personCreation(response.data);
      }
    } catch (error) {
      this.onClose();
      console.log(error);
      if (error.response.data.message === "souscripteur already exists") {
        notification.error({
          message: "une personne et deja inscrit avec la meme patente ."
        });
      } else {
        notification.error({
          message: "Takaful",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      }
    }
  }

  onChangeVille = value => {
    this.setState({
      ville: value,
      adresscomplet:
        this.state.vois +
        " " +
        this.state.complement +
        " " +
        this.state.numero +
        " " +
        this.state.ville +
        " " +
        this.state.pays
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {this.props.titre === "Création d'un nouveau Participant" ? (
          <Button
            type="primary"
            onClick={this.showDrawer}
            style={{ borderRadius: "0px", marginBottom: "10px" }}
            className="nouveau-btn"
          >
            <Icon type="user-add" /> Nouveau participant
          </Button>
        ) : (
          <Button
            type="primary"
            style={{ backgroundColor: "#77cc6d", borderColor: "#77cc6d" }}
            shape="circle"
            icon="plus"
            onClick={this.showDrawer}
          />
        )}
        <Drawer
          title={this.props.titre}
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Raison sociale">
                  {getFieldDecorator("raisonSociale", {
                    rules: [
                      { required: true, message: "Tapez la Raison Sociale" }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez la Raison Sociale"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Abréviation">
                  {getFieldDecorator("abb", {
                    rules: [{ required: true, message: "Tapez l abb" }]
                  })(
                    <Input className="not-rounded" placeholder="Tapez l abb" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Siège social">
                  {getFieldDecorator("Siegesociale", {
                    rules: [
                      { required: true, message: "Tapez le siège social" }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le siège social"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="N°de Patente">
                  {getFieldDecorator("patente", {
                    rules: [
                      {
                        required: true,
                        message: "Svp entré patente"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      placeholder="Tapez patente"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="N°ice">
                  {getFieldDecorator("ice", {
                    rules: [{ required: true, message: "Tapez le N°ice" }]
                  })(
                    <InputNumber
                      className="not-rounded"
                      placeholder="Tapez le N°ice"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
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
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Type personne morale">
                  {getFieldDecorator("typePersonneMorale", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez un type personne morale"
                      }
                    ]
                  })(
                    <Select placeholder="Type personne morale">
                      {this.props.typePersonneMoral.map(element => {
                        return (
                          <Option key={element.id} value={element.id}>
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Secteur d'activité">
                  {getFieldDecorator("secteurActivite", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez le secteur d'activité"
                      }
                    ]
                  })(
                    <Select placeholder="Sélectionnez le secteur d'activité">
                      {this.props.secteurActivite.map(element => {
                        return (
                          <Option key={element.id} value={element.id}>
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Téléphone">
                  {getFieldDecorator("numeroDeTelephone", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp("^[0][5-7]{1}[0-9]{8}$"),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Numero de telephone"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <h4>Adress :</h4>
                <Divider></Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pays">
                  {getFieldDecorator("adressPays", {
                    rules: [{ required: true, message: "selecte un pays" }]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ville">
                  {getFieldDecorator("adressVille", {
                    rules: [{ required: true, message: "selecte une ville" }]
                  })(
                    <Select placeholder="Villes" onChange={this.onChangeVille}>
                      {this.state.villes.map(element => {
                        return (
                          <Option key={element.id} value={element.name}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Vois">
                  {getFieldDecorator("adressVois", {
                    rules: [{ required: true, message: "selecte une vois" }]
                  })(
                    <Select placeholder="Vois">
                      {this.props.vois.map(element => {
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
                <Form.Item label="Numero">
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
                      onChange={this.onChangeNumero}
                      formatter={currencyFormatter}
                      parser={currencyParser}
                      min="0"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Complement">
                  {getFieldDecorator("adressComplement")(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le un complement"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Adress Complete">
                  {getFieldDecorator("adressComplete")(
                    <Input
                      value={this.state.adresscomplet}
                      className="not-rounded"
                      style={{ width: "100%" }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "100%",
                borderTop: "1px solid #e9e9e9",
                padding: "10px 16px",
                background: "#fff",
                textAlign: "right"
              }}
            >
              <Button
                className="not-rounded"
                onClick={this.onClose}
                style={{ marginRight: 8 }}
              >
                Annuler
              </Button>
              <Button className="not-rounded" type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(AddPerMorale);
