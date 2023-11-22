import "antd/dist/antd.css";

import { Button, Form, Input, notification, Select } from "antd";
import React, { Component } from "react";
import { addNewRole } from "../../AdministartionAPI";


const { Option } = Select;

class AddRole extends Component {
  constructor(props) {
    super(props);
    this.state = { privileges: this.props.privileges };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        delete values.confirm;
        let privileges = [];
        values.privileges.forEach((element) => {
          privileges.push({ name: element });
        });
        values.privileges = [...privileges];
        this.addRole(values);
      }
    });
  };

  async addRole(values) {
    try {
      let response = await addNewRole(values);
      if (response.status === 200) {
        notification.success({
          message: "Role bien crier",
        });
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message ||
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!",
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="Rôle">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "le role doit avoir un titre" }],
          })(
            <Input
              className="not-rounded"
              style={{ width: "100%" }}
              placeholder="Tapez le role"
            />
          )}
        </Form.Item>
        <Form.Item label="Permissions">
          {getFieldDecorator("privileges")(
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="cliquez pour ajouter des permissions"
              optionLabelProp="label"
            >
              {this.state.privileges.map((element) => {
                return (
                  <Option value={element.name} label={element.name}>
                    {element.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
          <Button className="not-rounded" type="primary" htmlType="Ajouter">
            Ajouter
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default Form.create({ name: "coordinated" })(AddRole);
