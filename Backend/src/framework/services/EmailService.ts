// import nodemailer from "nodemailer";
// import dotenv from 'dotenv'
// import { MessageService } from "../../domain/sevices/MessegeService";
// dotenv.config();
// export class EmailService implements MessageService {
//   private transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.NODEMAILER_EMAIL,
//       pass: process.env.NODEMAILER_PASSWORD,
//     },
//   });
//   async sendEmail(email: string, message: string): Promise<void> {
//       const htmlContent = generateOtpEmailTemplate(message, "User");
//     await this.transporter.sendMail({
//       from: `"OffWeGo" <${process.env.NODEMAILER_EMAIL}>`,
//       to: email,
//       subject: "Your OTP Code",
//       html: `
//         <div style="font-family:sans-serif;">
//           <h2>Your OTP Code</h2>
//           <p style="font-size: 20px; font-weight: bold;">${message}</p>
//           <p>This code will expire in 10 minutes.</p>
//         </div>
//       `,
//     });
//   }
// }
