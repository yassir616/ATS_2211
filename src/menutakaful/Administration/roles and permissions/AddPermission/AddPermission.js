/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Button, Form, Input, notification } from "antd";
import React, { Component } from "react";
import { addNewPermission } from "../../AdministartionAPI";

class AddPermission extends Component {
  constructor(props) {
    super(props);
    this.state = { privileges: this.props.privileges };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.addPermission(values.name);
      }
    });
  };

  async addPermission(values) {
    try {
      let response = await addNewPermission(values);
      if (response.status === 200) {
        notification.success({
          message: "Permission bien criee"
        });
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="Permission">
          {getFieldDecorator("name", {
            rules: [
              { required: true, message: "la permission  doit avoir un titre" }
            ]
          })(
            <Input
              className="not-rounded"
              style={{ width: "100%" }}
              placeholder="Tapez le titre"
            />
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button className="not-rounded" type="primary" htmlType="Ajouter">
            Ajouter
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default Form.create({ name: "coordinated" })(AddPermission);
