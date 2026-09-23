import { z } from "zod";

export const senderInsSchema = z.object({
  in_UserId: z
    .string({ required_error: "UserId is required" })
    .trim()
    .min(1, "UserId is required"),

  in_Mode: z
    .number({ invalid_type_error: "Mode must be a number" })
    .int("Mode must be an integer"),

  in_SenderId: z
    .number({ invalid_type_error: "SenderId must be a number" })
    .int("SenderId must be an integer")
    .nullable()
    .optional(),

  in_SenderName: z
    .string({ required_error: "Sender name is required" })
    .trim()
    .min(1, "Sender name is required"),

  in_UlbId: z
    .number({ invalid_type_error: "UlbId must be a number" })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({ required_error: "IP address is required" })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({ required_error: "Source is required" })
    .trim()
    .min(1, "Source is required"),
});

export const senderSubtypeInsSchema = z.object({
  in_UserId: z
    .string({ required_error: "UserId is required" })
    .trim()
    .min(1, "UserId is required"),

  in_Mode: z
    .number({ invalid_type_error: "Mode must be a number" })
    .int("Mode must be an integer"),

  in_SendersubtypeId: z
    .number({ invalid_type_error: "Subtype Id must be a number" })
    .int("Subtype Id must be an integer")
    .nullable()
    .optional(),

  in_Sstsenderid: z
    .number({ invalid_type_error: "Sender Id must be a number" })
    .int("Sender Id must be an integer"),

  in_SendersubtypeName: z
    .string({ required_error: "Sub sender name is required" })
    .trim()
    .min(1, "Sub sender name is required"),

  in_SendersubtypeFlag: z.enum(["Y", "N"], {
    errorMap: () => ({ message: "Flag must be Y or N" }),
  }),

  in_UlbId: z
    .number({ invalid_type_error: "UlbId must be a number" })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({ required_error: "IP address is required" })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({ required_error: "Source is required" })
    .trim()
    .min(1, "Source is required"),
});

export const purposeInsSchema = z.object({
  in_user_id: z
    .string({ required_error: "UserId is required" })
    .trim()
    .min(1, "UserId is required"),

  in_mode: z
    .number({ invalid_type_error: "Mode must be a number" })
    .int("Mode must be an integer"),

  in_purpose_id: z
    .number({ invalid_type_error: "Purpose Id must be a number" })
    .int("Purpose Id must be an integer")
    .nullable()
    .optional(),

  in_purpose_name: z
    .string({ required_error: "Purpose name is required" })
    .trim()
    .min(1, "Purpose name is required"),

  in_ulbid: z
    .number({
      invalid_type_error: "UlbId must be a number",
    })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({ required_error: "IP address is required" })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({ required_error: "Source is required" })
    .trim()
    .min(1, "Source is required"),
});

export const docTypeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_DoctypeId: z
    .number({ invalid_type_error: "DocType Id must be a number" })
    .int("DocType Id must be an integer")
    .nullable()
    .optional(),

  in_DoctypeName: z
    .string({
      required_error: "DocType name is required",
      invalid_type_error: "DocType name must be a string",
    })
    .trim()
    .min(1, "DocType name is required"),

  in_UlbId: z
    .number({
      required_error: "UlbId is required",
      invalid_type_error: "UlbId must be a number",
    })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({
      required_error: "Source is required",
      invalid_type_error: "Source must be a string",
    })
    .trim()
    .min(1, "Source is required"),
});

export const inwardModeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_inwardmodeId: z
    .number({ invalid_type_error: "Inward Mode Id must be a number" })
    .int("Inward Mode Id must be an integer")
    .nullable()
    .optional(),

  in_inwardmodeName: z
    .string({
      required_error: "Inward Mode name is required",
      invalid_type_error: "Inward Mode name must be a string",
    })
    .trim()
    .min(1, "Inward Mode name is required"),

  in_UlbId: z
    .number({
      required_error: "UlbId is required",
      invalid_type_error: "UlbId must be a number",
    })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({
      required_error: "Source is required",
      invalid_type_error: "Source must be a string",
    })
    .trim()
    .min(1, "Source is required"),
});

export const outwardModeInsSchema = z.object({
  in_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_Mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_outwardmodeId: z
    .number({ invalid_type_error: "Outward Mode Id must be a number" })
    .int("Outward Mode Id must be an integer")
    .nullable()
    .optional(),

  in_outwardmodeName: z
    .string({
      required_error: "Outward Mode name is required",
      invalid_type_error: "Outward Mode name must be a string",
    })
    .trim()
    .min(1, "Outward Mode name is required"),

  in_UlbId: z
    .number({
      required_error: "UlbId is required",
      invalid_type_error: "UlbId must be a number",
    })
    .int("UlbId must be an integer"),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({
      required_error: "Source is required",
      invalid_type_error: "Source must be a string",
    })
    .trim()
    .min(1, "Source is required"),
});

export const receiverSubCatInsSchema = z.object({
  in_user_id: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  in_mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

  in_reccatid: z
    .number({
      required_error: "Receiver Category Id is required",
      invalid_type_error: "Receiver Category Id must be a number",
    })
    .int("Receiver Category Id must be an integer"),

  in_subreccatid: z
    .number({ invalid_type_error: "Sub Category Id must be a number" })
    .int("Sub Category Id must be an integer")
    .nullable()
    .optional(),

  in_subreccatname: z
    .string({
      required_error: "Sub Category name is required",
      invalid_type_error: "Sub Category name must be a string",
    })
    .trim()
    .min(1, "Sub Category name is required"),

  in_ipaddress: z
    .string({
      required_error: "IP address is required",
      invalid_type_error: "IP address must be a string",
    })
    .trim()
    .min(1, "IP address is required"),

  in_source: z
    .string({
      required_error: "Source is required",
      invalid_type_error: "Source must be a string",
    })
    .trim()
    .min(1, "Source is required"),
});
