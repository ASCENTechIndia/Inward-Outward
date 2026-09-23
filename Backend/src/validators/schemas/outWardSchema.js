import { z } from "zod";

export const outwardInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_date: z
    .string({
      required_error: "Date is required",
      invalid_type_error: "Date must be a string",
    })
    .trim()
    .min(1, "Date is required"),

  in_receivercatid: z
    .number({
      required_error: "Receiver category is required",
      invalid_type_error: "Receiver category must be a number",
    })
    .int("Receiver category must be an integer"),

  in_receiversubcatid: z
    .number({
      required_error: "Receiver sub category is required",
      invalid_type_error: "Receiver sub category must be a number",
    })
    .int("Receiver sub category must be an integer"),

  in_doctype: z
    .number({
      required_error: "Document type is required",
      invalid_type_error: "Document type must be a number",
    })
    .int("Document type must be an integer"),

  in_docsubtype: z
    .number({
      required_error: "Document sub type is required",
      invalid_type_error: "Document sub type must be a number",
    })
    .int("Document sub type must be an integer"),

  in_inwrefno: z
    .string({
      required_error: "Inward reference no. is required",
      invalid_type_error: "Inward reference no. must be a string",
    })
    .trim()
    .min(1, "Inward reference no. is required"),

  in_refdate: z
    .string({
      invalid_type_error: "Reference date must be a string",
    })
    .trim()
    .optional()
    .default(""),

  in_receivername: z
    .string({
      required_error: "Receiver name is required",
      invalid_type_error: "Receiver name must be a string",
    })
    .trim()
    .min(1, "Receiver name is required"),

  in_address: z
    .string({
      invalid_type_error: "Address must be a string",
    })
    .trim()
    .optional()
    .default(""),

  in_subject: z
    .string({
      required_error: "Subject is required",
      invalid_type_error: "Subject must be a string",
    })
    .trim()
    .min(1, "Subject is required"),

  in_outmodeid: z
    .number({
      required_error: "Outward type is required",
      invalid_type_error: "Outward type must be a number",
    })
    .int("Outward type must be an integer"),

  in_remark: z
    .string({
      invalid_type_error: "Remark must be a string",
    })
    .trim()
    .optional()
    .default(""),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_OutwardNo: z
    .string({
      required_error: "Outward no. is required",
      invalid_type_error: "Outward no. must be a string",
    })
    .trim()
    .min(1, "Outward no. is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_Deptid: z
    .number({
      required_error: "Department is required",
      invalid_type_error: "Department must be a number",
    })
    .int("Department must be an integer"),

  in_orgId: z
    .number({
      required_error: "Org Id is required",
      invalid_type_error: "Org Id must be a number",
    })
    .int("Org Id must be an integer"),

  IN_stroutwordcc: z
    .string({
      invalid_type_error: "CC string must be a string",
    })
    .trim()
    .optional()
    .default(""),

  in_mobile: z
    .number({ invalid_type_error: "Mobile must be a number" })
    .int("Mobile must be an integer")
    .nullable()
    .optional(),

  in_email: z
    .string({ invalid_type_error: "Email must be a string" })
    .trim()
    .nullable()
    .optional(),

  in_sendingtype: z
    .number({ invalid_type_error: "Sending type must be a number" })
    .int("Sending type must be an integer")
    .nullable()
    .optional(),

  in_typeflag: z
    .string({ invalid_type_error: "Type flag must be a string" })
    .trim()
    .nullable()
    .optional(),
});
