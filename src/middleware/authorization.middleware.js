import { forbiddenExceptions } from "../commen/exceptions/exceptions.js";

export function authorization(role) {
  return (req, res, next) => {
    if (req.user.role < role) throw forbiddenExceptions();
    next();
  };
}
