import { emailSubjectEnum } from "../../enum/email.enum.js";

export const emailTemplate = {
  [emailSubjectEnum.CONFIRM_EMAIL]: (otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; text-align: center; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; margin-bottom: 20px;">Verify Your Email Address</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Thank you for registering! Please use the following Verification Code (OTP) to confirm your email address:
      </p>
      <div style="font-size: 36px; font-weight: bold; color: #4CAF50; margin: 30px 0; padding: 15px; background-color: #f4f8f4; border-radius: 8px; letter-spacing: 5px;">
        ${otp}
      </div>
      <p style="color: #888888; font-size: 14px; margin-top: 30px;">
        If you did not create an account, no further action is required. Please ignore this email.
      </p>
    </div>
  `;
  },
  [emailSubjectEnum.FORGOT_PASSWORD]: (otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; text-align: center; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; margin-bottom: 20px;">Reset Your Password</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        We received a request to reset your password. Please use the following Verification Code (OTP) to proceed:
      </p>
      <div style="font-size: 36px; font-weight: bold; color: #d32f2f; margin: 30px 0; padding: 15px; background-color: #fff5f5; border-radius: 8px; letter-spacing: 5px;">
        ${otp}
      </div>
      <p style="color: #888888; font-size: 14px; margin-top: 30px;">
        This code is valid for a short time. If you did not request a password reset, please ignore this email and your password will remain unchanged.
      </p>
    </div>
  `;
  },
};
