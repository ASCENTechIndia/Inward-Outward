const getByteLength = (str) =>
  new TextEncoder().encode(str).length;

export const inputHandlers = {
  
  name: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^[a-zA-Z\u0900-\u097F\u00C0-\u024F\u1E00-\u1EFF ]*$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },

  phone: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFieldValue(fieldName, value);
    }
  },
  ChequeNo:
    (maxLength = 6) =>
    (e, setFieldValue, fieldName) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && value.length <= maxLength) {
        setFieldValue(fieldName, value);
      }
    },

  MICRCode:
    (maxLength = 9) =>
    (e, setFieldValue, fieldName) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && value.length <= maxLength) {
        setFieldValue(fieldName, value);
      }
    },

  ChequeType:
    (maxLength = 2) =>
    (e, setFieldValue, fieldName) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && value.length <= maxLength) {
        setFieldValue(fieldName, value);
      }
    },

  code:
    (maxLength = 3) =>
    (e, setFieldValue, fieldName) => {
      const value = e.target.value;
      if (value.length <= maxLength) {
        setFieldValue(fieldName, value);
      }
    },
  integer: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^[\d.]*$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },
  payCode:
    (maxLength = 3) =>
    (e, setFieldValue, fieldName) => {
      const value = e.target.value;
      if (!/\d/.test(value) && value.length <= maxLength) {
        setFieldValue(fieldName, value);
      }
    },
  amount: (e, setFieldValue, fieldName) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }
    if (parts[1]?.length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }
    setFieldValue(fieldName, value);
  },
  aadhaar: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setFieldValue(fieldName, value);
    }
  },
   noSpecialChar: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, "");
    setFieldValue(fieldName, cleaned);
  },

  email: (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    // Only allow valid email characters while typing
    if (/^[a-zA-Z0-9@._-]*$/.test(value)) {
      setFieldValue(fieldName, value);
    }
    // You can later validate format strictly in Yup schema or final validation
  },

 diagnosisDesc : (maxLength = 100) =>
  (e, setFieldValue, fieldName) => {
    const value = e.target.value;

    // Only enforce byte length
    if (getByteLength(value) <= maxLength) {
      setFieldValue(fieldName, value);
    }
  },
};
