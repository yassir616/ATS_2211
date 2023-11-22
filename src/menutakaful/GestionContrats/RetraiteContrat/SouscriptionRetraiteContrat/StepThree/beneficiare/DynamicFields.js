import React, { Component, Fragment } from "react";
import { Form, Icon, Button } from "antd";
import PropTypes from "prop-types";

class DynamicFields extends Component {
  id = 1;

  add = () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`),
      nextKeys = keys.concat(this.id++);

    setFieldsValue({
      [`${name}List`]: nextKeys,
    });
  };

  remove = (k) => () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`);

    if (keys.length === 1) return;
    setFieldsValue({
      [`${name}List`]: keys.filter((key) => key !== k),
    });
  };

  defaultValidation = (name) => ({
    validateTrigger: ["onChange", "onBlur"],

    rules: [
      {
        required: true,
        whitespace: true,
        message: `Champ Obligatoire ... `,
      },
    ],
  });

  addSingleField = () => {
    const { getFieldDecorator, getFieldValue, fields: obj, name } = this.props;
    getFieldDecorator(`${name}List`, { initialValue: [0] });
    const fieldCounter = getFieldValue(`${name}List`);
    return fieldCounter.map((k) => (
      <Form.Item key={k}>
        {getFieldDecorator(
          `${name}[${k}]`,
          obj.validation || this.defaultValidation(name)
        )(obj.field())}
        {fieldCounter.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
  };

  addMultipleFields = () => {
    const { getFieldDecorator, getFieldValue, fields, name } = this.props;
    getFieldDecorator(`${name}List`, { initialValue: [0] });
    const fieldCounter = getFieldValue(`${name}List`);

    return fieldCounter.reduce((preResult, k) => {
      const row = fields.map((obj, i) => (
        <Form.Item key={`${k}${obj.name}`}>
          {getFieldDecorator(
            `${name}[${k}][${obj.name}]`,
            obj.validation || this.defaultValidation(name)
          )(obj.field())}
          {fieldCounter.length > 1 && fields.length - 1 === i ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ));

      return [...preResult, ...row];
    }, []);
  };

  render() {
    const { fields, name } = this.props;
    return (
      <Fragment>
        {Array.isArray(fields)
          ? this.addMultipleFields()
          : this.addSingleField()}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{ width: "30%" }}>
            <Icon type="plus" /> Add &nbsp; {name}
          </Button>
        </Form.Item>
      </Fragment>
    );
  }
}

DynamicFields.propTypes = {
  name: PropTypes.string.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
    //TODO: add object shape validation.
  ]).isRequired,
  getFieldValue: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
};

export default DynamicFields;
