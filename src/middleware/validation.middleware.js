import { badRequestException } from "../commen/exceptions/exceptions.js";

export function validationMiddleware(schema) {
  return (req, res, next) => {
    const validatedData = schema.safeParse({
      body: req.body,
    });
    if (!validatedData.success) {
      throw badRequestException({
        cause: { statusCode: 400, issues: validatedData.error.issues },
      });
    }

    req.validatedData = validatedData.data;

    next();
  };
}
