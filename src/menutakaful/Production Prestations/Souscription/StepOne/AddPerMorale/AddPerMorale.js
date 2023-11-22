/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  AutoComplete,
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
import { createPersonneMorale } from "../../../../Participants/ParticipantAPI";
import { getAllVille } from "../../../../../util/VillesAPI";
import { currencyFormatter, currencyParser } from "../../../../../util/Helpers";

const { Option } = Select;

class AddPerMorale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      villes: [],
      ville: "",
      vois: "",
      numero: "",
      pays: "",
      complement: "",
      adresscomplet: ""
    };
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

  componentDidMount() {
    this.getAllVilles();
    console.log("props souscripteur:", this.props);
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
        values.typePersonneMorale = { id: values.typePersonneMorale };
        values.secteurActivite = { id: values.secteurActivite };
        values.adressVille = values.adressVille.label;
        this.createPersonneMorale(values);
      }
    });
  };
  async createPersonneMorale(model) {
    try {
      let response = await createPersonneMorale(model);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "personne bien ajoute"
        });
        // this.props.personCreation(response.data);
      }
    } catch (error) {
      if (error.response.data.message === "400 souscripteur already exists") {
        this.onClose();
        notification.error({
          message: "une personne et deja inscrit avec la meme patente ."
        });
      } else {
        this.onClose();

        notification.error({
          message: "Takaful",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      }
    }
  }
  componentDidUpdate(_, prevState) {
    if (prevState.adresscomplet !== this.state.adresscomplet) {
      this.props.form.setFieldsValue({
        adressComplete: this.state.adresscomplet
      });
    }
  }
  onChangeVille = value => {
    this.setState({
      ville: value.label,
      adresscomplet:
        this.state.vois +
        " " +
        this.state.complement +
        " " +
        this.state.numero +
        " " +
        value.label +
        " " +
        this.state.pays
    });
  };

  onChangePays = e => {
    this.setState({
      pays: e.target.value,
      adresscomplet:
        this.state.vois +
        " " +
        this.state.complement +
        " " +
        this.state.numero +
        " " +
        this.state.ville +
        " " +
        e.target.value
    });
  };
  onChangeVois = value => {
    this.setState({
      vois: value,
      adresscomplet:
        value +
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
  onChangeNumero = e => {
    this.setState({
      numero: e.target.value,
      adresscomplet:
        this.state.vois +
        " " +
        this.state.complement +
        " " +
        e.target.value +
        " " +
        this.state.ville +
        " " +
        this.state.pays
    });
  };
  onChangeComplement = e => {
    this.setState({
      complement: e.target.value,
      adresscomplet:
        this.state.vois +
        " " +
        e.target.value +
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
                    <Input
                      className="not-rounded"
                      placeholder="Tapez patente"
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
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le N°ice"
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
            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item label="RIB">
                  {getFieldDecorator("rib",
                   ({
                    rules: [
                      {
                        pattern: new RegExp("^[0-9]{24}"),
                        message: "Wrong format!"
                      }
                    ]
                  })
                  
                  )(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="RIB"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                      maxlength="24"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
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
                  })(<Input onBlur={this.onChangePays} />)}
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
                    <Select placeholder="Vois" onChange={this.onChangeVois}>
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
                      onBlur={this.onChangeNumero}
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
                <Form.Item label="Complement d'adresse">
                  {getFieldDecorator("adressComplement")(
                    <Input
                      onBlur={this.onChangeComplement}
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
                <Form.Item label="Adresse Complete">
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
