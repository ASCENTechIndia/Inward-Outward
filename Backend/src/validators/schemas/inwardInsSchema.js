import { z } from "zod";

export const aoioInwardInsSchema = z.object({
  IN_USERID: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_inwarddate: z
    .string({
      required_error: "Inward date is required",
      invalid_type_error: "Inward date must be a string",
    })
    .trim()
    .min(1, "Inward date is required"),

  in_refdate: z
    .string({
      invalid_type_error: "Reference date must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .nullable(),

  IN_senderid: z
    .number({
      required_error: "Sender is required",
      invalid_type_error: "Sender must be a number",
    })
    .int("Sender must be an integer"),

  IN_sendersubtypeid: z
    .number({
      required_error: "Sender subtype is required",
      invalid_type_error: "Sender subtype must be a number",
    })
    .int("Sender subtype must be an integer"),

  IN_doctype: z
    .number({
      required_error: "Document type is required",
      invalid_type_error: "Document type must be a number",
    })
    .int("Document type must be an integer"),

  IN_docsubtype: z
    .number({
      required_error: "Document subtype is required",
      invalid_type_error: "Document subtype must be a number",
    })
    .int("Document subtype must be an integer"),

  IN_inwmodeid: z
    .number({
      required_error: "Inward mode is required",
      invalid_type_error: "Inward mode must be a number",
    })
    .int("Inward mode must be an integer"),

  IN_lettertype: z
    .string({
      required_error: "Letter type is required",
      invalid_type_error: "Letter type must be a string",
    })
    .trim()
    .min(1, "Letter type is required"),

  IN_refno: z
    .string({
      invalid_type_error: "Reference no. must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .nullable(),

  IN_from: z
    .string({
      invalid_type_error: "From must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .nullable(),

  IN_address: z
    .string({
      invalid_type_error: "Address must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .nullable(),

  IN_mobile: z
    .number({ invalid_type_error: "Mobile must be a number" })
    .int("Mobile must be an integer")
    .nullable()
    .optional(),

  IN_subject: z
    .string({
      required_error: "Subject is required",
      invalid_type_error: "Subject must be a string",
    })
    .trim()
    .min(1, "Subject is required"),

  in_AppliName: z
    .string({
      required_error: "Applicant name is required",
      invalid_type_error: "Applicant name must be a string",
    })
    .trim()
    .min(1, "Applicant name is required"),

  IN_attachment: z
    .string({
      invalid_type_error: "Attachment must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .nullable(),

  in_email: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .nullable(),

  IN_strinwardto: z
    .string({
      invalid_type_error: "Inward-to string must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .default(""),

  IN_strinwardimg: z
    .string({
      invalid_type_error: "Inward image string must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .default(""),

  IN_strinwordcc: z
    .string({
      invalid_type_error: "Inward CC string must be a string",
    })
    .trim()
    .optional()
    .or(z.literal(""))
    .default(""),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_OrgId: z
    .number({
      required_error: "Org Id is required",
      invalid_type_error: "Org Id must be a number",
    })
    .int("Org Id must be an integer"),

  in_sourceid: z
    .number({
      invalid_type_error: "Source Id must be a number",
    })
    .int("Source Id must be an integer")
    .optional()
    .default(0),

  in_Priority: z
    .string({
      invalid_type_error: "Priority must be a string",
    })
    .trim()
    .nullable()
    .optional(),
});

export const inwardDocUpdtSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_inwardimgid: z
    .string({
      required_error: "Inward image id is required",
      invalid_type_error: "Inward image id must be a string",
    })
    .trim()
    .min(1, "Inward image id is required"),

  in_inwardid: z
    .string({
      required_error: "Inward id is required",
      invalid_type_error: "Inward id must be a string",
    })
    .trim()
    .min(1, "Inward id is required"),

  in_inwardno: z
    .string({
      required_error: "Inward no. is required",
      invalid_type_error: "Inward no. must be a string",
    })
    .trim()
    .min(1, "Inward no. is required"),

  in_DocStr: z
    .string({
      required_error: "Document string is required",
      invalid_type_error: "Document string must be a string",
    })
    .trim()
    .min(1, "Document string is required"),

  in_orgId: z
    .number({
      required_error: "Org Id is required",
      invalid_type_error: "Org Id must be a number",
    })
    .int("Org Id must be an integer"),
});

export const updateInwardDocumentBlobsSchema = z.object({
  inwardId: z
    .string({
      required_error: "Inward Id is required",
      invalid_type_error: "Inward Id must be a string",
    })
    .trim()
    .min(1, "Inward Id is required"),

  inwardNo: z
    .string({
      required_error: "Inward No is required",
      invalid_type_error: "Inward No must be a string",
    })
    .trim()
    .min(1, "Inward No is required"),

  documents: z
    .array(
      z.object({
        serialNo: z
          .string({
            required_error: "Serial No is required",
            invalid_type_error: "Serial No must be a string",
          })
          .trim()
          .min(1, "Serial No is required"),

        documentName: z
          .string({
            required_error: "Document name is required",
            invalid_type_error: "Document name must be a string",
          })
          .trim()
          .min(1, "Document name is required"),

        fileBytes: z
          .string({
            required_error: "File bytes are required",
            invalid_type_error: "File bytes must be a Base64 string",
          })
          .min(1, "File bytes are required"),
      }),
    )
    .min(1, "At least one document is required"),
});
