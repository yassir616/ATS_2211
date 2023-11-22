import React, { Component } from "react";
import { Divider, Form, Input, InputNumber } from "antd";
import DynamicFields from "./DynamicFields";
import "../StepThree.css";
import {
  currencyFormatter,
  currencyParser
} from "../../../../../../util/Helpers";

class Beneficiaire extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.stepThreeCallBack(values.beneficiaire);
      e.preventDefault();
    });
  };

  render() {
    const { form } = this.props;
    return (
      <div className="container">
        <Form onChange={this.handleChange}>
          <Divider orientation="left" className="first">
            Ajouter Beneficiaire
          </Divider>
          <DynamicFields
            {...form}
            name="beneficiaire"
            fields={[
              {
                name: "cin",
                field: () => (
                  <Input style={{ width: "30%" }} placeholder={"cin"} />
                )
              },
              {
                name: "nom",
                field: () => (
                  <Input style={{ width: "30%" }} placeholder={"nom"} />
                )
              },
              {
                name: "prenom",
                field: () => (
                  <Input style={{ width: "30%" }} placeholder={"prenom"} />
                )
              },
              {
                name: "rib",
                field: () => (
                  <InputNumber
                    style={{ width: "30%" }}
                    placeholder={"rib"}
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )
              }
            ]}
          />
        </Form>
      </div>
    );
  }
}

export default Form.create({
  name: "beneficiaire"
})(Beneficiaire);
