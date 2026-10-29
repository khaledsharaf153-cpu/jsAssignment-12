import { Router } from "express";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import {
  confirmEmailSchema,
  forgetPasswordOTPSchema,
  loginSchema,
  resendOTPSchema,
  resetPasswordSchema,
  signupSchema,
  verifyForgotPasswordOTPSchema,
} from "./auth.validation.js";
import {
  confirmEmail,
  login,
  resendConfirmEmail,
  resetPassword,
  sendOTPForgotPassword,
  signup,
  signupOrLoginWithGoogle,
  verifyForgotPasswordOTP,
} from "./auth.service.js";
import { successResponse } from "../../commen/response/success.response.js";

export const authRouter = Router();

authRouter.post(
  "/signup",
  validationMiddleware(signupSchema),
  async (req, res) => {
    await signup(req.validatedData.body);
    successResponse({
      res,
      statusCode: 201,
      msg: "Account created successfully",
    });
  },
);

authRouter.patch(
  "/confirm-email",
  validationMiddleware(confirmEmailSchema),
  async (req, res) => {
    await confirmEmail(req.validatedData.body);
    successResponse({
      res,
      statusCode: 200,
      msg: "done",
    });
  },
);

authRouter.post(
  "/resend-otp",
  validationMiddleware(resendOTPSchema),
  async (req, res) => {
    await resendConfirmEmail(req.validatedData.body.email);
    successResponse({
      res,
      statusCode: 200,
      msg: "done",
    });
  },
);

authRouter.post(
  "/send-otp-forget-password",
  validationMiddleware(forgetPasswordOTPSchema),
  async (req, res) => {
    await sendOTPForgotPassword(req.validatedData.body.email);
    successResponse({
      res,
      statusCode: 200,
      msg: "done",
    });
  },
);

authRouter.post(
  "/verify-forgot-password-otp",
  validationMiddleware(verifyForgotPasswordOTPSchema),
  async (req, res) => {
    await verifyForgotPasswordOTP(req.validatedData.body);
    successResponse({
      res,
      statusCode: 200,
      msg: "done",
    });
  },
);

authRouter.patch(
  "/reset-password",
  validationMiddleware(resetPasswordSchema),
  async (req, res) => {
    await resetPassword(req.validatedData.body);
    successResponse({
      res,
      statusCode: 200,
      msg: "done",
    });
  },
);

authRouter.post(
  "/login",
  validationMiddleware(loginSchema),
  async (req, res) => {
    const result = await login(req.validatedData.body);
    successResponse({
      res,
      statusCode: 200,
      msg: "done",
      data: result,
    });
  },
);

authRouter.post("signup-with-google", async (req, res) => {
  const { statusCode, tokens } = await signupOrLoginWithGoogle(
    req.body.idToken,
  );
  successResponse({ res, statusCode: statusCode, data: tokens });
});
