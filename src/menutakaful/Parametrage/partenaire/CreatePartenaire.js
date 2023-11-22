import "./CreatePartenaire.css";
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
import {
  BRANCH_TYPE_DECES,
  BRANCH_TYPE_DECES_ET_RETRAITE,
  BRANCH_TYPE_RETRAITE,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NUMERO_COMPTE_LENGTH
} from "../../../constants/index";
import { addPartenaire } from "./PartenaireAPI";

const FormItem = Form.Item;
const { Option } = Select;
let type = "";
export class CreatePartenaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abreviation: {
        value: ""
      },
      raisonSocial: {
        value: ""
      },
      numeroCompte: {
        value: ""
      },
      typePartenaire: {
        value: ""
      },

      telephone: {
        value: ""
      },
      siegeSocial: {
        value: ""
      },
      TVA: {
        value: ""
      },
      fraisAcquisition: {
        value: ""
      },
      brancheType: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  async ajouterPartenaire(values) {
    try {
      let response = await addPartenaire(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "La création est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "Cet intermédiaire existe déja") {
        notification.error({
          message: "Cet intermédiaire existe déja."
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

  handleSelectChange = value => {
    type = value;
  };

  handleBranchetypeChange = value => {
    this.setState({ brancheType: value });
  };

  handleSubmit(event) {
    event.preventDefault();
    const createPartenaireRequest = {
      code: this.state.abreviation.value,
      raisonSocial: this.state.raisonSocial.value,
      numeroCompte: this.state.numeroCompte.value,
      typePartenaire: type,
      telephone: this.state.telephone.value,
      siegeSocial: this.state.siegeSocial.value,
      fraisAcquisition: this.state.fraisAcquisition.value,
      tva: this.state.TVA.value,
      brancheType: this.state.brancheType
    };
    this.ajouterPartenaire(createPartenaireRequest);
  }

  state = { visible: false };

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

  render() {
    return (
      <div>
        <Button
          type="primary"
          className="add-button"
          onClick={this.showDrawer}
          style={{ borderRadius: "0px" }}
        >
          <Icon type="plus" /> Nouvel Intermédiaire
        </Button>
        <Drawer
          title="Ajouter un nouvel intermédiaire"
          onClose={this.onClose}
          visible={this.state.visible}
          width={720}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form
            layout="vertical"
            onSubmit={this.handleSubmit}
            className="signup-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Raison sociale"
                  validateStatus={this.state.raisonSocial.validateStatus}
                >
                  <Input
                    size="default"
                    name="raisonSocial"
                    autoComplete="off"
                    placeholder="Raison sociale"
                    className="not-rounded"
                    value={this.state.raisonSocial.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Abréviation"
                  validateStatus={this.state.abreviation.validateStatus}
                >
                  <Input
                    size="default"
                    name="abreviation"
                    autoComplete="off"
                    placeholder="Abréviation"
                    className="not-rounded"
                    value={this.state.abreviation.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Siége social"
                  hasFeedback
                  validateStatus={this.state.siegeSocial.validateStatus}
                >
                  <Input
                    size="default"
                    name="siegeSocial"
                    autoComplete="off"
                    className="not-rounded"
                    placeholder="Siège Social"
                    value={this.state.siegeSocial.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Téléphone"
                  hasFeedback
                  validateStatus={this.state.telephone.validateStatus}
                >
                  <Input
                    size="default"
                    name="telephone"
                    type="telephone"
                    autoComplete="off"
                    className="not-rounded"
                    placeholder="Téléphone"
                    value={this.state.telephone.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="RIB"
                  validateStatus={this.state.numeroCompte.validateStatus}
                >
                  <Input
                    size="default"
                    name="numeroCompte"
                    autoComplete="off"
                    placeholder="RIB"
                    className="not-rounded"
                    value={this.state.numeroCompte.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTestNumero)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Type intermédiaire"
                  validateStatus={this.state.typePartenaire.validateStatus}
                >
                  <Select
                    placeholder="Selectionnez..."
                    onChange={this.handleSelectChange}
                  >
                    <Option value="Banque">Banque</Option>
                    <Option value="Cabinet de courtage">
                      Cabinet de courtage
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label=" Taux de la commission">
                  <Input
                    size="default"
                    name="fraisAcquisition"
                    autoComplete="off"
                    placeholder="Taux de la commision"
                    className="not-rounded"
                    value={this.state.fraisAcquisition.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label=" Taux TVA">
                  <Input
                    size="default"
                    name="TVA"
                    autoComplete="off"
                    placeholder="TVA"
                    className="not-rounded"
                    value={this.state.TVA.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateTest)
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="Type de branche">
                  <Select
                    placeholder="Selectionnez..."
                    onChange={this.handleBranchetypeChange}
                  >
                    <Option value={BRANCH_TYPE_DECES}>
                      {BRANCH_TYPE_DECES}
                    </Option>
                    <Option value={BRANCH_TYPE_DECES_ET_RETRAITE}>
                      {BRANCH_TYPE_DECES_ET_RETRAITE}
                    </Option>
                    <Option value={BRANCH_TYPE_RETRAITE}>
                      {BRANCH_TYPE_RETRAITE}
                    </Option>
                  </Select>
                </FormItem>
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
  validateTest = abbreviation => {
    if (abbreviation.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
      };
    } else if (abbreviation.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
  validateTestNumero = numeroCompte => {
    if (numeroCompte.length < NUMERO_COMPTE_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NUMERO_COMPTE_LENGTH} characters needed.)`
      };
    } else if (numeroCompte.length > NUMERO_COMPTE_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Name is too long (Maximum ${NUMERO_COMPTE_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default Form.create()(CreatePartenaire);
