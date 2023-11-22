/* eslint-disable react/prop-types */
import "./AppHeader.css";

import {
  Badge,
  Button,
  Card,
  Dropdown,
  Icon,
  Input,
  Layout,
  Menu,
  Modal
} from "antd";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  getUserNotifications,
  updateNotification,
  getUserNotificationsSinistre,
  updateNotificationSinistre
} from "../menutakaful/Administration/AdministartionAPI";

import FormItem from "antd/lib/form/FormItem";
import ChangePassword from "./ChangePassword";

const Header = Layout.Header;
const { SubMenu } = Menu;
class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.state = {
      notification: [],
      count: 0,
      count2 : 0,
      modelShow: false,
      notificationSinistre : []
    };
  }

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

  componentDidMount() {
    this.loadNotification();
    this.loadNotificationSinistre();
  }

  async loadNotification() {
    let responce = await getUserNotifications();
    let count = 0;
    let filteredArr = [];
    filteredArr = responce.data.reduce((acc, current) => {
      const x = acc.find(item => item.message === current.message);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    filteredArr.forEach(element => {
      if (element.read === false) {
        count++;
      }
    });
    this.setState({ count, notification: filteredArr });
  }

  async loadNotificationSinistre() {
    let response = await getUserNotificationsSinistre();
    let count2 = 0;
    let filteredArr = [];
    filteredArr = response.data.reduce((acc, current) => {
      const x = acc.find(item => item.message === current.message);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    filteredArr.forEach(element => {
      if (element.read === false) {
        count2++;
      }
    });
    this.setState({ count2, notificationSinistre: filteredArr });
  }


  async readNotification(id, notification) {
    if (notification.read === false) {
      this.setState({ count: this.state.count - 1 });
      notification.read = true;
      delete notification.id;
      await updateNotification(id, notification);
    }
  }

  async readNotificationSinistre(id, notification) {
    if (notification.read === false) {
      this.setState({ count2: this.state.count2 - 1 });
      notification.read = true;
      delete notification.id;
      await updateNotificationSinistre(id, notification);
    }
  }


  showModal = () => {
    this.setState({
      modelShow: true
    });
  };
  handleCancel = () => {
    window.location.reload();
    this.setState({
      modelShow: false
    });
  };

  render() {
    let menuItems;
    if (this.props.currentUser) {
      menuItems = (
        <Menu
          mode="horizontal"
          theme="light"
          selectedkeys={[this.props.location.pathname]}
          onClick={this.handleMenuClick}
          style={{ backgroundColor: "#fafafa" }}
        >
          <Menu.Item
            key="logout"
            style={{ float: "right", height: "64px", color: "grey" }}
          >
            Bonjour, {this.props.currentUser.firstName.toUpperCase()}{" "}
            {this.props.currentUser.lastName.toUpperCase()}
            <Icon type="logout" style={{ marginLeft: "10px" }} />
          </Menu.Item>

          <Menu.Divider
            type="vertical"
            style={{ float: "right", height: "64px" }}
          />

          <SubMenu
            style={{ float: "right", height: "64px" }}
            title={
              <span className="submenu-title-wrapper">
                <Icon
                  type="user"
                  style={{ marginLeft: "10px", color: "rgba(0, 0, 0, 0.65)" }}
                />
              </span>
            }
          >
            <Menu.ItemGroup title={this.props.currentUser.email}>
              <Menu.Divider />
              <Menu.Item key="profile" style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                Profile
              </Menu.Item>
              <Menu.Item
                key="changepasword"
                style={{ color: "rgba(0, 0, 0, 0.65)" }}
                onClick={this.showModal}
              >
                Changer le mot de passe
              </Menu.Item>

              <Modal
                visible={this.state.modelShow}
                title="Nouveau mot de passe"
                width="950px"
                onCancel={this.handleCancel}
                onOk={this.handleCancel}
                id="modal"
                footer={[
                  <Button
                    key="back"
                    onClick={this.handleCancel}
                    className="not-rounded"
                  >
                    Fermer
                  </Button>
                ]}
              >
                <ChangePassword
                  currentUser={this.props.currentUser}
                  onLogout={this.props.onLogout}
                />
              </Modal>

              <Menu.Item key="logout" style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                Se déconnecter
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>

          <Menu.Divider
            type="vertical"
            style={{ float: "right", height: "64px" }}
          />

          <Menu.Item style={{ float: "right", height: "64px" }}>
            <Dropdown
              style={{ float: "right", height: "64px" }}
              trigger={["click"]}
              overlay={
                <Menu>
                  {" "}
                  {this.state.notification.map(element => (
                    <Menu.Item key={element.id} style={{ padding: "0px  5px" }}>
                      {element.read === false ? (
                        <Card
                          onClick={() =>
                            this.readNotification(element.id, element)
                          }
                          style={{ backgroundColor: "#F0F8FF" }}
                        >
                          <p>{element.message}</p>
                        </Card>
                      ) : (
                        <Card
                          onClick={() =>
                            this.readNotification(element.id, element)
                          }
                          style={{ backgroundColor: "#FFFFFF" }}
                        >
                          <p>{element.message}</p>
                        </Card>
                      )}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Badge count={this.state.count}>
                {" "}
                <Icon type="notification" />
              </Badge>
            </Dropdown>
          </Menu.Item>

          {/* Notification de la lettre de relance pour le front-office */}
          <Menu.Item style={{ float: "right", height: "64px" }}>
            <Dropdown
              style={{ float: "right", height: "64px" }}
              trigger={["click"]}
              overlay={
                <Menu>
                  {" "}
                  {this.state.notificationSinistre.map(element => (
                    <Menu.Item key={element.id} style={{ padding: "0px  5px" }}>
                      {element.read === false ? (
                        <Card
                          onClick={() =>
                            this.readNotificationSinistre(element.id, element)
                          }
                          style={{ backgroundColor: "#F0F8FF" }}
                        >
                          <p>{element.message}</p>
                        </Card>
                      ) : (
                        <Card
                          onClick={() =>
                            this.readNotificationSinistre(element.id, element)
                          }
                          style={{ backgroundColor: "#FFFFFF" }}
                        >
                          <p>{element.message}</p>
                        </Card>
                      )}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Badge count={this.state.count2}>
                {" "}
                <Icon type="notification" />
              </Badge>
            </Dropdown>
          </Menu.Item>

          <Menu.Item style={{ float: "left", height: "64px" }}>
            <Input
              placeholder="   Recherche sur Atlas Takaful Système "
              className="search-header"
              prefix={
                <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              style={{ color: "rgba(0,0,0,.25)" }}
            />
          </Menu.Item>
          <Menu.Item style={{ float: "left", height: "64px" }}>
          <p style={{ color: "red" }}> 
          Alerte ! Les données affichées sur cette interface sont à usage interne, accessibles uniquement aux entités autorisées.
          </p>
          </Menu.Item>
         
        </Menu>
      );
    } else {
      menuItems = (
        <Menu
          style={{ height: "64px" }}
          mode="horizontal"
          selectedkeys={[this.props.location.pathname]}
        >
          <Menu.Item key="/login" style={{ float: "right", height: "64px" }}>
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="/signup" style={{ float: "right", height: "64px" }}>
            <Link to="/signup">Signup</Link>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <Header style={{ padding: "0px", height: "auto" }}>{menuItems}</Header>
    );
  }
}

export default withRouter(AppHeader);
