/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import moment from "moment";
import { Descriptions, Button, Icon } from "antd";
import React, { Component } from "react";
import {
  lettreOrientation,
  getNormeByCapitalAndAge
} from "../../Souscription/SouscriptionAPI";
import { STATUS_WAITING_ACCEPTATION } from "../../../../constants/index";

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      normes: {}
    };
  }
  async jasperLettre(requestLettre) {
    let response = await lettreOrientation(requestLettre);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async normeCapitalAge(age, capital, produit) {
    let responseNorme = await getNormeByCapitalAndAge(age, capital, produit);
    console.log(responseNorme);
    this.setState({
      normes: responseNorme.data
    });
  }
  componentDidMount() {
    console.log("props:", this.props);
    const agee = moment().diff(
      moment(
        this.props.record.contrat.souscripteur.dateNaissance,
        "DD-MM-YYYY"
      ).format(),
      "years"
    );
    this.normeCapitalAge(
      agee,
      this.props.record.cumul,
      this.props.record.contrat.produit.id
    );

    console.log("responseNorm:", this.props.record.cumul);
  }
  edit = () => {
    let examens = [];
    for (let honoraire of this.state.normes.honoraires) {
      examens.push(honoraire.code);
    }

    const listNorme = examens.toString();
    console.log("listNorme:", this.state.normes);

    let requestLettreOrientation = {
      ville: this.props.record.contrat.souscripteur.adressVille,
      nomPrenom:
        this.props.record.contrat.souscripteur.nom +
        " " +
        this.props.record.contrat.souscripteur.prenom,
      cin: this.props.record.contrat.souscripteur.cin,
      montantFinancement: this.props.record.contrat.capitalAssure,
      montantEncours: this.props.record.encours,
      montantCumul: this.props.record.cumul,
      differe: this.props.record.contrat.differe,
      duree: this.props.record.contrat.dureeContrat,
      taux: this.props.record.contrat.tauxInteret,
      intermediaire: this.props.record.contrat.produit.partenaire.raisonSocial,
      agence: this.props.record.contrat.pointVente.libelle,
      norme: listNorme,
      dateNaissance: this.props.record.contrat.souscripteur.dateNaissance,
      pointVenteVille: this.props.record.contrat.pointVente.adressVille,
      examinateurId: this.props.record.contrat.orientation,
      codeAcceptation: this.props.record.code
    };

    this.jasperLettre(requestLettreOrientation);
  };
  render() {
    const { record } = this.props;
    const age = moment().diff(
      moment(record.contrat.assure.dateNaissance, "DD-MM-YYYY").format(),
      "years"
    );

    return (
      <div>
        <Descriptions size="middle" title="Produit" bordered>
          <Descriptions.Item label="Partenaire">
            {record.contrat.produit.partenaire.libelle}
          </Descriptions.Item>
          <Descriptions.Item label="Produit">
            {record.contrat.produit.libelle}
          </Descriptions.Item>
          <Descriptions.Item label="Agence">
            {record.contrat.pointVente.libelle}
          </Descriptions.Item>
          <Descriptions.Item label="Intermédiaire">
            {record.contrat.produit.partenaire.raisonSocial}
          </Descriptions.Item>
        </Descriptions>
        <br></br>
        <Descriptions size="middle" title="Information contribuant" bordered>
          <Descriptions.Item label="Date de naissance">
            {record.contrat.assure.dateNaissance}
          </Descriptions.Item>
          <Descriptions.Item label="Nom assuré">
            {record.contrat.assure.nom}
          </Descriptions.Item>
          <Descriptions.Item label="Prenom assuré">
            {record.contrat.assure.prenom}
          </Descriptions.Item>
          <Descriptions.Item label="CIN">
            {record.contrat.assure.cin}
          </Descriptions.Item>
          <Descriptions.Item label="Date de creation" span={2}>
            {record.contrat.assure.creationDate}
          </Descriptions.Item>
          <Descriptions.Item label="N Compte Bancaire" span={3}>
            {record.contrat.assure.rib}
          </Descriptions.Item>
          <Descriptions.Item label="Age">{age}</Descriptions.Item>
          <Descriptions.Item label="Observation">
            {record.contrat.observation}
          </Descriptions.Item>
        </Descriptions>
        <br></br>
        <Descriptions size="middle" title="Détail" bordered>
          <Descriptions.Item label="Montant Financement(DH)">
            {record.contrat.capitalAssure}
          </Descriptions.Item>
          <Descriptions.Item label="L'encours(DH)">
            {record.encours}
          </Descriptions.Item>
          <Descriptions.Item label="Cumul(DH)">
            {record.cumul}
          </Descriptions.Item>
          <Descriptions.Item label="Durée(mois)">
            {record.contrat.dureeContrat}
          </Descriptions.Item>
          <Descriptions.Item label="Différé(mois)" span={2}>
            {record.contrat.differe}
          </Descriptions.Item>
          <Descriptions.Item label="N° dossier de financement" span={3}>
            {record.contrat.numeroDossierFinancement}
          </Descriptions.Item>
          <Descriptions.Item label="Code Acceptation">
            {record.code}
          </Descriptions.Item>
        </Descriptions>
        <br></br>
        <Descriptions size="middle" title="Prime" bordered>
          <Descriptions.Item label="périodicité">
            {record.contrat.periodicite.libelle}
          </Descriptions.Item>
          <Descriptions.Item label="Cotisation au tarif normal">
            {record.contrat.montantCotisation}
          </Descriptions.Item>
          <Descriptions.Item label="Surprime">
            {record.contrat.tauxSurprime}
          </Descriptions.Item>
          <Descriptions.Item label="Cotisation avec surprime">
            {record.contrat.montantSurprime}
          </Descriptions.Item>
        </Descriptions>
        <br></br>
        {record.contrat.status === STATUS_WAITING_ACCEPTATION && (
          <Descriptions size="middle" title="Fichiers">
            <Descriptions.Item label="Lettre d'orientation ">
              <Button onClick={() => this.edit()}>
                <Icon type="upload" />
                Télécharger
              </Button>
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
    );
  }
}

export default General;
