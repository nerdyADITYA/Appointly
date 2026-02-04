import nodemailer from "nodemailer";

export async function sendBookingNotification(details) {
    const { customerName, customerEmail, customerPhone, date, time } = details;

    // Check if credentials exist
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD || !process.env.ADMIN_EMAIL) {
        console.warn("SMTP credentials or Admin Email missing. Skipping admin notification.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `New Booking: ${customerName}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4F46E5;">New Appointment Booked</h2>
        <p>A new appointment has been scheduled.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Customer Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${customerPhone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${time}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          This is an automated notification from Appointly.
        </p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Admin notification email sent: " + info.response);
    } catch (error) {
        console.error("Failed to send admin notification:", error);
    }
}
