export function badRequestException({
  errMsg = "Bad request",
  cause = { statusCode: 400 },
} = {}) {
  throw new Error(errMsg, { cause });
}

export function notFoundException({
  errMsg = "Not found",
  cause = { statusCode: 404 },
} = {}) {
  throw new Error(errMsg, { cause });
}

export function unauthorizedException({
  errMsg = "Unauthorized",
  cause = { statusCode: 401 },
} = {}) {
  throw new Error(errMsg, { cause });
}

export function conflictExceptions({
  errmsg = "Conflict",
  cause = { statusCode: 409 },
} = {}) {
  throw new Error(errmsg, { cause });
}

export function forbiddenExceptions({
  errmsg = "Forbidden",
  cause = { statusCode: 403 },
} = {}) {
  throw new Error(errmsg, { cause });
}
