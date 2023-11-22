import { Form, Input } from "antd";
import React from "react";

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

export function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return monthNames[monthIndex] + " " + year;
}

export function separateDigitsWithSpaces(number){
  let numStr = String(number);
  let [naturalPart, decimalPart] = numStr.split('.');
  naturalPart = naturalPart.split('').reverse().join('');
  let result = naturalPart.match(/\d{1,3}/g).join(' ');
  result = result.split('').reverse().join('');
  return (decimalPart ? result + '.' + decimalPart : result);
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return (
    date.getDate() +
    " " +
    monthNames[monthIndex] +
    " " +
    year +
    " - " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
}

export function formatDateToFormatOne(date) {
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatDateToFormatTwo(date) {
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

export const formItemLayoutResponsive = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 15 },
    lg: { span: 12 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 9 },
    lg: { span: 12 }
  }
};

export function formItemInputWithAddons(label, field, addons, fieldDecorater) {
  const field1 = field;
  return (
    <Form.Item label={<label style={{ whiteSpace: "normal" }}>{label}</label>}>
      {fieldDecorater(field1, {
        rules: [
          {
            required: true,
            pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
            message: "Format invalide!"
          }
        ]
      })(
        <Input addonAfter={addons} style={{ width: "80%", float: "right" }} />
      )}
    </Form.Item>
  );
}

export function formItemInputWithoutAddons(label, field, fieldDecorater) {
  const field1 = field;
  return (
    <Form.Item label={label}>
      {fieldDecorater(field1, {
        rules: [
          {
            required: true,
            message: "Champs obligatoire"
          }
        ]
      })(<Input />)}
    </Form.Item>
  );
}
export const currencyFormatter = value => {
  return new Intl.NumberFormat().format(value);
};

export const currencyParser = val => {
  try {
    // for when the input gets clears
    if (typeof val === "string" && !val.length) {
      val = "0.0";
    }

    // detecting and parsing between comma and dot
    var group = new Intl.NumberFormat().format(1111).replace(/1/g, "");
    var decimal = new Intl.NumberFormat().format(1.1).replace(/1/g, "");
    var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
    reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
    //  => 1232.21 €

    // removing everything except the digits and dot
    reversedVal = reversedVal.replace(/[^0-9.]/g, "");
    //  => 1232.21

    // appending digits properly
    const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
    const needsDigitsAppended = digitsAfterDecimalCount > 2;

    if (needsDigitsAppended) {
      reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  } catch (error) {
    console.error(error);
  }
};
