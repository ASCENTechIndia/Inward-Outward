export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    req[source] = result.data;
    next();
  };
