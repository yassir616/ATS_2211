import "./ServerError.css";

import { Button } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class ServerError extends Component {
  render() {
    return (
      <div className="server-error-page">
        <h1 className="server-error-title">500</h1>
        <div className="server-error-desc">
          Oops! Quelque chose s'est mal passé sur notre serveur. Pourquoi tu ne
          reviens pas?
        </div>
        <Link to="/">
          <Button
            className="server-error-go-back-btn"
            type="primary"
            size="large"
          >
            Retourner
          </Button>
        </Link>
      </div>
    );
  }
}

export default ServerError;
