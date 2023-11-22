import "./CreateTypeAvenant.css";
import { Button, Drawer, Form, Icon, Input, notification } from "antd";
import React, { Component } from "react";
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "../../../constants/index";
import { addTypeAvenant } from "./AvenantAPI";

const FormItem = Form.Item;
export class CreateTypeAvenant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abreviation: {
        value: ""
      },
      libelle: {
        value: ""
      }
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

  async ajouterTypeAvenant(values) {
    try {
      let response = await addTypeAvenant(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "La création est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "Ce type avenant existe déja") {
        notification.error({
          message: "Ce type avenant existe déja."
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

  handleSubmit(event) {
    event.preventDefault();
    const createTypeAvenantRequest = {
      code: this.state.abreviation.value,
      libelle: this.state.libelle.value
    };

    this.ajouterTypeAvenant(createTypeAvenantRequest);
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
          <Icon type="plus" /> Nouveau Type Avenant
        </Button>
        <Drawer
          title=""
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Abréviation"
              validateStatus={this.state.abreviation.validateStatus}
            >
              <Input
                size="default"
                name="abreviation"
                autoComplete="off"
                className="not-rounded"
                placeholder="Code"
                value={this.state.abreviation.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateTest)
                }
              />
            </FormItem>
            <FormItem
              label="Libelle"
              hasFeedback
              validateStatus={this.state.libelle.validateStatus}
            >
              <Input
                size="default"
                name="libelle"
                className="not-rounded"
                autoComplete="off"
                placeholder="Libelle"
                value={this.state.libelle.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateTest)
                }
              />
            </FormItem>
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

  validateTest = abreviation => {
    if (abreviation.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
      };
    } else if (abreviation.length > NAME_MAX_LENGTH) {
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
}

export default CreateTypeAvenant;
