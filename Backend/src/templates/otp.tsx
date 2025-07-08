const generateOtpEmailTemplate = (otp: string, name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f7;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          color: #ff7f50;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          color: #ff7f50;
          letter-spacing: 4px;
        }
        .footer {
          font-size: 12px;
          color: #777;
          text-align: center;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="header">Your OTP Code</h2>
        <p>Hi ${name},</p>
        <p>Use the following OTP to verify your email address. This code is valid for <strong>10 minutes</strong>:</p>
        <div class="otp">${otp}</div>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} OffWeGo. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
