/* eslint-disable react/prop-types */
import { Divider, Icon, Menu } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";

// import logo from "../assets/takaLogoW.webp";
import logo from "../assets/TTTakafulW.png";
import ConsultDecesContrat from "./GestionContrats/ConsultDecesContrat";
import ConsultDecesContratStatus from "./GestionContratsStatus/ConsultDecesContratStatus";
import Reglement from "./GestionContrats/DetailsTabs/Reglement";
import ConsultationsContratsMrb from "./MRB/ConsultationsContratsMrb";
import MultirisqueBatiment from "./MRB/MultirisqueBatiment";
import ProduitMRB from "./MRB/ProduitMrb/ProduitMRB";
import TypeAvenant from "./Parametrage/avenant/TypeAvenant";
import Partenaire from "./Parametrage/partenaire/Partenaire";
import PointVente from "./Parametrage/pointvente/PointVente";
import Participant from "./Participants/Participant";
import GestionAcceptation from "./Production Prestations/GestionAcceptation/GestionAcceptation";
import Honoraire from "./Production Prestations/Honoraire/Honoraire";
import Souscription from "./Production Prestations/Souscription/Souscription";
import Global from "./TableauBord/Global";
import Agenda from "./Utilitaire/Agenda";
import ConsultRetraiteContrat from "./GestionContrats/RetraiteContrat/ConsultRetraiteContrat/ConsultRetraiteContrat";
import SouscriptionRetraiteContrat from "./GestionContrats/RetraiteContrat/SouscriptionRetraiteContrat/SouscriptionRetraiteContrat";
import EchangeFichiers from "./EchangeFichiersInformatiques/EchangeFichiers";
import GestionsSinistre from "./Production Prestations/Sinistre/GestionSinistre";
import {
  CREATION_CONTRAT,
  GESTION_ACCEPTATION,
  GESTION_PATAMETRAGE,
  GESTION_ROLE_ET_PERMISSION,
  GESTION_UTILISATEURS,
  SIMULATION,
  CONTRAT_DECES,
  CONTRAT_MRB,
  CONTRAT_RETRAITE,
  PARAMETRAGE_POINT_VENTE,
  SIMULATION_MRB,
  AUTRE,
  PARTICIPANTS
} from "../constants";

const { SubMenu } = Menu;

class MenuGauche extends Component {
  rootSubmenuKeys = [
    "administration",
    "parametrage",
    "sub4",
    "sub9",
    "Utilitaire"
  ];

