
// Using global fetch (Node 24+) or importing it if needed, but native fetch works fine.


export async function sendEmailJS(templateId, templateParams) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
        throw new Error("EmailJS credentials not configured");
    }

    const data = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams
    };

    console.log(`Sending email template ${templateId} to ${templateParams.email}`);

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`EmailJS Error: ${response.status} ${text}`);
        }

        console.log(`Email sent successfully`);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}

export async function sendOtp(to, otp) {
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const params = {
        email: to,
        passcode: otp,
        time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString(),
        year: new Date().getFullYear(),
        reply_to: "no-reply@appointly.com"
    };
    await sendEmailJS(templateId, params);
}

export async function sendWelcome(to, name) {
    const templateId = process.env.EMAILJS_CONFIRM_TEMPLATE_ID;
    const params = {
        email: to,
        name: name,
        date: new Date().toLocaleDateString(),
        login_link: "http://localhost:5000/auth",
        year: new Date().getFullYear(),
        reply_to: "no-reply@appointly.com"
    };
    await sendEmailJS(templateId, params);
}

