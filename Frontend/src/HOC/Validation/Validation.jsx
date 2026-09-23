import * as Yup from "yup";
import { getValidationRules } from "./rules";

export const ValidationSchemas = () => {
  const validationRules = getValidationRules();

  return {
    FrmItemMaster: Yup.object({
      code: Yup.string().required("Item code is required"),
      name: Yup.string().required("Item name is required"),
      category: Yup.string().required("Category is required"),
      unit: Yup.string().required("Unit is requried"),
      type: Yup.string().required("Type is requried"),
      flag: Yup.string().required("Flag is required"),
      subCategory: Yup.string().required("Sub Category is required"),
      rate: Yup.string().required("Rate is required"),
    }),
  };
};
