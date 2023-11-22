import "antd/dist/antd.css";

import { Form, Tabs } from "antd";
import React, { Component } from "react";
import FichiersEmis from "./Fichiers Emis/FichiersEmis";
import FichiersRecus from "./FichiersRecus/FichiersRecus";
import IntegrationManuelle from "./IntegrationManuelle/IntegrationManuelle";
import { getRetraiteProduit } from "../Parametrage/ProduitRetraite/ProduitRetraiteAPI";

const { TabPane } = Tabs;
class EchangeFichiers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      produits: [],
    };
  }
  async getAllProduits() {
    let responseProduit = await getRetraiteProduit();
    this.setState({
      produits: responseProduit.data.content,
    });
  }
  componentDidMount() {
    this.getAllProduits();
  }

  render() {
    return (
      <div>
        <Tabs type="card">
          <TabPane tab="Fichiers Recus" key="1">
            <FichiersRecus produits={this.state.produits} />
          </TabPane>
          <TabPane tab="Fichiers Emis " key="2">
            <FichiersEmis />
          </TabPane>
          <TabPane tab="Intégration manuelle" key="3">
            <IntegrationManuelle />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Form.create()(EchangeFichiers);
