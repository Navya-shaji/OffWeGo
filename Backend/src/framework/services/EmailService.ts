import { IEmailService } from "../../domain/interface/ServiceInterface/IEmailService";
import { Booking } from "../../domain/entities/BookingEntity";
import nodemailer from "nodemailer";

export class EmailService implements IEmailService {
  async sendBookingConfirmation(to: string, booking: Booking): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    console.log("Attempting to send booking email to:", to);
    console.log("Using SMTP User:", process.env.NODEMAILER_EMAIL);



    const guestCount = (Array.isArray(booking.adults) ? booking.adults.length : 0) +
      (Array.isArray(booking.children) ? booking.children.length : 0);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 680px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
          .ticket-content { padding: 40px; }
          .header-title { font-size: 28px; font-weight: bold; color: #000; margin: 0; font-family: 'Times New Roman', serif; }
          .header-sub { color: #666; font-size: 14px; margin-top: 5px; font-weight: 600; }
          .offwego-badge { background: #000; color: #fff; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-style: italic; font-size: 14px; display: inline-block; }
          
          .grid { display: table; width: 100%; margin-top: 30px; border-collapse: collapse; }
          .col-left { display: table-cell; width: 65%; vertical-align: top; padding-right: 20px; }
          .col-right { display: table-cell; width: 35%; vertical-align: top; }
          
          .pkg-name { font-size: 20px; font-weight: 800; color: #000; margin: 0; }
          .pkg-dest { color: #888; font-size: 12px; margin-top: 4px; font-weight: 500; }
          
          .info-group { margin-top: 20px; }
          .info-label { font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; }
          .info-val { font-size: 14px; font-weight: 800; color: #000; margin-top: 2px; }
          
          .date-box { border: 2px dashed #eee; border-radius: 16px; padding: 20px; text-align: center; background: #fafafa; }
          .date-day { font-size: 48px; font-weight: 900; color: #000; line-height: 1; }
          .date-month { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #000; margin-top: 5px; }
          .ref-label { font-size: 9px; font-weight: 800; color: #bbb; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; }
          .ref-val { font-size: 16px; font-weight: 900; color: #10b981; }
          
          .footer-section { background-color: #10b981; padding: 30px; color: #ffffff; position: relative; }
          .footer-tag { background: #000; color: #fff; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
          .footer-title { margin: 10px 0 5px; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; }
          .footer-text { font-size: 11px; opacity: 0.9; margin: 0; }
          .booking-id-box { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: right; float: right; margin-top: -50px; }
          .booking-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #d1fae5; }
          .booking-val { font-size: 20px; font-weight: 900; letter-spacing: 1px; font-family: monospace; margin: 0; }
          
          a.btn { display: block; width: 200px; margin: 30px auto; text-align: center; background: #000; color: #fff; padding: 15px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="ticket-content">
            <table width="100%">
              <tr>
                <td align="left">
                   <div class="header-title">Booking Confirmation</div>
                   <div class="header-sub">Your adventure is officially confirmed!</div>
                </td>
                <td align="right">
                   <div style="background: #000; padding: 10px 15px; border-radius: 12px;">
                      <img src="https://offwego-travels.vercel.app/images/logo.png" alt="OffWeGo" style="height: 30px; width: auto;" />
                   </div>
                </td>
              </tr>
            </table>
            
            <!-- Main Grid -->
            <div class="grid">
              <div class="col-left">
                <div class="pkg-name">${booking.selectedPackage.packageName}</div>
                <div class="pkg-dest">Travel Document</div>
                
                <div class="info-group">
                  <div class="info-label">Travel Party</div>
                  <div class="info-val">${guestCount} People</div>
                </div>
                
                <div class="info-group">
                   <div class="info-label">Total Paid</div>
                   <div class="info-val">₹${booking.totalAmount.toLocaleString()}</div>
                </div>
                
                <div class="info-group">
                   <div class="info-label">Email</div>
                   <div class="info-val text-truncate">${to}</div>
                </div>
              </div>
              
              <div class="col-right">
                <div class="date-box">
                  <div class="date-day">${new Date(booking.selectedDate).getDate()}</div>
                  <div class="date-month">${new Date(booking.selectedDate).toLocaleString('default', { month: 'long' })}</div>
                  <div style="height: 1px; background: #eee; margin: 15px 0;"></div>
                  <div class="ref-val">${booking._id?.toString().slice(-6).toUpperCase() || booking.bookingId?.slice(-6).toUpperCase() || 'REF'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- footer -->
          <div class="footer-section">
             <div class="footer-tag">Payment Verified</div>
             <div style="margin: 10px 0;">
                <img src="https://offwego-travels.vercel.app/images/logo.png" alt="OffWeGo" style="height: 25px; width: auto; filter: brightness(0) invert(1);" />
             </div>
             <p class="footer-text">Please save this digital receipt for your smooth check-in.</p>
             
             <div class="booking-id-box">
                <div class="booking-label">Booking ID</div>
                <div class="booking-val">${booking._id?.toString().slice(-6).toUpperCase() || booking.bookingId?.slice(-6).toUpperCase() || 'N/A'}</div>
             </div>
          </div>
          
          <div style="text-align: center; padding: 20px;">
             <a href="http://localhost:5173/bookings" class="btn">View My Bookings</a>
             <p style="color: #999; font-size: 11px;">&copy; ${new Date().getFullYear()} OffWeGo. Sent with ❤️</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"OffWeGo Transactions" <${process.env.NODEMAILER_EMAIL}>`,
      to: to,
      subject: `✈️ Ticket Confirmed: ${booking.selectedPackage.packageName}`,
      html,
    };

    try {
      console.log("Sending mail with options...");
      const info = await transporter.sendMail(mailOptions);
      console.log(`Booking confirmation email sent successfully to ${to}. MessageId: ${info.messageId}`);
    } catch (error: unknown) {
      console.error(" Error sending booking email:", error);
      const mailError = error as { code?: string };
      if (mailError.code === 'EAUTH') {
        console.error("Authentication failed. Please check your NODEMAILER_EMAIL and NODEMAILER_PASSWORD.");
      } else if (mailError.code === 'ESOCKET') {
        console.error("Network or port issue. Ensure port 465 is open or try port 587.");
      }
      throw error;
    }
  }
}
