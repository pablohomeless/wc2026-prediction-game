import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM ?? "WC 2026 Porra <porra@localhost>";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function sendWelcomeEmail(
  to: string,
  alias: string,
  temporaryPassword: string
): Promise<void> {
  const subject = "⚽ WC 2026 Porra – Your account is ready!";
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #002868 0%, #BF0A30 100%); padding: 30px; text-align: center;">
      <h1 style="color: #FFD700; margin: 0; font-size: 28px;">⚽ WC 2026 Prediction Game</h1>
      <p style="color: #fff; margin-top: 8px; font-size: 14px;">FIFA World Cup USA/MEX/CAN 2026</p>
    </div>
    <div style="padding: 30px; background: #f9f9f9; border: 1px solid #ddd;">
      <h2 style="color: #002868;">Welcome, <strong>${alias}</strong>!</h2>
      <p style="color: #333; line-height: 1.6;">
        Your account has been created for the WC 2026 Prediction Game. 
        You can now log in and enter your predictions before the deadline.
      </p>
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #856404;">⚠️ Prediction Deadline: June 10, 2026 at 23:59 UTC</p>
      </div>
      <div style="background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Your login details:</strong></p>
        <p style="margin: 0;">Email: <code style="background:#eee;padding:2px 6px;border-radius:3px;">${to}</code></p>
        <p style="margin: 5px 0 0 0;">Temporary password: <code style="background:#eee;padding:2px 6px;border-radius:3px;">${temporaryPassword}</code></p>
      </div>
      <p style="color: #333;">Please change your password after your first login.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${APP_URL}/login" 
           style="background: #002868; color: #fff; padding: 14px 32px; 
                  text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
          Log In & Enter Predictions
        </a>
      </div>
      <p style="color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;">
        Need help? Visit <a href="${APP_URL}/rules">the rules page</a> to understand how scoring works.<br>
        If you didn't register for this game, you can ignore this email.
      </p>
    </div>
  </div>
  `;

  await transporter.sendMail({ from: FROM, to, subject, html });
}

export async function sendPasswordResetEmail(
  to: string,
  alias: string,
  newPassword: string
): Promise<void> {
  const subject = "⚽ WC 2026 Porra – Password Reset";
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #002868 0%, #BF0A30 100%); padding: 30px; text-align: center;">
      <h1 style="color: #FFD700; margin: 0;">⚽ WC 2026 Porra</h1>
    </div>
    <div style="padding: 30px; background: #f9f9f9; border: 1px solid #ddd;">
      <h2 style="color: #002868;">Password Reset – ${alias}</h2>
      <p>Your password has been reset. Your new temporary password is:</p>
      <div style="background: #eee; padding: 15px; border-radius: 6px; text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
        ${newPassword}
      </div>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${APP_URL}/login"
           style="background: #002868; color: #fff; padding: 12px 28px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Log In Now
        </a>
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({ from: FROM, to, subject, html });
}
