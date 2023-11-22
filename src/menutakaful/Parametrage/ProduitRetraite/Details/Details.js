import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Tag
} from "antd";
import React, { Component } from "react";
import {
  commissionsColumns,
  formItemLayoutDetailsRetraiteProduit,
  initialState,
  typePrestationColumns
} from "./DetailsConstants";
import ComponentTitle from "../../../../util/Title/ComponentTitle";

import { MyContext } from "../ConsultationRetraiteProduit.js";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.columns = commissionsColumns;
    this.columns1 = typePrestationColumns(Tag);
  }
  handleReload() {
    window.location.reload();
  }

  render() {
    const formItemLayout = formItemLayoutDetailsRetraiteProduit;
    let libelles = [];
    return (
      <div className="person">
        <ComponentTitle title="Consultation Retraite Produit" />
        <MyContext.Consumer>
          {context => (
            <React.Fragment>
              <h3>Détails du produit : {context.state.libelle}</h3>
              <Divider
                style={{ marginBottom: "30px", marginTop: "10px" }}
              ></Divider>

              <Row
                style={{
                  backgroundColor: "rgb(0,0,0,0.02)",
                  marginBottom: "30px",
                  marginTop: "10px"
                }}
              >
                <Col span={20}>
                  <Divider orientation="left">Paramètres générales</Divider>
                </Col>
                <Col span={24}>
                  <Form {...formItemLayout}>
                    <Col span={12}>
                      <Form.Item label="Code">
                        <Input value={context.state.code} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Libelle">
                        <Input value={context.state.libelle} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="N° d'homologation">
                        <Input value={context.state.numeroHomologation} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Date d'homologation">
                        <Input value={context.state.dateHomologation} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Frais de Gestion WAKALA
                          </label>
                        }
                      >
                        <InputNumber
                          value={context.state.fraisGestion}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Frais d'acquisition">
                        <InputNumber
                          value={context.state.fraisAcquisition}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Taux Taxe D&aposAssurance
                          </label>
                        }
                      >
                        <InputNumber
                          value={context.state.taxe}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={20}>
                      <Divider orientation="left">
                        Modalités de Rachat Total
                      </Divider>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Application de rachat total">
                        <Input
                          value={context.state.rachatTotal ? "Oui" : "Non"}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Durée Minimale Sousciption Avant Rachat Total
                          </label>
                        }
                        style={
                          context.state.rachatTotal !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state
                              .dureeMinimalSouscriptionAvantRachatTotal
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Application de la condition disciplinaire
                          </label>
                        }
                        style={
                          context.state.rachatTotal !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state.conditionDisciplinaireTotale
                              ? "Oui"
                              : "Non"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Nature de la condition disciplinaire
                          </label>
                        }
                        style={
                          context.state.natureConditionDisciplinaireTotale ===
                            "ASAISIR" ||
                          context.state.conditionDisciplinaireTotale === false
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state.natureConditionDisciplinaireTotale ===
                            "POURCENTAGE"
                              ? "Pourcentage"
                              : "Fixe"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Valeur de la condition disciplinaire
                          </label>
                        }
                        style={
                          context.state.natureConditionDisciplinaireTotale ===
                            "ASAISIR" ||
                          context.state.conditionDisciplinaireTotale === false
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state.valeurConditionDisciplinaireTotale
                          }
                          addonAfter={
                            context.state.natureConditionDisciplinaireTotale ===
                            "FIXE"
                              ? "DHS"
                              : "%"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={20}>
                      <Divider orientation="left">
                        Modalités de Rachat Partiel
                      </Divider>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Application de rachat partiel
                          </label>
                        }
                      >
                        <Input
                          value={context.state.rachatPartiel ? "Oui " : "Non"}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Durée Minimale de Souscription avant rachat Partiel
                          </label>
                        }
                        style={
                          context.state.rachatPartiel !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={
                            context.state
                              .dureeMinimalSouscriptionAvantRachatPartiel
                          }
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Application de la conditionn disciplinaire
                          </label>
                        }
                        style={
                          context.state.rachatPartiel !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state.conditionDisciplinairePartiel
                              ? "Oui"
                              : "Non"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Nature de la condition disciplinaire
                          </label>
                        }
                        style={
                          context.state.natureConditionDisciplinairePartiel ===
                            "ASAISIR" ||
                          context.state.conditionDisciplinairePartiel === false
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state.natureConditionDisciplinairePartiel
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Valeur de la condition disciplinaire
                          </label>
                        }
                        style={
                          context.state.natureConditionDisciplinairePartiel ===
                            "ASAISIR" ||
                          context.state.conditionDisciplinairePartiel === false
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <Input
                          value={
                            context.state.valeurConditionDisciplinairePartiel
                          }
                          addonAfter={
                            context.state
                              .natureConditionDisciplinairePartiel === "FIXE"
                              ? "DHS"
                              : "%"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Maximum du montant de rachat partiel
                          </label>
                        }
                        style={
                          context.state.rachatTotal !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={context.state.maximumMontantRachatPartiel}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Nombre Maximum de fois de rachat partiel
                          </label>
                        }
                        style={
                          context.state.rachatTotal !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={context.state.nombreMaximumRachatPartiel}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={20}>
                      <Divider orientation="left">Paramètres globaux </Divider>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Numéro du compte TAKAFUL">
                        <InputNumber
                          value={context.state.numeroCompte}
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Intitulé du compte TAKAFUL">
                        <Input value={context.state.libelleCompte} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Pool D'investissement">
                        <Input
                          style={{ display: "none" }}
                          value={context.state.poolInvestissment.map(element =>
                            libelles.push(element.libelle)
                          )}
                        ></Input>

                        <Input value={libelles.join()} />
                      </Form.Item>
                    </Col>
                    <Col span={20}>
                      <Divider orientation="left">
                        Paramètres de fiscalité{" "}
                      </Divider>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Nature Fiscale">
                        <Input
                          value={
                            context.state.natureFiscale === "EPARGNE "
                              ? "Epargne"
                              : "Retraite complémentaire"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Revenu global">
                        <Input value={context.state.revenuGlobal} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Régime Fiscale">
                        <Input
                          value={
                            context.state.natureFiscale === "RETRAITE "
                              ? "Retraite complémentaire"
                              : "Vie capitalisation"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Taux de rendement avant imposition">
                        <InputNumber
                          value={context.state.tauxRendementAvantImposition}
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={20}>
                      <Divider orientation="left">
                        Paramètres de Souscription{" "}
                      </Divider>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Durée Minimale de souscription
                          </label>
                        }
                      >
                        <InputNumber
                          value={context.state.dureeMinimalSouscription}
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Renouvellement de contrat Tacite Reconduction
                          </label>
                        }
                      >
                        <Input
                          value={
                            context.state
                              .renouvellementContratTaciteReconduction
                              ? "Oui"
                              : "Non"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Montant minimum de contribution">
                        <InputNumber
                          value={context.state.montantMinContribution}
                          addonAfter="DHS"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Taux de Rendement cible avec imposition
                          </label>
                        }
                      >
                        <InputNumber
                          value={context.state.tauxRendementAvantImposition}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Mode De Gestion">
                        <Input
                          value={
                            context.state.modeGestion === "MOUDARABA"
                              ? "Moudaraba"
                              : "WakalabillIstithmar"
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Profit Moudaraba"
                        style={
                          context.state.modeGestion !== "MOUDARABA"
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={context.state.profitMoudaraba}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Frais WAKALA BIL ISTITHMAR"
                        style={
                          context.state.modeGestion !== "WAKALABILISTITMAR"
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={context.state.fraisFixeWakalabilIstithmar}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Superformance WAKALA BIL ISTITHMAR"
                        style={
                          context.state.modeGestion !== "WAKALABILISTITMAR"
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={context.state.surperformanceWakalabilIstithmar}
                          addonAfter="%"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Durée minimale avant rachat partiel"
                        style={
                          context.state.rachatPartiel !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={
                            context.state
                              .dureeMinimalSouscriptionAvantRachatPartiel
                          }
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Durée minimale avant rachat totale"
                        style={
                          context.state.rachatTotal !== true
                            ? { display: "none" }
                            : ""
                        }
                      >
                        <InputNumber
                          value={
                            context.state
                              .dureeMinimalSouscriptionAvantRachatTotal
                          }
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={
                          <label style={{ whiteSpace: "normal" }}>
                            Mode du calcul du capital constitué révelorisé
                          </label>
                        }
                      >
                        <Input
                          value={
                            context.state.modeCalculCapitalConstitue ===
                            "METHOD1"
                              ? "Méthode 1 – Début de période + cotisations du mois (non investies)"
                              : "Méthode 2 – Fin de période"
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Form>
                </Col>
              </Row>
              <h3>Périodicités</h3>
              <Divider
                style={{ marginBottom: "30px", marginTop: "10px" }}
              ></Divider>
              <Row
                style={{
                  backgroundColor: "rgb(0,0,0,0.02)",
                  marginBottom: "30px",
                  marginTop: "10px"
                }}
              >
                <Col span={24}>
                  <Col span={12}>
                    <h3>Périodicités</h3>
                    <Divider
                      style={{
                        marginBottom: "3px",
                        marginTop: "10px",
                        width: "5%"
                      }}
                    ></Divider>
                    {context.state.periodicites.map(element => {
                      return (
                        <Tag
                          key={element.id}
                          color="geekblue"
                          style={{ margin: "20px 4px" }}
                        >
                          {element.libelle}
                        </Tag>
                      );
                    })}
                  </Col>

                  {/* <Col span={12}>
                      <h3>Points de Vente</h3>
                      <Divider
                        style={{ marginBottom: "3px", marginTop: "10px" }}
                      ></Divider>
                      {context.state.pointVentes.map((element) => {
                        return (
                          <Tag color="cyan" style={{ margin: "20px 4px" }}>
                            {element.libelle}
                          </Tag>
                        );
                      })}
                    </Col> */}
                </Col>
              </Row>

              {/* <h3>Commisssions</h3>
                <Divider
                  style={{ marginBottom: "30px", marginTop: "10px" }}
                ></Divider>
                <Row
                  style={{
                    backgroundColor: "rgb(0,0,0,0.02)",
                    marginBottom: "30px",
                    marginTop: "10px",
                  }}
                >
                  <Col span={24}>
                    <Table
                      rowClassName="editable-row"
                      columns={this.columns}
                      dataSource={context.state.commissions}
                      pagination={false}
                    />
                  </Col>
                </Row> */}

              {/* <h3>Types de prestations</h3>
                <Divider
                  style={{ marginBottom: "30px", marginTop: "10px" }}
                ></Divider>
                <Row
                  style={{
                    backgroundColor: "rgb(0,0,0,0.02)",
                    marginBottom: "30px",
                    marginTop: "10px",
                  }}
                >
                  <Col span={24}>
                    <Table
                      rowClassName="editable-row"
                      columns={this.columns1}
                      dataSource={context.state.prestations}
                      pagination={false}
                    />
                  </Col>
                </Row> */}
            </React.Fragment>
          )}
        </MyContext.Consumer>

        <Button
          type="primary"
          className="add-button"
          onClick={() => this.handleReload()}
        >
          <Icon type="arrow-left" />
          Retour
        </Button>
      </div>
    );
  }
}
export default Details;
