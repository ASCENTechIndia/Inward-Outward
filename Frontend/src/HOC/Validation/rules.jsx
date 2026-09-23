//rules.js
import * as Yup from "yup";
// import { useLanguage } from "../../Context/LanguageContext";

// Regular expressions for validations
const phoneRegExp = /^[6-9]\d{9}$/; // Indian mobile number validation
const nameRegExp = /^(?!.*\.\.)(?!.*\s\s)[a-zA-Z\u0900-\u097F\u00C0-\u024F\u1E00-\u1EFF .]+$/;
const time24hrRegExp = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Common field validations
export const getValidationRules = () => ({
  name: Yup.string()
    .matches(nameRegExp, ("Only letters allowed"))
    .required(("This field is required")),
  optionalName: Yup.string().matches(
    nameRegExp,
    ("Only letters allowed")
  ),
  phone: Yup.string()
    .matches(phoneRegExp, ("Invalid mobile number"))
    .required("Mobile Number is required"),
  chequeNo: Yup.string()
    .matches(/^[0-9]{6}$/, ("Cheque number must be 6 digits"))
    .required("Cheque number is required"),
  time: Yup.string()
    .matches(
      time24hrRegExp,
      (
        "Invalid format, please input time in 24hr format (e.g., 15:30)"
      )
    )
    .required(("Time is required")),
  date: Yup.string().required("Date is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .min(18, ("Must be at least 18 years old"))
    .required("Age is required")
    .max(120, "Age must be realistic"),
  address: Yup.string().required("Address is required"),
  amount: Yup.number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  aadharNo: Yup.string()
    .matches(/^[0-9]{12}$/, ("Aadhar number must be 12 digits"))
    .required("Aadhar Number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  image: Yup.mixed()
    .test("required-or-existing-url", "Image upload is required", (value) => {
      return value && (typeof value === "string" || value instanceof File);
    })
    .test("fileType", "Only PNG, JPG, or JPEG files are allowed", (value) => {
      if (typeof value === "string") return true; // already uploaded
      return (
        value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
      );
    })
    .test("fileSize", "File must be less than 5MB", (value) => {
      if (typeof value === "string") return true; // already uploaded
      return value && value.size <= 5 * 1024 * 1024;
    }),

  documentType: Yup.string().required("Document type is required")
    .required("File upload is required"),
  appNo: Yup.string().required("This field is required"),
  formNo: Yup.string()
    .matches(/^\d+$/, ("Only numbers allowed"))
    .required("This field is required"),
  selectedOption: Yup.string().required("This field is required"),
  radioOption: Yup.string().required("Please select an option"),
  oldPassword: Yup.string().required("Old password is required"),
  password: Yup.string()
    .min(8, ("Password must be at least 8 characters"))
    .matches(
      /[A-Z]/,
      ("Password must include at least one uppercase letter")
    )
    .matches(
      /[a-z]/,
      ("Password must include at least one lowercase letter")
    )
    .matches(/[0-9]/, ("Password must include at least one number"))
    .matches(
      /[!@#$%^&*]/,
      (
        "Password must include at least one special character (!@#$%^&*)"
      )
    )
    .required("Password is required"),

  //Confirm Password Rule (Must match 'password' field)
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], ("Passwords must match"))
    .required("Confirm Password is required"),
 
   
});