  state = {
    users: false,
    rolesandprivileges: false,
    parametrage: false,
    gestionAcceptation: false,
    souscription: false,
    simulation: false,
    simulationMrb: false,
    deces: false,
    mrb: false,
    retraite: false,
    openKeys: [],
    pointVente: false,
    autre: false,
    participants: false
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  componentDidMount() {
    let privilege = [];
    this.props.currentUserRoles.forEach(element => {
      privilege = [...privilege, ...element.privileges];
    });

    privilege.forEach(element => {
      switch (element.name) {
        case GESTION_UTILISATEURS:
          this.setState({
            users: true
          });
          break;
        case GESTION_ROLE_ET_PERMISSION:
          this.setState({
            rolesandprivileges: true
          });
          break;
        case GESTION_PATAMETRAGE:
          this.setState({
            parametrage: true
          });
          break;
        case GESTION_ACCEPTATION:
          this.setState({
            gestionAcceptation: true
          });
          break;
        case CREATION_CONTRAT:
          this.setState({
            souscription: true
          });
          break;
        case SIMULATION:
          this.setState({
            simulation: true
          });
          break;
        case CONTRAT_DECES:
          this.setState({
            deces: true
          });
          break;
        case CONTRAT_MRB:
          this.setState({
            mrb: true
          });
          break;
        case CONTRAT_RETRAITE:
          this.setState({
            retraite: true
          });
          break;
        case PARAMETRAGE_POINT_VENTE:
          this.setState({
            pointVente: true
          });
          break;
        case SIMULATION_MRB:
          this.setState({
            simulationMrb: true
          });
          break;
        case AUTRE:
          this.setState({
            autre: true
          });
          break;
        case PARTICIPANTS:
          this.setState({
            participants: true
          });
          break;
      }
    });
  }

  render() {
    return (
      <div>
        <div className="logo-partent">
          <Link to="/">
            <img src={logo} className="logoW" alt="takaful" />
          </Link>
        </div>
        <Divider type="horizontal" />
        <Menu
          mode="inline"
          theme="light"
          className="menu-taka-left"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
        >
          <Menu.Divider className="menu-divider" />
          {this.state.rolesandprivileges || this.state.users ? (
            <SubMenu
              key="administration"
              onTitleClick={this.onClick}
              title={
                <span>
                  <Icon type="safety-certificate" />
                  <span>Administration</span>
                </span>
              }
            >
              <Menu.Divider className="menu-divider" />
                <Menu.Item key="Privilèges">
                  <Link to="/ConsultDecesContratStatus"
                    component={ConsultDecesContratStatus}
                    >
                    <Icon type="schedule" /> Privilèges
                  </Link>
                </Menu.Item>
              
              <Menu.Divider className="menu-divider" />
              {this.state.users && (
                <Menu.Item key="users">
                  <Link to="/users">
                    {" "}
                    <Icon type="user" /> Utilisateurs
                  </Link>
                </Menu.Item>
              )}

              <Menu.Divider className="menu-Divider" dashed="true" />
              {this.state.rolesandprivileges && (
                <Menu.Item key="permission">
                  <Link to="/rolesAndPermission">
                    <Icon type="unlock" /> Rôles et Permissions
                  </Link>
                </Menu.Item>
              )}
            </SubMenu>
          ) : (
            ""
          )}

          <Menu.Divider className="menu-divider" />
          {this.state.parametrage || this.state.pointVente ? (
            <SubMenu
              key="parametrage"
              title={
                <span>
                  <Icon type="setting" />
                  <span>Paramétrage</span>
                </span>
              }
            >
              <Menu.Divider className="menu-divider" />
              {this.state.parametrage && (
                <SubMenu key="sub19" title={<span>Paramétrage Produit</span>}>
                  <Menu.Divider className="menu-divider" />

                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="9">
                    <Link to="/consultproduitdeces">
                      <Icon type="setting" /> Produit décès
                    </Link>
                  </Menu.Item>
                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="Retraite-Produit">
                    <Link to="/consultproduitretraite">
                      <Icon type="setting" /> Produit retraite
                    </Link>
                  </Menu.Item>
                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="ProduitMrb">
                    <Link to="/ProduitMrb" component={ProduitMRB}>
                      <Icon type="setting" />
                      Produit MRB
                    </Link>
                  </Menu.Item>
                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="Restitutions">
                    <Link to="/getRestitutions">
                      <Icon type="setting" /> Restitutions
                    </Link>
                  </Menu.Item>

                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="CauseRestitution">
                    <Link to="/getCauseRes">
                      <Icon type="setting" /> Causes restitution
                    </Link>
                  </Menu.Item>
                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="typePrestation">
                    <Link to="/getPrestation">
                      <Icon type="setting" /> Types prestation
                    </Link>
                  </Menu.Item>
                  <Menu.Divider className="menu-divider" dashed="true" />
                  <Menu.Item key="avenant">
                    <Link to="/avenant" component={TypeAvenant}>
                      <Icon type="setting" /> Types d&apos;avenant
                    </Link>
                  </Menu.Item>
                </SubMenu>
              )}
              <Menu.Divider className="menu-divider" />
              {this.state.parametrage && (
                <SubMenu
                  key="sub90"
                  title={<span>Paramétrage Auxiliaire</span>}
                >
                  <Menu.Divider className="menu-divider" />
                  <Menu.Item key="Auxiliaires">
                    <Link to="/getAuxiliaires">
                      <Icon type="setting" />
                      Auxiliaires
                    </Link>
                  </Menu.Item>
                  <Menu.Divider className="menu-divider" dashed="true" />

                  <Menu.Item key="Honoraires">
                    <Link to="/getHonoraires">
                      <Icon type="setting" />
                      Honoraires
                    </Link>
                  </Menu.Item>
                </SubMenu>
              )}
              <Menu.Divider className="menu-divider" />
              <SubMenu
                key="sub91"
                title={<span>Paramétrage Intermédiaire</span>}
              >
                {this.state.parametrage && (
                  <Menu.Item key="partenaire">
                    <Link to="/getAllBranche" component={Partenaire}>
                      <Icon type="setting" />
                      Intermédiaire
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Divider className="menu-divider" dashed="true" />
                {this.state.pointVente && (
                  <Menu.Item key="pointvente">
                    <Link to="/pointvente" component={PointVente}>
                      <Icon type="setting" /> Point de vente
                    </Link>
                  </Menu.Item>
                )}
              </SubMenu>
            </SubMenu>
          ) : (
            ""
          )}
          <Menu.Divider className="menu-divider" />
          {this.state.simulation && (
            <Menu.Item key="56">
              {" "}
              <Link to="/Simulation">
                <span>
                  <Icon type="exclamation-circle" />
                  <span>Simulation Décès Financement</span>
                </span>
              </Link>
            </Menu.Item>
          )}
          {this.state.simulationMrb && (
            <Menu.Item key="560">
              {" "}
              <Link to="/SimulationMrb">
                <span>
                  <Icon type="exclamation-circle" />
                  <span>Simulation MRB</span>
                </span>
              </Link>
            </Menu.Item>
          )}
          <Menu.Divider className="menu-divider" />
          {this.state.participants && (
            <Menu.Item key="participant">
              <Link to="/AllParticipant" component={Participant}>
                <Icon type="team" />
                Participants / Clients
              </Link>
            </Menu.Item>
          )}

          <Menu.Divider className="menu-divider" />
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="file-text" />
                <span>Production / Prestations</span>
              </span>
            }
          >
            <Menu.Divider className="menu-divider" />
            {this.state.deces && (
              <SubMenu
                key="sub7"
                title={
                  <span>
                    {" "}
                    <Icon type="file-zip" /> Contrats Décès
                  </span>
                }
              >
                {this.state.souscription && (
                  <Menu.Item key="23">
                    <Link to="/souscription" component={Souscription}>
                      <Icon type="user-add" /> Nouvelle Souscription
                    </Link>
                  </Menu.Item>
                )}
                {this.state.gestionAcceptation && (
                  <Menu.Item key="25">
                    <Link
                      to="/gestionacceptation"
                      component={GestionAcceptation}
                    >
                      <Icon type="carry-out" /> Gestion des acceptations
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Item key="26">
                  <Link
                    to="/consultDecesContrat"
                    component={ConsultDecesContrat}
                  >
                    <Icon type="schedule" /> Gestion des contrats
                  </Link>
                </Menu.Item>
              </SubMenu>
            )}
            <Menu.Divider className="menu-divider" />
            {this.state.retraite && (
              <SubMenu
                key="sub88"
                title={
                  <span>
                    {" "}
                    <Icon type="file-zip" /> Contrats Retraite
                  </span>
                }
              >
                {this.state.souscription && (
                  <Menu.Item key="souscriptionRetraite">
                    <Link
                      to="/souscriptionRetraiteContrat"
                      component={SouscriptionRetraiteContrat}
                    >
                      <Icon type="user-add" /> Nouvelle Souscription
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Item key="getRetraiteContrats">
                  <Link
                    to="/consultRetraiteContrat"
                    component={ConsultRetraiteContrat}
                  >
                    <Icon type="schedule" /> Gestion des contrats
                  </Link>
                </Menu.Item>
              </SubMenu>
            )}
            {this.state.autre && (
              <Menu.Item key="19">
                <Link to="/Honoraire" component={Honoraire}>
                  <Icon type="form" /> Honoraires
                </Link>
              </Menu.Item>
            )}
            {this.state.autre && (
              <Menu.Item key="20">
                <Icon type="money-collect" /> Commissions
              </Menu.Item>
            )}
            {this.state.autre && (
              <Menu.Item key="21">
                <Link to="/Reglement" component={Reglement}>
                  <Icon type="file" /> Réglements
                </Link>
              </Menu.Item>
            )}
            {this.state.autre && (
              <Menu.Item key="22">
                <Link to="/Sinistres" component={GestionsSinistre}>
                <Icon type="fire" />
                    Sinistres Décès
                </Link>
              </Menu.Item>)}
          </SubMenu>

          <Menu.Divider className="menu-divider" />
          {this.state.autre && (
            <Menu.Item key="24">
              {" "}
              <span style={{ color: "white" }}>
                <Icon type="eye" />
                <span>Traitement périodique</span>
              </span>
            </Menu.Item>
          )}
          <Menu.Divider className="menu-divider" />
          {this.state.mrb && (
            <SubMenu
              key="sub9"
              title={
                <span>
                  <Icon type="home" />
                  <span>Multirisques bâtiment</span>
                </span>
              }
            >
              <Menu.Divider className="menu-divider" />
              {this.state.souscription && (
                <Menu.Item key="31">
                  <Link
                    to="/MultirisquesBatiment"
                    component={MultirisqueBatiment}
                  >
                    Nouvelle souscription MRB
                  </Link>
                </Menu.Item>
              )}
              <Menu.Divider className="menu-divider" dashed="true" />
              <Menu.Item key="32">
                <Link
                  to="/ConsultationsContratsMrb"
                  component={ConsultationsContratsMrb}
                >
                  Consulation des contrats MRB
                </Link>
              </Menu.Item>
            </SubMenu>
          )}
          <Menu.Divider className="menu-divider" />
          {this.state.autre && (
            <Menu.Item key="global">
              <Link to="/Global" component={Global}>
                <Icon type="dollar" />
                Comptabilité
              </Link>
            </Menu.Item>
          )}
           <Menu.Divider className="menu-divider" />
          {/* {this.state.autre && (
            <Menu.Item key="tableau">
              <Link to="" >
                <Icon type="dashboard" />
                Tableau de bord
              </Link>
            </Menu.Item>
          )} */}
          <Menu.Divider className="menu-divider" />
          {this.state.autre && (
            <Menu.Item key="echangefichiers">
              <Link to="/echangefichiers" component={EchangeFichiers}>
                <Icon type="file" />
                Échange fichiers informatiques
              </Link>
            </Menu.Item>
          )}

          <Menu.Divider className="menu-divider" />

          <SubMenu
            key="Utilitaire"
            title={
              <span>
                <Icon type="idcard" />
                <span>Utilitaires</span>
              </span>
            }
          >
            {/* <Menu.Item key="Discussion">
              <Link to="Discussion">
                <span>
                  <Icon type="wechat" />
                  <span>Discussion</span>
                </span>
              </Link>
            </Menu.Item> */}
            <Menu.Item key="Agenda">
              <Link to="/Agenda" component={Agenda}>
                <Icon type="calendar" /> Agenda
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default MenuGauche;
