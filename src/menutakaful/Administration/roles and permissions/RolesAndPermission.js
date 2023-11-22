import "antd/dist/antd.css";

import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";

import ComponentTitle from "../../../util/Title/ComponentTitle";
import AddPermission from "./AddPermission/AddPermission";
import AddRole from "./AddRole/AddRole";
import EditRole from "./EditRole/EditRole";
import SearchTree from "./SearchTree/SearchTree";
import { getAllPrivileges, getAllRoles } from "../AdministartionAPI";

const { Panel } = Collapse;

class RolesAndPermission extends Component {
  state = {
    rolesloaded: false,
    roles: [],
    privileges: []
  };

  async getRoles() {
    let response = await getAllRoles();
    let responseP = await getAllPrivileges();

    this.setState({
      rolesloaded: true,
      roles: [...response.data.content],
      privileges: [...responseP.data]
    });
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {
    return (
      <div>
        <ComponentTitle title="Rôles et permissions" />
        <Collapse>
          <Panel header="Gestion des rôles" key="1">
            <Row>
              <Col span={10}>
                {this.state.rolesloaded && (
                  <SearchTree Roles={this.state.roles}></SearchTree>
                )}
              </Col>

              <Col offset={1} span={13}>
                <Collapse>
                  <Panel header="Ajouter un rôle" key="1">
                    <AddRole privileges={this.state.privileges}></AddRole>
                  </Panel>
                  <Panel header="Modifier un rôle" key="2">
                    <EditRole
                      privileges={this.state.privileges}
                      roles={this.state.roles}
                    ></EditRole>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Panel>
          <Panel header="Gestion des permissions" key="2">
            <AddPermission privileges={this.state.privileges}></AddPermission>
          </Panel>
        </Collapse>
      </div>
    );
  }
}
export default RolesAndPermission;
