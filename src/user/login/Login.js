import "./Login.css";
import { Button, Form, Icon, Input, notification,Modal } from "antd";
import React, { Component } from "react";
import { ACCESS_TOKEN, UserID } from "../../constants/index";
// import logo from "../../assets/takaLogo.webp";
import logo from "../../assets/TTTakaful.png";
import { login } from "../UserAPI";

const FormItem = Form.Item;

class Login extends Component {
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
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "E" }]
          })(
            <Input
              prefix={<Icon type="user" />}
              size="large"
              name="email"
              placeholder="Identifiant"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Veuillez saisir votre mot de passe!"
              }
            ]
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
          <Button
            type="primary"
            id="loginButton"
            htmlType="submit"
            size="large"
            className="login-form-button"
          >
            S'identifier
          </Button>
          
          <a className="MdpOublie" onClick={this.showModal}
           > Mot de passe oublié ?
            </a>
          
         
        </FormItem>
        <Modal
                visible={this.state.modelShow}
                title="Mot de passe Oublié"
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
                <h3>Veuillez entrer votre adresse e-mail  pour chercher votre compte.</h3>
                <Form.Item label="Email">
            {getFieldDecorator("email")(
              <Input className="ant-input ant-input-lg" placeholder="email" />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="button"
              className="EnvoyerMail"
              htmlType="submit"
              //onClick={this.handleSubmit}
            >
              Envoyer
            </Button>
            </Form.Item>
              </Modal>
      </Form>
    );
  }
}

export default Login;
