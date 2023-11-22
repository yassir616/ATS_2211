import "antd/dist/antd.css";
import { Form, Tabs } from "antd";
import React, { Component } from "react";
import Comptabilite from "./Comptabilite";
import GestionImpayes from "./GestionImpayes";
import ComptabiliteRetraite from "./ComptabiliteRetraite";
import EmissionGroupe from "./EmissionGroupe";
import EncaissementGroupe from "./EncaissementGroupe"
import BordereauEncaissement from "./BordereauEncaissement";

const { TabPane } = Tabs;
  const tab1Styles = {
    width: '117px',
    textAlign: 'center' // set width of the tab here
  };
  const tab2Styles = {
    width: '135px',
    textAlign: 'center' // set width of the tab here
  };
class Global extends Component {

  render() {
    return (
      <div>
        <Tabs type="card">
          {/* <TabPane tab="Gestion des impayés" key="1">
            <GestionImpayes />
          </TabPane> */}
          <TabPane tab={
          <div style={tab1Styles}>Emission Individuelle</div> // "Comptabilité "
        } key="2">
            <Comptabilite />
          </TabPane>
        {/*   <TabPane tab="Comptabilité épargne retraite" key="3">
            <ComptabiliteRetraite />
          </TabPane> */}
            <TabPane tab="Emission Groupe" key="3">
            <EmissionGroupe />
          </TabPane>
          <TabPane tab={
          <div style={tab1Styles}>Encaissement Groupe</div> // "Comptabilité "
        } key="4"> 
            <EncaissementGroupe />
          </TabPane>
          
          <TabPane  tab={
          <div style={tab2Styles}>Bordereau Encaissement</div> // "Comptabilité "
        } key="5"> 
        <BordereauEncaissement/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Form.create()(Global);
