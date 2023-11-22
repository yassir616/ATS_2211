/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  DatePicker,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Table,
  Tag,
  Icon,
  Divider
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import { MEDECIN_CONSEIL } from "../../../../../constants/index";
import { ajoutHonoraire, getHonoraire } from "../../../../Parametrage/Honoraires/HonorairesAPI";
import {
  getAcceptationTestByAcceptationsConseil,
  updateAcceptationTestMedical,
  getAcceptationConseilByAcceptation,
  lettreAcceptation,
  lettreRejet,
  lettreAcceptationAvecSurprime,
  lettreExamenComplementaire,
  lettreRenonciation
} from "../../AcceptationsAPI";
const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "Medecin") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.medecins.map(element => {
            return (
              <Option key={element.id} value={element.id} label={element.nom}>
                {element.nom}
              </Option>
            );
          })}
        </Select>
      );
    } else if (this.props.inputType === "Verdict") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          {this.props.verdicts.map(element => {
            return (
              <Option
                key={element.id}
                value={element.id}
                label={element.status}
              >
                {element.status}
              </Option>
            );
          })}
        </Select>
      );
    } else if (this.props.inputType === "Date Expertise") {
      return <DatePicker className="date-style"></DatePicker>;
    } 
    else if (this.props.inputType === "Tests Medical") {
      let array = [];
      this.props.produit.normes.forEach(norme => {
        norme.honoraires.forEach(honoraire => {
          if (honoraire.typeAuxiliaireHon.libelle === "MEDECIN CONSEIL") {
            array.push({ value: honoraire.id, label: honoraire.libelle });
          }
        });
      });
      return (
        <Select mode="multiple" style={{ width: "100%" }} labelInValue>
          {array.map(element => {
            return (
              <Option
                key={element.id}
                value={element.value}
                label={element.label}
              >
                {element.label}
              </Option>
            );
          })}
        </Select>
      );
    } 
    else if (this.props.inputType === "Examen complementaire") {
      return (
        <Select mode="multiple" style={{ width: "100%" }} labelInValue>
          {this.props.ListExamenComplementaire.map(element => {
            return (
              <Option
                key={element.id}
                value={element.value}
                label={element.label}
              >
                {element.label}
              </Option>
            );
          })}
        </Select>
      );    } 
    else if (
      this.props.inputType === "Observations" ||
      this.props.inputType === "Observation verdict"
    ) {
      return <TextArea rows={2} />;
    }
    return <Input></Input>;
  };
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      testsMedical,ListExamenComplementaire,
      children,
      ...restProps
    } = this.props;

    if (editing && title === "Tests Medical") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("honoraires", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: testsMedical
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } 
    else if (editing && title === "Examen complementaire") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("examen_complementaire", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: ListExamenComplementaire.value
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } 
    else if (editing && title === "Observations") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("observation", {
              rules: [
                {
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex].observation
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Motif") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("motif", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex].motif
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Observation verdict") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("observationsVerdict", {
              rules: [
                {
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex].observationsVerdict
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Medecin") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("medecin", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: {
                key: record[dataIndex].medecin.id,
                label: record[dataIndex].medecin.nom
              }
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Verdict") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("verdict", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: {
                key: record[dataIndex].verdict.id,
                label: record[dataIndex].verdict.status
              }
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Date Expertise") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("dateExpertise", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: moment(record[dataIndex].dateExpertise)
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Taux de surprime") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("tauxSurprime", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex].tauxSurprime
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else if (editing && title === "Taux de surmoralité") {
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator("tauxSurmoralite", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex].tauxSurmoralite
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else return <td {...restProps}>{children}</td>;
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: "",
      testsMedical: [],
      listOnglets: [],
      ListExamenComplementaire: [],
      verdic: ""
    };
    this.columns = [
      {
        title: "Medecin",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.medecin.nom}</span>
      },
      {
        title: "Date Expertise",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.dateExpertise}</span>
        )
      },
      {
        title: "Observations",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.observation}</span>
      },
      {
        title: "Tests Medical",
        dataIndex: "honoraires",
        editable: true,
        render: honoraires => (
          <span>
            {honoraires.map(tag => {
              let color = "volcano";
              return (
                <Tag color={color} key={tag}>
                  {tag.libelle.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      
      {
        title: "Verdict",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.verdict.status}</span>
        )
      }, 
      {
        title: "Examen complementaire",
        dataIndex: "acceptationConseil.examen_complementaire",
        editable: true,
        render: examens_complementaire => (
          <span>
            {examens_complementaire.map(tag => {
              let color = "volcano";
              return (
                <Tag color={color}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Taux de surprime",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => <span>{acceptationsLabo.tauxSurprime}</span>
      },
      {
        title: "Taux de surmoralité",
        dataIndex: "acceptationConseil",
        editable: true,
        render: acceptationsLabo => (
          <span>{acceptationsLabo.tauxSurmoralite}</span>
        )
      },
      {
        title: "Operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Confirmer
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="êtes-vous certain de vouloir annuler?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a href="#top">Annuler</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a
                disabled={editingKey !== ""}
                onClick={() => this.edit(record.key)}
              >
                <Icon
                  type="edit"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </a>
              <Divider type="vertical" />
              <a
                disabled={this.state.verdic !== "Acceptation au tarif normal"}
                onClick={() => this.download()}
                href="#top"
              >
                <Icon
                  type="download"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </a>
            </span>
          );
        }
      }
    ];
  }
  isEditing = record => record.key === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: "" });
  };

  async listHonoraire() {
    let response = await getHonoraire();
    let ExamencomplementaireArray = [];
    if (response.data.content != undefined) {
          response.data.content.forEach(element => {
            ExamencomplementaireArray.push({
              key: element.id,
              value: element.id,
              label: element.libelle
            });
        });
        this.setState({ ListExamenComplementaire : ExamencomplementaireArray});
    }
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({ verdic: row.verdict.label });
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        row.test = row.test;
        row.dateExpertise = row.dateExpertise.format("DD-MM-YYYY");
        row.medecin = { id: row.medecin.key, nom: row.medecin.label };
        row.verdict = { id: row.verdict.key, status: row.verdict.label };
        row.tauxSurmoralite = parseFloat(row.tauxSurmoralite);
        row.tauxSurprime = parseFloat(row.tauxSurprime);
        let myRow = {
          acceptationConseil: { ...item.acceptationConseil, ...row }
          // honoraires: honoraire
        };
        newData.splice(index, 1, {
          ...item,
          ...myRow
        });


        this.updateTestMedical(item.id, { ...item, ...myRow });

        this.setState({ editingKey: "" });
        // this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }
  async jasperLettreAcceptation(requestLettre) {
    let response = await lettreAcceptation(requestLettre);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async jasperLettreRejet(requestLettreRejet) {
    let response = await lettreRejet(requestLettreRejet);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  async jasperLettreRenonciation(requestLettreRenonciation) {
    let response = await lettreRenonciation(requestLettreRenonciation);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  async jasperLettreAcceptationAvecSurprime(requestLettreSurprime) {
    let response = await lettreAcceptationAvecSurprime(requestLettreSurprime);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async jasperExamenComplementaire(requestExamen) {
    let response = await lettreExamenComplementaire(requestExamen);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  updateTestMedical = (id, Data) => {

    // Convert (examens_complementaire) type list to (ExamencomplementaireArray) type string
    let ExamencomplementaireArray = [];
    Data.acceptationConseil.examen_complementaire.forEach(element => {
      ExamencomplementaireArray.push(element.label);
    });
    Data.acceptationConseil.examen_complementaire=ExamencomplementaireArray.toString();
    
    let montantSurprime =
      (this.props.record.contrat.montantCotisation *
        Data.acceptationConseil.tauxSurprime) /
      100;
    let surprimeHT =
      montantSurprime + this.props.record.contrat.montantCotisation;
    let surprimeTaxe = (surprimeHT * 10) / 100;
    let surprimeTTC = surprimeTaxe + surprimeHT;
    console.log("montantSurprime:", montantSurprime);
    console.log("surprimeHT:", surprimeHT);
    console.log("surprimetaxe:", surprimeTaxe);
    console.log("surprimettc:", surprimeTTC);

    updateAcceptationTestMedical(id, Data)
      .then(response => {
        if (response.status === 200) {
          console.log("----------------------------------");
          console.log(Data);
          notification.success({
            message: "acceptation Medecin conseil bien modifier !"
          });
          let requestAcceptation = {
            intermediaire: this.props.record.contrat.produit.partenaire
              .raisonSocial,
            nom:
              this.props.record.contrat.assure.nom +
              " " +
              this.props.record.contrat.assure.prenom,
            agence: this.props.record.contrat.pointVente.libelle,
            numeroAcceptation: this.props.record.code,
            montantMourabaha: this.props.record.contrat.capitalAssure.toFixed(
              2
            ),
            encours: this.props.record.encours.toFixed(2),
            cumul: this.props.record.cumul.toFixed(2),
            duree: this.props.record.contrat.dureeContrat,
            differe: this.props.record.contrat.differe,
            montantCotisation: this.props.record.contrat.montantCotisation.toFixed(
              2
            )
          };
          let requestRejet = {
            intermediaire: this.props.record.contrat.produit.partenaire
              .raisonSocial,
            nomParticipant:
              this.props.record.contrat.assure.nom +
              " " +
              this.props.record.contrat.assure.prenom,
            agence: this.props.record.contrat.pointVente.libelle,
            numeroAcceptation: this.props.record.code,
            montantFinancement: this.props.record.contrat.capitalAssure,
            encours: this.props.record.encours,
            cumul: this.props.record.cumul,
            duree: this.props.record.contrat.dureeContrat,
            differe: this.props.record.contrat.differe,
            date: moment().format("DD-MM-YYYY")
          };
          let requestRenonciation = {
            nomParticipant:
              this.props.record.contrat.assure.nom +
              " " +
              this.props.record.contrat.assure.prenom,
            motif: Data.acceptationConseil.observationsVerdict,
            adresse: this.props.record.contrat.assure.adressComplete,
            cin: this.props.record.contrat.assure.cin
          };
          let requestsurprime = {
            nomPrenom:
              this.props.record.contrat.assure.nom +
              " " +
              this.props.record.contrat.assure.prenom,
            intermediaire: this.props.record.contrat.produit.partenaire
              .raisonSocial,
            agence: this.props.record.contrat.pointVente.libelle,
            numeroAcceptation: this.props.record.code,
            montantFinancement: this.props.record.contrat.capitalAssure,
            encours: this.props.record.encours,
            cumul: this.props.record.cumul,
            duree: this.props.record.contrat.dureeContrat,
            differe: this.props.record.contrat.differe,
            tauxSurprime: Data.acceptationConseil.tauxSurprime,
            surprimeTTC: surprimeTTC
          };
          let requestExamen = {
            intermediaire: this.props.record.contrat.produit.partenaire
              .raisonSocial,
            nomParticipant:
              this.props.record.contrat.assure.nom +
              " " +
              this.props.record.contrat.assure.prenom,
            agence: this.props.record.contrat.pointVente.libelle,
            numeroAcceptation: this.props.record.code,
            montantFinancement: this.props.record.contrat.capitalAssure,
            encours: this.props.record.encours,
            cumul: this.props.record.cumul,
            duree: this.props.record.contrat.dureeContrat,
            differe: this.props.record.contrat.differe,
            date: moment().format("DD-MM-YYYY"),
            examinateurId: this.props.record.contrat.orientation,
            typeExamen: Data.acceptationConseil.test
          };
          if (
            Data.acceptationConseil.verdict.status ===
            "Acceptation au tarif normal"
          ) {
            this.jasperLettreAcceptation(requestAcceptation);
          } else if (Data.acceptationConseil.verdict.status === "Rejet") {
            this.jasperLettreRejet(requestRejet);
          } else if (
            Data.acceptationConseil.verdict.status ===
            "Acceptation avec rénonciation"
          ) {
            this.jasperLettreRenonciation(requestRenonciation);
          } else if (
            Data.acceptationConseil.verdict.status ===
            "Acceptation avec surprime"
          ) {
            this.jasperLettreAcceptationAvecSurprime(requestsurprime);
          } else if (
            Data.acceptationConseil.verdict.status === "Examen complementaire"
          ) {
            this.jasperExamenComplementaire(requestExamen);
          }
        }
        this.acceptationsConseil(this.props.record.id);
      })
      .catch(error => {
        if (error.response.data.message === "wrong data") {
          notification.error({
            message: "acception Medecin conseil ne ce trouve pas"
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              "Désolé! Quelque chose a mal tourné. Veuillez réessayer!"
          });
        }
      });
  };
  edit(key) {
    this.setState({ editingKey: key });
    this.listHonoraire();

    const newData = [...this.state.data];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      let tests = [];
      // Convert FormatDate (dateExpertise)
      item.acceptationConseil.dateExpertise = moment(item.acceptationConseil.dateExpertise,'DD-MM-YYYY').format( "YYYY-MM-DD");

      item.honoraires.forEach(element => {
        tests.push({
          key: element.id,
          value: element.id,
          label: element.libelle
        });
      });
      this.setState({ testsMedical: [...tests] });
      this.setState({ data: [...this.state.data] });

    }
  }
  download() {
    let requestAcceptation = {
      intermediaire: this.props.record.contrat.produit.partenaire.raisonSocial,
      nom:
        this.props.record.contrat.assure.nom +
        " " +
        this.props.record.contrat.assure.prenom,
      agence: this.props.record.contrat.pointVente.libelle,
      numeroAcceptation: this.props.record.code,
      montantMourabaha: this.props.record.contrat.capitalAssure,
      encours: this.props.record.encours,
      cumul: this.props.record.cumul,
      duree: this.props.record.contrat.dureeContrat,
      differe: this.props.record.contrat.differe,
      montantCotisation: (
        this.props.record.contrat.montantCotisation +
        this.props.record.contrat.montantTaxe
      ).toFixed(2)
    };
    this.jasperLettreAcceptation(requestAcceptation);
  }
  async acceptationsConseil(id) {
    let Response = await getAcceptationConseilByAcceptation(id);

    let newDataList = [];
    for (const element of Response.data) {
      let responseAcc = await getAcceptationTestByAcceptationsConseil(
        id,
        element.id
      );
      let list = [...this.state.listOnglets];
      if (
        responseAcc.data.acceptationConseil.verdict.status ===
        "Examen complementaire"
      ) {
        list.push(
          {
            key: "examens",
            tab: "Examens Complémentaire"
          },
          {
            key: "specialiste",
            tab: "Specialiste"
          }
        );
        this.setState({ listOnglets: [...list] });
        this.props.onglet(this.state.listOnglets);
      }
      let key = { key: responseAcc.data.id };
      let elementone = { ...responseAcc.data, ...key };

      // Convert (examens_complementaire) type string to (examens_complementaire_list) type list
      let examens_complementaire_list = [];     
      if(elementone.acceptationConseil.examen_complementaire != null){
        elementone.acceptationConseil.examen_complementaire.split(',').forEach(element => {
          examens_complementaire_list.push(element);
        });
      }   
     
      elementone.acceptationConseil.examen_complementaire=examens_complementaire_list;

      newDataList.push(elementone);
    }

    this.setState({ data: [...newDataList] });


    if (newDataList.length !== 0) {
      this.setState({
        verdic: newDataList[0].acceptationConseil.verdict.status
      });
    }
  }

  componentDidMount() {
    this.acceptationsConseil(this.props.record.id);
    console.log("props conseil:", this.props);
  }
  componentDidUpdate(prevProps, _) {

    if (this.props.dataTable !== prevProps.dataTable) {
      let list = [...this.state.data];
      list.push(this.props.dataTable);
      this.setState({ data: [...list] });
    }
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      } else
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.title,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
            medecins: this.props.medecins,
            produit: this.props.record.contrat.produit,
            testsMedical: this.state.testsMedical,
            verdicts: this.props.verdicts,
            ListExamenComplementaire: this.state.ListExamenComplementaire,
          })
        };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 50
          }}
        />
      </EditableContext.Provider>
    );
  }
}
const MedecinConseilTable = Form.create()(EditableTable);
export default MedecinConseilTable;
