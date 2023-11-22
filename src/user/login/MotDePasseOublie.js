import "./Login.css";
import { Button, Form, Icon, Input, notification,Modal } from "antd";
import React, { Component } from "react";
import { ACCESS_TOKEN, UserID } from "../../constants/index";
// import logo from "../../assets/takaLogo.webp";
import logo from "../../assets/TTTakaful.png";
import { login } from "../UserAPI";

const FormItem = Form.Item;

class MotDePasseOublie extends Component {
  render() {
    const AntWrappedLoginForm = Form.create()(LoginForm);
    return (
      <div className="login-container">
        <div className="login">
          <img src={logo} className="logo2" alt="takaful" />
          <div className="login-content">
            <AntWrappedLoginForm onLogin={this.props.onLogin} />
          </div>
        </div>
      </div>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      modelShow: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const loginRequest = Object.assign({}, values);
        login(loginRequest)
          .then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.headers.authorization);
            localStorage.setItem(UserID, response.headers.userid);
            this.props.onLogin();
          })
          .catch(error => {
            if (error.status === 401) {
              notification.error({
                message: "Takaful",
                description:
                  "Email ou mot de passe inccorect.Veuillez réessayer!"
              });
            } else {
              notification.error({
                message: "Takaful",
                description:
                  "Pardon! Quelque chose a mal tourné. Veuillez réessayer!"
              });
            }
          });
      }
    });
  }
  showModal = () => {
    this.setState({
      modelShow: true
    });
  };
  handleCancel = () => {
    this.setState({
      modelShow: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Entrer nouveau mot de passe" }]
          })(
            <Input
              prefix={<Icon type="lock" />}
              size="large"
              name="password"
              type="password"
              placeholder="Mot de passe"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("passwordconf", {
            rules: [
              {
                required: true,
                message: "Veuillez confirmer votre mot de passe!"
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" />}
              size="large"
              name="passwordconf"
              type="password"
              placeholder="Veuillez Confirmer votre Mot de passe"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            id="loginButton"
            htmlType="submit"
            size="large"
            className="login-form-button"
          >
            Changer mot de passe
          </Button>
          
        </FormItem>
        
      </Form>
    );
  }
}

export default MotDePasseOublie;
