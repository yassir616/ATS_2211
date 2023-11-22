import "./StepThree.css";
import "antd/dist/antd.css";
import { Form } from "antd";
import React, { Component } from "react";

class NormeAjouter extends Component {
  state = {
    laboratoires: [],
  };
  render() {
    return <div></div>;
  }
}
export default Form.create({ name: "global_state" })(NormeAjouter);
