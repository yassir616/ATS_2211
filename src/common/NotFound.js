import "./NotFound.css";

import { Button } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class NotFound extends Component {
  render() {
    return (
      <div className="page-not-found">
        <h1 className="title">404</h1>
        <div className="desc">La page que vous recherchez est introuvable.</div>
        <Link to="/">
          <Button className="go-back-btn" type="primary" size="large">
            Retourner
          </Button>
        </Link>
      </div>
    );
  }
}

export default NotFound;
