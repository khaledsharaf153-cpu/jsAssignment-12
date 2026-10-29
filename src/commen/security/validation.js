import * as z from "zod";
import { userGenderEnum } from "../enum/user.enum.js";

export const validateFields = {
  username: z.string().regex(/^[A-Z][a-z]{1,24}\s[A-Z][a-z]{1,24}$/),
  email: z.email(),
  password: z.string(),
  confirmPassword: z.string(),
  phoneNumber: z.e164().optional(),
  gender: z.literal(Object.values(userGenderEnum)).optional(),
  DOB: z.date().optional(),
  otp: z.string().regex(/^\d{6}$/),
};
