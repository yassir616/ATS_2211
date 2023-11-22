import { Button, Form, Input, Modal, notification } from "antd";
import React, { Component } from "react";
import { updatePassword } from "../menutakaful/Administration/AdministartionAPI";

class changePassword extends Component {
  constructor(props) {
    super(props);
  }

  async updatePassword(userId, newPassword) {
    try {
      let response = await updatePassword(userId, newPassword);
      if (response.status === 200) {
        notification.success({
          message: "la modification de mot de passe est bien faite"
        });
        this.props.onLogout();
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values", values.password);
        if (values.password != undefined) {
          this.updatePassword(this.props.currentUser.id, values.password);
          //   window.location.reload();
        } else {
          notification.open({
            message: "entrez un nouveau mot de passe",
            description: "Le mot de passe ne peut pas être nul"
          });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form className="signup-form">
          <Form.Item label="Mot de passe">
            {getFieldDecorator("password")(
              <Input className="not-rounded" placeholder="password" />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="button"
              className="btn btn-primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(changePassword);
