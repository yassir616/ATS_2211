/* eslint-disable react/prop-types */
import { Divider, Layout, notification } from "antd";
import Sider from "antd/lib/layout/Sider";
import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import { ACCESS_TOKEN } from "../constants/index";
import Acceuil from "../menutakaful/Acceuil/acceuil";
import Users from "../menutakaful/Administration/Users/Users";
import Restitutions from "../menutakaful/Parametrage/Restitutions/restitutions";
import Participant from "../menutakaful/Participants/Participant";
import AllParticipant from "../menutakaful/Participants/AllParticipant";
import Auxiliaires from "../menutakaful/Parametrage/Auxiliaires/auxiliaires";
import Honoraires from "../menutakaful/Parametrage/Honoraires/honoraires";

import TypePrestation from "../menutakaful/Parametrage/TypePrestation/typePrestation";
import CauseRestitution from "../menutakaful/Parametrage/CauseRestitution/causeRestitution";

import MenuTakaful from "../menutakaful/MenuTakaful";
import Login from "../user/login/Login";
import MotDepasseOublie from "../user/login/MotDePasseOublie";
import Profile from "../user/profile/Profile";
import "./App.css";
import Partenaire from "../menutakaful/Parametrage/partenaire/Partenaire";
import CreatePartenaire from "../menutakaful/Parametrage/partenaire/CreatePartenaire";
import TypeAvenant from "../menutakaful/Parametrage/avenant/TypeAvenant";
import CreateTypeAvenant from "../menutakaful/Parametrage/avenant/CreateTypeAvenant";
import PointVente from "../menutakaful/Parametrage/pointvente/PointVente";
import RolesAndPermission from "../menutakaful/Administration/roles and permissions/RolesAndPermission";
import ProduitDeces from "../menutakaful/Parametrage/ProduitDeces/ProduitDeces";
import ProduitRetraite from "../menutakaful/Parametrage/ProduitRetraite/ProduitRetraite";
import ConsultProduitDeces from "../menutakaful/Parametrage/ProduitDeces/ConsultProduitDeces";
import Souscription from "../menutakaful/Production Prestations/Souscription/Souscription";
import ConsultDecesContrat from "../menutakaful/GestionContrats/ConsultDecesContrat";
import ConsultDecesContratStatus from "../menutakaful/GestionContratsStatus/ConsultDecesContratStatus";
import Agenda from "../menutakaful/Utilitaire/Agenda";
import GestionAcceptation from "../menutakaful/Production Prestations/GestionAcceptation/GestionAcceptation";
import ModificationAcceptation from "../menutakaful/Production Prestations/GestionAcceptation/ModificationAcceptation";
import ConsultationAcceptation from "../menutakaful/Production Prestations/GestionAcceptation/ConsultationAcceptation";
import DetailsContrat from "../menutakaful/GestionContrats/DetailsContrat";
import Modification from "../menutakaful/Parametrage/ProduitDeces/Modification/Modification";
import Honoraire from "../menutakaful/Production Prestations/Honoraire/Honoraire";
import MultirisqueBatiment from "../menutakaful/MRB/MultirisqueBatiment";
import ConsultationsContratsMrb from "../menutakaful/MRB/ConsultationsContratsMrb";
import Reglement from "../menutakaful/GestionContrats/DetailsTabs/Reglement";
import ProduitMRB from "../menutakaful/MRB/ProduitMrb/ProduitMRB";
import AjoutProduit from "../menutakaful/MRB/ProduitMrb/AjoutProduit";
import ModifieProduitMRB from "../menutakaful/MRB/ProduitMrb/ModifieProduitMRB";
import Global from "../menutakaful/TableauBord/Global";
import GestionImpayes from "../menutakaful/TableauBord/GestionImpayes";
import Comptabilite from "../menutakaful/TableauBord/Comptabilite";
import Simulation from "../menutakaful/Utilitaire/simulation/Simulation";
import SimulationMrb from "../menutakaful/Utilitaire/simulation/SimulationMrb";
import ConsultaionRetraiteProduit from "../menutakaful/Parametrage/ProduitRetraite/ConsultationRetraiteProduit";
import ModificationRetraiteProduit from "../menutakaful/Parametrage/ProduitRetraite/Modification/ModificationRetraiteProduit";
import ConsultRetraiteContrat from "../menutakaful/GestionContrats/RetraiteContrat/ConsultRetraiteContrat/ConsultRetraiteContrat";
import SouscriptionRetraiteContrat from "../menutakaful/GestionContrats/RetraiteContrat/SouscriptionRetraiteContrat/SouscriptionRetraiteContrat";
import EchangeFichiers from "../menutakaful/EchangeFichiersInformatiques/EchangeFichiers";
import GestionsSinistre from "../menutakaful/Production Prestations/Sinistre/GestionSinistre";
import { getCurrentUser } from "../user/UserAPI";
const { Content, Footer } = Layout;
const connectedUserContext = React.createContext({ user: {} });
var event = "";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response.data,
          isAuthenticated: true,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "Vous êtes déconnecté avec succès."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });
    this.props.history.push(redirectTo);
    notification[notificationType]({
      message: "TAKAFUL",
      description: description
    });
  }

  handleLogin() {
    notification.success({
      message: "TAKAFUL",
      description: "Vous êtes connecté avec succès."
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    let acceuilM;
    if (this.state.isAuthenticated === true) {
      for (let index of this.state.currentUser.events) {
        var now = new Date();
        var now1;
        now1 = new Date(index.eventStartDate);
        let start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        );
        let startEvent = new Date(
          now1.getFullYear(),
          now1.getMonth(),
          now1.getDate(),
          now1.getHours(),
          now1.getMinutes()
        );
        var diff = Math.abs(start - startEvent);
        var minutes = Math.floor(diff / 1000 / 60);

        if (startEvent > start && minutes <= 30) {
          event = index.eventDescription;
          const btn = (
            <a href="#top" onClick={() => this.props.history.push("/agenda")}>
              plus de détails
            </a>
          );
          notification.info({
            message: "RAPPEL",
            description:
              "vous avez " + event + " d'ici " + minutes + " minutes",
            btn
          });
        }
      }

      acceuilM = (
        <connectedUserContext.Provider value={this.state.currentUser}>
          <Layout style={{ minHeight: "100vh" }}>
            <Sider
              width={240}
              style={{ backgroundColor: "#fff" }}
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <MenuTakaful
                isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                handleLogout={this.handleLogout}
              />
            </Sider>
            <Divider className="menu-divider" type="vertical" />

            <Layout>
              <AppHeader
                isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout}
              />
              <div style={{ margin: "8px 16px" }}></div>
              <Content style={{ margin: "0px 16px" }}>
                <div
                  style={{
                    padding: 40,
                    background: "#fff",
                    borderTop: "3px solid #e6e4e4"
                  }}
                >
                  <Switch>
                    <Route exact path="/" render={() => <Acceuil />}>
                      {" "}
                    </Route>

                    <Route
                      name="partenaire"
                      path="/getAllBranche"
                      render={() => <Partenaire />}
                    ></Route>
                    <Route
                      path="/CreatePartenaire"
                      render={() => <CreatePartenaire />}
                    ></Route>
                    <Route
                      path="/avenant"
                      render={() => <TypeAvenant />}
                    ></Route>
                    <Route
                      path="/CreateTypeAvenant"
                      render={() => <CreateTypeAvenant />}
                    ></Route>
                    <Route
                      path="/PointVente"
                      render={() => (
                        <PointVente currentUser={this.state.currentUser} />
                      )}
                    ></Route>

                    <Route
                      name="Restitutions"
                      path="/getRestitutions"
                      render={() => <Restitutions />}
                    ></Route>
                    <Route
                      name="Auxiliaires"
                      path="/getAuxiliaires"
                      render={() => <Auxiliaires />}
                    ></Route>
                    <Route
                      name="Honoraires"
                      path="/getHonoraires"
                      render={() => <Honoraires />}
                    ></Route>
                    <Route
                      name="Prestations"
                      path="/getPrestation"
                      render={() => <TypePrestation />}
                    ></Route>
                    <Route
                      name="CauseRestitution"
                      path="/getCauseRes"
                      render={() => <CauseRestitution />}
                    ></Route>
                    <Route
                      name="Utilisateurs"
                      path="/users"
                      render={() => (
                        <Users currentUser={this.state.currentUser} />
                      )}
                    ></Route>
                    <Route
                      name="rolesAndPermission"
                      path="/rolesAndPermission"
                      render={() => <RolesAndPermission />}
                    ></Route>

                    <Route
                      name="produitdeces"
                      path="/produitdeces"
                      render={() => <ProduitDeces record={this.props} />}
                    ></Route>
                    <Route
                      name="produitretraite"
                      path="/produitRetraite"
                      render={() => <ProduitRetraite />}
                    ></Route>
                    <Route
                      name="produitdeces"
                      path="/consultproduitdeces"
                      render={() => <ConsultProduitDeces />}
                    ></Route>
                    <Route
                      name="produitretraite"
                      path="/consultproduitretraite"
                      render={() => <ConsultaionRetraiteProduit />}
                    ></Route>
                    <Route
                      name="Agenda"
                      path="/Agenda"
                      render={() => <Agenda />}
                    ></Route>
                    <Route
                      name="souscription"
                      path="/souscription"
                      render={() => <Souscription />}
                    ></Route>
                    <Route
                      name="souscriptionRetraiteContrat"
                      path="/souscriptionRetraiteContrat"
                      render={() => (
                        <SouscriptionRetraiteContrat record={this.props} />
                      )}
                    ></Route>
                    <Route
                      name="gestionacceptation"
                      path="/gestionacceptation"
                      render={() => <GestionAcceptation record={this.props} />}
                    ></Route>
                    <Route
                      name="consultproduitdeces"
                      path="/consultproduitdeces"
                      render={() => <ConsultProduitDeces record={this.props} />}
                    ></Route>
                    <Route
                      name="consultDecesContrat"
                      path="/consultDecesContrat"
                      render={() => (
                        <ConsultDecesContrat
                          record={this.props}
                          currentUser={this.state.currentUser}
                        />
                      )}
                    ></Route>
                    <Route
                      name="consultDecesContratStatus"
                      path="/consultDecesContratStatus"
                      render={() => (
                        <ConsultDecesContratStatus
                          record={this.props}
                          currentUser={this.state.currentUser}
                        />
                      )}
                    ></Route>
                    <Route
                      name="consultRetraiteContrat"
                      path="/consultRetraiteContrat"
                      render={() => (
                        <ConsultRetraiteContrat record={this.props} />
                      )}
                    ></Route>
                    <Route
                      name="ModificationAcceptation"
                      path="/ModificationAcceptation"
                      render={() => (
                        <ModificationAcceptation record={this.props} />
                      )}
                    ></Route>
                    <Route
                      name="ConsultationAcceptation"
                      path="/ConsultationAcceptation"
                      render={() => (
                        <ConsultationAcceptation record={this.props} />
                      )}
                    ></Route>
                    <Route
                      name="DetailsContrat"
                      path="/DetailsContrat"
                      render={() => <DetailsContrat />}
                    ></Route>
                    <Route
                      name="Modification"
                      path="/Modification"
                      render={() => <Modification record={this.props} />}
                    ></Route>
                    <Route
                      name="ModificationRetraiteProduit"
                      path="/ModificationRetraiteProduit"
                      // render={(props) => <Greeting text="Hello, " {...props} />}
                      render={props => (
                        <ModificationRetraiteProduit record={this.props} />
                      )}
                    ></Route>
                    <Route
                      name="Honoraire"
                      path="/Honoraire"
                      render={() => <Honoraire />}
                    ></Route>
                    <Route
                      name="Sinistres"
                      path="/Sinistres"
                      render={() => <GestionsSinistre />}
                    ></Route>
                    <Route
                      path="/users/:username"
                      render={b => (
                        <Profile
                          isAuthenticated={this.state.isAuthenticated}
                          currentUser={this.state.currentUser}
                          {...b}
                        />
                      )}
                    ></Route>
                    <Route
                      breadcrumbName="Restitutions"
                      name="Restitutions"
                      path="/getRestitutions"
                      render={() => <Restitutions />}
                    ></Route>
                    <Route
                      breadcrumbName="Participants"
                      name="Participants"
                      path="/getParticipants"
                      render={() => <Participant />}
                    ></Route>
                    <Route
                      breadcrumbName="AllParticipant"
                      name="AllParticipant"
                      path="/AllParticipant"
                      render={() => <AllParticipant />}
                    ></Route>
                    {/* <Route
                      exact
                      path="/Discussion"
                      render={b => (
                        <Discussion
                          currentUser={this.state.currentUser}
                          {...b}
                        />
                      )}
                    ></Route> */}
                    <Route
                      breadcrumbName="Mrb"
                      name="MultirisqueBatiment"
                      path="/MultirisquesBatiment"
                      render={() => <MultirisqueBatiment record={this.props} />}
                    ></Route>
                    <Route
                      breadcrumbName="Reglement"
                      name="Reglement"
                      path="/Reglement"
                      render={() => <Reglement />}
                    ></Route>
                    <Route
                      breadcrumbName="ConsultationMrb"
                      name="ConsultationsContratsMrb"
                      path="/ConsultationsContratsMrb"
                      render={() => (
                        <ConsultationsContratsMrb record={this.props} />
                      )}
                    ></Route>
                    <Route
                      breadcrumbName="ProduitMrb"
                      name="ProduitMrb"
                      path="/ProduitMrb"
                      render={() => <ProduitMRB />}
                    ></Route>
                    <Route
                      breadcrumbName="AjoutProduit"
                      name="AjoutProduit"
                      path="/AjoutProduit"
                      render={() => <AjoutProduit record={this.props} />}
                    ></Route>
                    <Route
                      name="ModifieProduitMRB"
                      path="/ModifieProduitMRB"
                      render={() => <ModifieProduitMRB record={this.props} />}
                    ></Route>
                    <Route
                      name="EchangeFichiers"
                      path="/echangefichiers"
                      render={() => <EchangeFichiers />}
                    ></Route>
                    <Route
                      name="GestionImpayes"
                      path="/GestionImpayes"
                      render={() => <GestionImpayes />}
                    ></Route>
                    <Route
                      name="Simulation"
                      path="/Simulation"
                      render={() => (
                        <Simulation currentUser={this.state.currentUser} />
                      )}
                    ></Route>
                    <Route
                      name="SimulationMrb"
                      path="/SimulationMrb"
                      render={() => <SimulationMrb record={this.props} />}
                    ></Route>
                    <Route
                      name="Global"
                      path="/Global"
                      render={() => <Global />}
                    ></Route>
                    <Route
                      name="Comptabilite"
                      path="/Comptabilite"
                      render={() => <Comptabilite record={this.props} />}
                    ></Route>
                    <Route render={() => <NotFound />}></Route>
                  </Switch>
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}>MAMDA-MCMA ©2020</Footer>
            </Layout>
          </Layout>
        </connectedUserContext.Provider>
      );
    } else {
      acceuilM = (
        <div className="h100">
          <Switch>
            <Route
              exact
              path="/"
              render={props => <Login onLogin={this.handleLogin} {...props} />}
            ></Route>
            <Route
                      name="MotDepasseOublie"
                      path="/MotDepasseOublie"
                      render={() => <MotDepasseOublie />}
                    ></Route>
            <Route render={() => <NotFound />}></Route>
          </Switch>
        </div>
      );
    }
    return <div className="h100">{acceuilM}</div>;
  }
}

export default withRouter(App);
export { connectedUserContext };
