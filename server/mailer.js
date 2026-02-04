import nodemailer from "nodemailer";

function getTransporter() {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP credentials missing. Skipping email.");
    return null;
  }
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

function getEmailTemplate(title, message, details) {
  const { name, email, phone, date, time, status } = details;
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4F46E5;">${title}</h2>
        <p>${message}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Customer Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${status}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          This is an automated notification from Appointly.
        </p>
      </div>
    `;
}

export async function sendBookingNotification(details) {
  if (!process.env.ADMIN_EMAIL) {
    console.warn("Admin Email missing. Skipping admin notification.");
    return;
  }
  const transporter = getTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking: ${details.customerName}`,
    html: getEmailTemplate(
      "New Appointment Booked",
      "A new appointment has been scheduled.",
      {
        name: details.customerName,
        email: details.customerEmail,
        phone: details.customerPhone,
        date: details.date,
        time: details.time,
        status: "Pending"
      }
    )
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent: " + info.response);
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}

export async function sendBookingConfirmation(details) {
  const transporter = getTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: details.customerEmail,
    subject: `Appointment Confirmed`,
    html: getEmailTemplate(
      "Appointment Confirmed",
      "Your appointment has been successfully confirmed.",
      {
        name: details.customerName,
        email: details.customerEmail,
        phone: details.customerPhone,
        date: details.date,
        time: details.time,
        status: "Confirmed"
      }
    )
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent: " + info.response);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

export async function sendBookingRejection(details) {
  const transporter = getTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: details.customerEmail,
    subject: `Appointment Cancelled`,
    html: getEmailTemplate(
      "Appointment Cancelled",
      "Your appointment request has been cancelled/rejected.",
      {
        name: details.customerName,
        email: details.customerEmail,
        phone: details.customerPhone,
        date: details.date,
        time: details.time,
        status: "Cancelled"
      }
    )
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking rejection email sent: " + info.response);
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }
}
