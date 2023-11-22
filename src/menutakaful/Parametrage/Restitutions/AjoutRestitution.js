/* eslint-disable react/prop-types */
import "./AjoutRestitution.css";
import "antd/dist/antd.css";

import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  notification,
  Row
} from "antd";
import React, { Component } from "react";
import { ajoutRestitution } from "./RestitutionAPI";

class AjoutRestitution extends Component {
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

  handleChange(value) {}

  async ajouterRestitution(values) {
    try {
      let response = await ajoutRestitution(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la creation de la restitution est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "restitution already exists") {
        notification.error({
          message: "cette restitution existe déja."
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterRestitution(values);
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
          <Icon type="plus" /> Nouvelle restitution
        </Button>
        <Drawer
          title="Creation d'un nouvelle restitution"
          onClose={this.onClose}
          width="300"
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Libelle :">
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
export default Form.create()(AjoutRestitution);
