/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { Drawer, Form, Icon } from "antd";
import React, { Component } from "react";

class ProduitDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, data: this.props.Data };
  }
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

  render() {
    return (
      <div>
        <a type="primary" className="add-button" onClick={this.showDrawer}>
          <Icon type="user-add" /> Details
        </a>
        <Drawer
          title="Création d'un nouveau utilisateur"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        ></Drawer>
      </div>
    );
  }
}

export default Form.create()(ProduitDetail);
