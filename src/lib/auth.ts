import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USEER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const htmlTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #4f46e5; padding: 30px; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Example Team</h1>
                      </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                      <td style="padding: 40px 30px; color: #333333;">
                        <h2 style="margin-top: 0; font-size: 20px; color: #111827;">Hello!</h2>
                        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
                          Thank you for signing up with us! Please click the button below to verify your email address and activate your account.
                        </p>

                        <!-- Button -->
                        <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center" style="border-radius: 6px;" bgcolor="#4f46e5">
                              <a href="${verificationUrl}" target="_blank" style="font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; border: 1px solid #4f46e5; display: inline-block;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 0;">
                          If you did not request this, please ignore this email. This link will expire shortly.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                        &copy; 2026 Example Team. All rights reserved.
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        const info = await transporter.sendMail({
          from: '"Example Team" <team@example.com>',
          to: user.email,
          subject: "Verify Your Email Address",
          text: `Please verify your email by clicking this link: ${verificationUrl}`,
          html: htmlTemplate,
        });

        console.log("Message sent: %s", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(
          "Failed to send verification email. Please try again later."
        );
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
