/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import "antd/dist/antd.css";

import { Button, Form, Input, notification, Select } from "antd";
import React, { Component } from "react";
import { editRole } from "../../AdministartionAPI";
const { Option } = Select;

class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = { privileges: this.props.privileges, roles: this.props.roles };
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
        let requestValues = { ...values };
        delete requestValues.roles;
        this.editRole(requestValues, values.roles.key);
      }
    });
  };

  async editRole(values, id) {
    try {
      let response = await editRole(values, id);
      if (response.status === 200) {
        let newroles = [...this.state.roles];
        newroles.forEach((element) => {
          if (element.id === id) element.name = values.name;
          element.privileges = [...values.privileges];
        });
        this.setState({ roles: [...newroles] });
        notification.success({
          message: "Role bien modifier",
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
  handleSelectChange = (value) => {
    let row = this.state.roles.filter((item) => item.id === value.key)[0];
    let privileges = [];
    if (row.privileges.length > 0)
      row.privileges.forEach((element) => {
        privileges.push(element.name);
      });
    this.props.form.setFieldsValue({
      name: value.label,
      privileges: privileges,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="sélectionnez un rôle">
          {getFieldDecorator("roles")(
            <Select
              style={{ width: "100%" }}
              labelInValue
              placeholder="cliquez pour ajouter des permissions"
              onChange={this.handleSelectChange}
            >
              {this.state.roles.map((element) => {
                return (
                  <Option value={element.id} label={element.name}>
                    {element.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="titre">
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
              placeholder="cliquez pour la selection"
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
            Modifier
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default Form.create({ name: "coordinated" })(EditRole);
