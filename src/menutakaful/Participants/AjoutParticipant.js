import "antd/dist/antd.css";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Icon,
  Input,
  notification,
  Row,
  Select
} from "antd";
import React, { Component } from "react";

import { ajoutRestitution } from "../../util/APIUtils";

const dateFormat = "DD-MM-YYYY";
const { Option } = Select;

class AjoutParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      libelle: {
        value: ""
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
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
  handleSubmit(event) {
    event.preventDefault();

    const restitutionRequest = {
      libelle: this.state.libelle.value
    };

    ajoutRestitution(restitutionRequest)
      .then(response => {
        notification.success({
          message: "TAKAFUL",
          description: "Thank you! successful."
        });
      })
      .catch(error => {
        notification.error({
          message: "TAKAFUL",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }
  isFormInvalid() {
    return this.state.libelle.validateStatus !== "success";
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
          onClick={this.showDrawer}
          style={{ borderRadius: "0px", marginBottom: "10px" }}
        >
          <Icon type="user-add" /> Nouveau participant
        </Button>
        <Drawer
          title="Ajouter un nouveau participant"
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          width={900}
        >
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nom :">
                  <Input
                    size="large"
                    name="nom"
                    autoComplete="off"
                    placeholder="Nom participant"
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateLibelle)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Prénom :">
                  <Input
                    size="large"
                    name="prenom"
                    autoComplete="off"
                    placeholder="Prénom participant"
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateLibelle)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="CIN :">
                  <Input
                    size="large"
                    name="cin"
                    autoComplete="off"
                    placeholder=" CIN "
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateLibelle)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date de Naissance :">
                  <DatePicker
                    size="large"
                    format={dateFormat}
                    name="datenaissance"
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateLibelle)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Matricule :">
                  <Input
                    size="large"
                    name="matricule"
                    autoComplete="off"
                    placeholder=" Matricule "
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateLibelle)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Profession :">
                  <Select
                    showSearch
                    size="large"
                    placeholder="Profession"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="IngénieurI">Ingénieur SI</Option>
                    <Option value="Avocat">Avocat</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Situation familiale :">
                  <Select defaultValue="" size="large">
                    <Option value="Celibataire">Célibataire</Option>
                    <Option value="Marie">Marié(e)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nombre d'enfants :">
                  <Input
                    size="large"
                    name="enfants"
                    autoComplete="off"
                    placeholder=" Nombre d'enfant "
                    value={this.state.libelle.value}
                    onChange={event =>
                      this.handleInputChange(event, this.validateLibelle)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Sexe :">
                  <Select defaultValue="" size="large">
                    <Option value="Homme">Homme</Option>
                    <Option value="Femme">Femme</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nationalité :">
                  <Select
                    showSearch
                    size="large"
                    placeholder="Nationalité"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="marocaine">Marocaine</Option>
                    <Option value="espagnole">Espagnole</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                htmlType="submit"
                disabled={this.isFormInvalid()}
                type="primary"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
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
          ></div>
        </Drawer>
      </div>
    );
  }
  validateLibelle = libelle => {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  };
}

export default Form.create()(AjoutParticipant);
