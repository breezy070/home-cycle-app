
import { validationResult } from "express-validator";

export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(422).json({
    message: "Invalid request",
    errors: errors.array().map(e => ({
      field: e.param,
      message: e.msg,
      value: e.value,
      location: e.location,
    })),
  });
}
