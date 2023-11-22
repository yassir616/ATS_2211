import "antd/dist/antd.css";
import { Button, Form, Icon, Input } from "antd";
import React from "react";

let id = 0;

class DynamicFieldSet extends React.Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  };
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++, id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k) =>
      k % 2 === 0 ? (
        <Form.Item required={false} key={k}>
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field.",
              },
            ],
          })(
            <Input
              placeholder="passenger name"
              style={{ width: "90%", marginRight: 8 }}
            />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ) : (
        <Form.Item required={false} key={k}>
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field.",
              },
            ],
          })(
            <Input
              placeholder="Pourcentage"
              style={{ width: "90%", marginRight: 8 }}
            />
          )}

          {keys.length > 2 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      )
    );
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          <Form.Item>
            <Button type="dashed" onClick={this.add} style={{ width: "100%" }}>
              <Icon type="plus" /> Add field
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const Beneficiare = Form.create({ name: "dynamic_form_item" })(DynamicFieldSet);
export default Beneficiare;
