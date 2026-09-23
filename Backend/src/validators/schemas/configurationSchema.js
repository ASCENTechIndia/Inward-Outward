import { z } from "zod";

export const senderSubTypeConfigSchema = z.object({
  In_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  ulbId: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_sendersubtypestr: z
    .string({
      required_error: "Sender subtype string is required",
      invalid_type_error: "Sender subtype string must be a string",
    })
    .trim()
    .min(1, "Sender subtype string is required"),

  in_mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

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

export const senderTypeConfigSchema = z.object({
  In_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  ulbId: z
    .number({
      required_error: "Ulb Id is required",
      invalid_type_error: "Ulb Id must be a number",
    })
    .int("Ulb Id must be an integer"),

  in_sendertypestr: z
    .string({
      required_error: "Sender type string is required",
      invalid_type_error: "Sender type string must be a string",
    })
    .trim()
    .min(1, "Sender type string is required"),

  in_mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

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

export const userConfigSchema = z.object({
  In_UserId: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "UserId must be a string",
    })
    .trim()
    .min(1, "UserId is required"),

  ulbId: z
    .number({
      required_error: "ULB Id is required",
      invalid_type_error: "ULB Id must be a number",
    })
    .int("ULB Id must be an integer"),

  In_UserConfigId: z
    .string({
      required_error: "UserConfigId is required",
      invalid_type_error: "UserConfigId must be a string",
    })
    .trim()
    .min(1, "UserConfigId is required"),

  in_UserConfstr: z
    .string({
      required_error: "User config string is required",
      invalid_type_error: "User config string must be a string",
    })
    .trim()
    .min(1, "User config string is required"),

  in_mode: z
    .number({
      required_error: "Mode is required",
      invalid_type_error: "Mode must be a number",
    })
    .int("Mode must be an integer"),

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
