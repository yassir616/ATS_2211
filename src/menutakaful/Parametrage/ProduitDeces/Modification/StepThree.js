/* eslint-disable react/prop-types */
import "./StepThree.css";
import "antd/dist/antd.css";
import { Divider, Form } from "antd";
import React, { Component } from "react";
import NormeAjouter from "./NormeAjouter";
import NormeTable from "./NormeTable";

class StepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  render() {
    return (
      <div>
        <Divider orientation="left">Normes de Séléction</Divider>
        <NormeAjouter record={this.props.record}></NormeAjouter>
        <NormeTable
          honoraire={this.props.honoraire}
          record={this.props.record}
        ></NormeTable>
      </div>
    );
  }
}
export default Form.create({ name: "global_state" })(StepThree);
