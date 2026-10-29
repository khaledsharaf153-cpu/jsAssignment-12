import {
  getUserRevokeTokenKey,
  isExists,
} from "../commen/cache/cache.service.js";
import { tokenTypeEnum } from "../commen/enum/token.enum.js";
import { unauthorizedException } from "../commen/exceptions/exceptions.js";
import { checkToken } from "../commen/security/tokens.js";

export function auth(tokenType = tokenTypeEnum.ACCESS) {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      throw unauthorizedException();
    }

    const { user, payload } = await checkToken(token.split(" ")[1], tokenType);

    if (await isExists(getUserRevokeTokenKey(payload))) {
      throw unauthorizedException({ errMsg: "You need to login" });
    }

    if (payload.iat < user.changeCredentialTime / 1000) {
      // Date => num
      throw unauthorizedException({ errMsg: "You need to login" });
    }

    req.user = user;
    req.payload = payload;
    next();
  };
}
