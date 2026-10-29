import * as z from "zod";
import { validateFields } from "../../commen/security/validation.js";

export const loginSchema = z.object({
  body: z.object({
    email: validateFields.email,
    password: validateFields.password,
  }),
});

export const signupSchema = z
  .object({
    body: z.object({
      username: validateFields.username,
      email: validateFields.email,
      password: validateFields.password,
      confirmPassword: validateFields.confirmPassword,
      phoneNumber: validateFields.phoneNumber,
      gender: validateFields.gender,
      DOB: validateFields.DOB,
    }),
  })
  .superRefine((v, ctx) => {
    if (v.body.password !== v.body.confirmPassword) {
      ctx.addIssue({
        code: z.custom,
        path: ["password", "confirmPassword"],
        message: "Confirm password doesn't match password",
      });
    }
  });

export const confirmEmailSchema = z.object({
  body: z.object({
    email: validateFields.email,
    otp: validateFields.otp,
  }),
});

export const resendOTPSchema = z.object({
  body: z.object({
    email: validateFields.email,
  }),
});

export const forgetPasswordOTPSchema = resendOTPSchema;

export const verifyForgotPasswordOTPSchema = confirmEmailSchema;

export const resetPasswordSchema = z
  .object({
    body: z.object({
      email: validateFields.email,
      otp: validateFields.otp,
      newPassword: validateFields.password,
      confirmPassword: validateFields.confirmPassword,
    }),
  })
  .refine((v) => v.body.newPassword === v.body.confirmPassword, {
    error: "Confirm password doesn't match new password",
  });
