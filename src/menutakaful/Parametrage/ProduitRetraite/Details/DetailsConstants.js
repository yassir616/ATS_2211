import React from "react";
export const formItemLayoutDetailsRetraiteProduit = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 12,
    },
  };
  export const initialState = {
    data: [],
    visible: false,
    searchText: "",
    searchedColumn: "",
    record: {},
    value: "",
    keyRecord: "",
    auxiliaire: [],
  };
  export const commissionsColumns = [
    {
      title: "Date Début",
      dataIndex: "dateDebut",
      key: "dateDebut",
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      key: "Date Fin",
    },
    {
      title: "Commission partenaire",
      dataIndex: "commissionPartenaire",
      key: "Commission partenaire",
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva",
    },
  ];
  export function typePrestationColumns(Tag) {
    return [
      {
        title: "Type prestation",
        dataIndex: "typePrestation.libelle",
        key: "typePrestation.libelle",
      },
      {
        title: "Pièces justificatives",
        key: "pieceJointe",
        dataIndex: "pieceJointe",
        render: (pieceJointe) => (
          <span>
            {pieceJointe.map((tag) => {
              let color = "geekblue";
              return <Tag color={color}>{tag.libelle}</Tag>;
            })}
          </span>
        ),
      },
    ];
  }