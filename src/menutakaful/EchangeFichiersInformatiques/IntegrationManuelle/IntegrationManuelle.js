import "antd/dist/antd.css";
import React, { Component } from "react";
import {
  Col,
  Form,
  Row,
  Button,
  message,
  Upload,
  Icon,
  notification
} from "antd";
import { getPartenaireByCode } from "../../Parametrage/partenaire/PartenaireAPI";
import { getPointVenteByCodeInterne } from "../../Parametrage/pointvente/PointVenteAPI";
import {
  getRetraiteContratByNumeroContrat,
  getRetraiteProduitByCode
} from "../../Parametrage/ProduitRetraite/ProduitRetraiteAPI";
import { addFlux } from "../EchangeFileAPI";
import { ajoutCotisation } from "../../TableauBord/CotisationAPI";
class IntegrationManuelle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedFilesNamed: [],
      filesContent: [],
      etatFlux: "accepté",
      motifRejetFlux: "",
      partenaire: "",
      produit: "",
      typeFlux: "",
      dateTraitement: "",
      cotisationsListRequest: [],
      fluxListRequest: [],
      fluxRequestModel: {},
      validLines: 0,
      contratFound: false,
      agenceFound: false,
      contratObject: {},
      agenceObject: {},
      totalNumberLines: 0
    };
    this.addFileToTable = this.addFileToTable.bind(this);
    this.removeFileFromTable = this.removeFileFromTable.bind(this);
    this.addContentToTable = this.addContentToTable.bind(this);
    this.fileTitleWorker = this.fileTitleWorker.bind(this);
  }

  async getPointVenteByCode(code) {
    await getPointVenteByCodeInterne(code).then(responseAgence => {
      this.setState({
        agenceObject: responseAgence.data,
        agenceFound: true
      });
    });
  }

  async getRetraiteContratByNumero(numero) {
    await getRetraiteContratByNumeroContrat(numero).then(responseContrat => {
      this.setState({
        contratFound: true,
        contratObject: responseContrat.data
      });
    });
  }

  async addCotisation(cotisationRequest) {
    await ajoutCotisation(cotisationRequest);
  }

  addFileToTable(name) {
    this.setState({
      acceptedFilesNamed: [...this.state.acceptedFilesNamed, name.slice(0, -4)]
    });
  }

  addContentToTable(content) {
    this.setState({
      filesContent: [...this.state.filesContent, content]
    });
  }

  removeFileFromTable(name) {
    const index = this.state.acceptedFilesNamed.indexOf(name.slice(0, -4));
    const newFiles = [...this.state.acceptedFilesNamed];
    newFiles.splice(index, 1);
    const newContent = [...this.state.filesContent];
    newContent.splice(index, 1);
    this.setState({
      acceptedFilesNamed: newFiles,
      filesContent: newContent
    });
  }

  async readLines(splitedFileContent, typeFlux) {
    this.setState({
      cotisationsListRequest: [],
      validLines: 0
    });
    if (splitedFileContent !== []) {
      let lines;
      for (const element of splitedFileContent) {
        lines = element.split("$");
        this.setState({
          agenceFound: false,
          contratFound: false,
          contratObject: {},
          agenceObject: {}
        });
        if (lines.length === 7) {
          let line = lines;
          let numeroContrat = line[0];
          let codeAgence = line[1];
          let montantCotisation = line[5] / 100;
          let date = line[4].replaceAll(".", "-");
          let dateFormated = date
            .split("-")
            .reverse()
            .join("-");
          await this.getRetraiteContratByNumero(numeroContrat);
          if (this.state.contratFound) {
            await this.getPointVenteByCode(codeAgence);
            if (this.state.agenceFound) {
              let requestCotisation = {
                montantTTC: montantCotisation,
                montantCotisation: montantCotisation.toFixed,
                contributionPure: montantCotisation,
                contrat: this.state.contratObject.id,
                etatCotisation: "EMIS",
                datePrelevement: dateFormated,
                cotisationType:
                  typeFlux === "PRL" ? "Epargne periodique" : "Epargne Libre"
              };
              this.setState({
                validLines: this.state.validLines + 1
              });
              await this.addCotisation(requestCotisation);
            }
          }
        }
      }
    }
  }

  getNumberOfLinesFile(fileContent) {
    const splitedFileContent = fileContent.trim().split("\r\n");
    splitedFileContent.forEach(lines => {
      const line = lines.split("$");
      if (line.length === 2) {
        this.setState({
          totalNumberLines: line[0]
        });
      }
    });
  }
  fileTitleWorker = async fileTitle => {
    const titleElements = fileTitle.split("_");
    let typeFlux;
    if (titleElements.length !== 4) {
      this.setState({
        etatFlux: "rejeté",
        motifRejetFlux: "Nom de fichier invalide : " + fileTitle
      });
    } else {
      const codePartenaire = titleElements[0];
      const codeProduit = titleElements[1];
      typeFlux = titleElements[2];
      const dateTraitement = titleElements[3];
      await getPartenaireByCode(codePartenaire)
        .then(data => {
          this.setState({
            partenaire: data.data
          });
        })
        .catch(error => {
          this.setState({
            etatFlux: "rejeté",
            motifRejetFlux: "Partenaire n'existe pas : " + fileTitle
          });
        });
      //Produit traitement
      if (this.state.partenaire !== "") {
        await getRetraiteProduitByCode(codeProduit)
          .then(data => {
            this.setState({
              produit: data.data
            });
          })
          .catch(error => {
            this.setState({
              etatFlux: "rejeté",
              motifRejetFlux: "Produit n'existe pas : " + fileTitle
            });
          });
      }
      //Type flux
      this.setState({
        typeFlux: typeFlux
      });
      //dateTraitement
      if (this.state.produit !== "") {
        if (dateTraitement.length !== 8) {
          this.setState({
            etatFlux: "rejeté",
            motifRejetFlux: "La date est incorrect : " + fileTitle
          });
        } else {
          const day = dateTraitement.slice(0, 2);
          const month = dateTraitement.slice(2, 4);
          const year = dateTraitement.slice(4);
          const format = year + "-" + month + "-" + day;
          this.setState({
            dateTraitement: format
          });
        }
      }
    }
    if (this.state.etatFlux === "rejeté") {
      const index = this.state.acceptedFilesNamed.indexOf(fileTitle);
      this.getNumberOfLinesFile(this.state.filesContent[index]);
      this.removeFileFromTable(fileTitle + ".txt");
      this.setState({
        fluxRequestModel: {
          etat: this.state.etatFlux,
          typeFlux: {
            id: "1"
          },
          partenaireId: "",
          produitId: "",
          motifRejet: this.state.motifRejetFlux,
          nombreLigneTotal: parseFloat(this.state.totalNumberLines),
          nombreLigneInvalide: parseFloat(this.state.totalNumberLines),
          nombreLigneValide: 0,
          dateTraitement: this.state.dateTraitement,
          nom: fileTitle
        }
      });
      //API FLUX FOR REJECTED FILE --->
      await addFlux(this.state.fluxRequestModel);
    } else {
      const index = this.state.acceptedFilesNamed.indexOf(fileTitle);
      this.getNumberOfLinesFile(this.state.filesContent[index]);
      let splitedFileContent = this.state.filesContent[index]
        .trim()
        .split("\r\n");
      await this.readLines(splitedFileContent, typeFlux);
      this.setState({
        fluxRequestModel: {
          etat: this.state.etatFlux,
          partenaire: {
            id: this.state.partenaire.id
          },
          produit: {
            id: this.state.produit.id
          },
          motifRejet: this.state.motifRejetFlux,
          nombreLigneTotal: parseFloat(this.state.totalNumberLines),
          nombreLigneInvalide:
            parseFloat(this.state.totalNumberLines) - this.state.validLines,
          nombreLigneValide: this.state.validLines,
          typeFlux: {
            id: "1"
          },
          dateTraitement: this.state.dateTraitement,
          nom: fileTitle
        }
      });
      //API FLUX FOR ACCEPTED FILES --->
      await addFlux(this.state.fluxRequestModel);
    }
  };
  onChangeUpload = info => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      this.addFileToTable(info.file.name);
    } else if (info.file.status === "removed") {
      message.warn(`${info.file.name} file removed`);
      this.removeFileFromTable(info.file.name);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  beforeUpload = file => {
    const reader = new FileReader();
    reader.onload = e => {
      this.addContentToTable(e.target.result);
    };
    reader.readAsText(file);
  };

  sbmitForm = async () => {
    for (const title of this.state.acceptedFilesNamed) {
      this.setState({
        motifRejetFlux: "",
        totalNumberLines: 0,
        dateTraitement: "",
        etatFlux: "accepté",
        partenaire: "",
        produit: "",
        typeFlux: "",
        validLines: 0
      });
      await this.fileTitleWorker(title);
      if (this.state.etatFlux === "rejeté") {
        notification.error({
          message: "Takaful",
          description: this.state.motifRejetFlux
        });
      } else {
        notification.success({
          message: "Takaful",
          description: title + " est accepté"
        });
      }
    }

    setTimeout(() => {
      window.open("/echangefichiers", "_self");
    }, 3000);
  };

  render() {
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 14 }
      }
    };
    const props = {
      name: "file",
      stateProp: this.state,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text"
      }
    };
    return (
      <div>
        <Form {...formItemLayout}>
          <h3>Intégration Manuelle</h3>
          <Row>
            <Col span={12}>
              <Form.Item label="Choisissez un fichier">
                <Upload
                  {...props}
                  onChange={this.onChangeUpload}
                  beforeUpload={this.beforeUpload}
                  accept=".txt"
                >
                  <Button>
                    <Icon type="upload" /> Cliquez pour ajouter
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Button
                type="primary"
                className="multisteps-btn-next"
                form="stepfour"
                onClick={this.sbmitForm}
              >
                Insérer
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(IntegrationManuelle);
