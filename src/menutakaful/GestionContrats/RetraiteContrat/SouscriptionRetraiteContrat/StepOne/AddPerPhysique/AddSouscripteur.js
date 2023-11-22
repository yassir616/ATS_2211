/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Icon,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
  AutoComplete
} from "antd";
import React, { Component } from "react";
import {
  createPersonnePhysique,
  getAllPays
} from "../../../../../Participants/ParticipantAPI";
// import { getCinIfExist, getRibIfExist } from "../SouscriptionAPI";
import { getAllVille } from "../../../../../../util/VillesAPI";
import {
  getCinIfExist,
  getRibIfExist
} from "../../../../../Production Prestations/Souscription/SouscriptionAPI";

import moment from "moment";
import {
  currencyFormatter,
  currencyParser
} from "../../../../../../util/Helpers";
const { Option } = Select;

const dateFormatList = "DD/MM/YYYY";
class AddSouscripteur extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      villes: [],
      payss: [],
      nationaliteList: ["MAROCAINE ", "FRANÇAISE", "BELGE", "..."],
      Tiers: [0, 1, 2, 3, 4, 5],
      ville: "",
      vois: "",
      numero: "",
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
  async getAllPays() {
    let paysResponse = await getAllPays();
    let helpArray = [];
    paysResponse.data.content.forEach(element => {
      const object = element.libelle;
      helpArray.push(object);
    });
    this.setState({ payss: helpArray });
  }
  disabledDate = current => {
    let startDate = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").add(
      -18,
      "years"
    );
    let curentOrEndDtae = startDate < current;
    return current && curentOrEndDtae;
  };
  componentDidMount() {
    this.getAllVilles();
    this.getAllPays();
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
        values.dateNaissance = values.dateNaissance.format("DD-MM-YYYY");
        values.adressVille = values.adressVille.label;
        values.adressPays = values.adressPays.label;
        this.createPersonnePhysique(values);
      }
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

  onChangeVille = value => {
    console.log(value);
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
  onChangeCin = e => {
    this.PersonneCinIfExist(e.target.value);
  };

  onChangeProfession = value => {
    this.setState({
      profession: value.label
    });
  };

  componentDidUpdate(_, prevState) {
    if (prevState.adresscomplet !== this.state.adresscomplet) {
      this.props.form.setFieldsValue({
        adressComplete: this.state.adresscomplet
      });
    }
  }
  onChangePays = value => {
    this.setState({
      pays: value.label,
      adresscomplet:
        this.state.vois +
        " " +
        this.state.complement +
        " " +
        this.state.numero +
        " " +
        this.state.ville +
        " " +
        value.label
    });
  };
  async PersonneRibIfExist(rib) {
    try {
      let response = await getRibIfExist(rib);
    } catch (error) {
      if ((error.response.data.status = "500")) {
        notification.error({
          message: "une personne est déja inscrit avec le même rib ."
        });
      }
    }
  }
  async PersonneCinIfExist(cin) {
    try {
      let response = await getCinIfExist(cin);
    } catch (error) {
      if (error.response.data.status === 500) {
        notification.error({
          message: "une personne est déja inscrit avec le même cin ."
        });
      }
    }
  }

  async createPersonnePhysique(model) {
    try {
      let response = await createPersonnePhysique(model);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "CONTRIBUANT INSERE"
        });
        this.props.personCreation(response.data);
      }
    } catch (error) {
      if (
        error.response.data.message === "400 souscripteur already existsfvf"
      ) {
        this.onClose();

        notification.error({
          message: "une personne et deja inscrit avec le meme cin ."
        });
      } else {
        this.onClose();
        notification.error({
          message: "Takaful",
          description: "Sorry! Something went wrong. Please try again!"
        });
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "CIN"
    })(
      <Select style={{ width: 100 }}>
        <Option value="CIN">CIN</Option>
        <Option value="Passport">Passport</Option>
        <Option value="Numresidence">N° carte de residence</Option>
      </Select>
    );
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
            <Row>
              <Col span={12}>
                <Form.Item label="Prospect">
                  {getFieldDecorator("isProspect", {
                    valuePropName: "checked",
                    initialValue: true
                  })(
                    <Radio.Group buttonStyle="solid" defaultValue={true}>
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Prénom">
                  {getFieldDecorator("prenom", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le prénom de souscripteur"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le prénom de souscripteur"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nom">
                  {getFieldDecorator("nom", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le prénom de souscripteur"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le nom de souscripteur"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Identifiant">
                  {getFieldDecorator("cin")(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      addonBefore={prefixSelector}
                      onChange={this.onChangeCin}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date de naissance" hasFeedback>
                  {getFieldDecorator("dateNaissance", {
                    rules: [
                      {
                        required: true,
                        message: "entre la date de naissance"
                      }
                    ]
                  })(
                    <DatePicker
                      format={dateFormatList}
                      disabledDate={this.disabledDate}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Matricule">
                  {getFieldDecorator("matricule", {
                    rules: [{ required: false }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le matricule de souscripteur"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Profession">
                  {getFieldDecorator("profession", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez une profession"
                      }
                    ]
                  })(
                    <Select
                      placeholder="Profession"
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children
                          .toUpperCase()
                          .indexOf(input.toUpperCase()) >= 0
                      }
                    >
                      {this.props.professions.map(element => {
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
                <Form.Item label="Situation familiale ">
                  {getFieldDecorator("situationFamiliale", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez une Situation familiale"
                      }
                    ]
                  })(
                    <Select placeholder="Situation familiale">
                      {this.props.setuation.map(element => {
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
                <Form.Item label="Sexe">
                  {getFieldDecorator("sexe", {
                    rules: [{ required: true, message: "Sélectionnez le sexe" }]
                  })(
                    <Select placeholder="Sélectionnez le sexe">
                      {this.props.sexe.map(element => {
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
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nationalité">
                  {getFieldDecorator("nationalite", {
                    rules: [
                      { required: true, message: "Entrez une Nationalité" }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Entrez une Nationalité"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nombre d'enfants">
                  {getFieldDecorator("nombreEnfants", {
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
                      placeholder="entrez le nombre d'enfants"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="RIB">
                  {getFieldDecorator("rib", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="RIB"
                      maxlength="24"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
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
              <Col span={12}>
                <Form.Item label="N° Tiers">
                  {getFieldDecorator("numTiers", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="N° Tiers"
                      formatter={currencyFormatter}
                      parser={currencyParser}
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
                    rules: [{ required: true, message: "Pays" }]
                  })(
                    <AutoComplete
                      size="default"
                      dataSource={this.state.payss}
                      onChange={this.onChangePays}
                      allowClear={false}
                      labelInValue
                      placeholder="ajouter une pays"
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  )}
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
                <Form.Item label="Vois">
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
                <Form.Item label="Complément d'adresse">
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
                  {getFieldDecorator("adressComplete", {
                    value: this.state.adresscomplet
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      value={this.state.adresscomplet}
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

export default Form.create()(AddSouscripteur);
