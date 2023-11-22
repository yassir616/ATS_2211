/* eslint-disable react/prop-types */
import "./MenuGauche.css";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MenuGauche from "../menutakaful/MenuGauche";

class MenuTakaful extends Component {
  render() {
    var text = "";
    if (this.props.isAuthenticated) {
      text = <MenuGauche currentUserRoles={this.props.currentUser.roles} />;
    }
    return <div>{text}</div>;
  }
}
export default withRouter(MenuTakaful);
