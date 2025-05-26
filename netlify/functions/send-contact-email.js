import { Resend } from 'resend';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Allow': 'POST' }
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('Resend API key is not set.');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error: Missing API key.' })
    };
  }

  const resend = new Resend(resendApiKey);

  try {
    const { name, email: senderEmail, message } = JSON.parse(event.body);

    if (!name || !senderEmail || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad Request: Missing name, email, or message.' })
      };
    }

    const fromEmail = 'Alex <Alex@alexanderzm.com>';
    const toEmails = ['kriz713zm@gmail.com', 'wacoachrusso@gmail.com', 'yorlemg@gmail.com'];
    const subject = `New Message for Alex from ${name}!`;

    // Adapted HTML content from alex-form-notification.html
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message for Alex!</title>
          <style>
              body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333333; }
              .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
              .header { background-color: #22c55e; padding: 30px 20px; text-align: center; }
              .header img { max-width: 150px; height: auto; }
              .content { padding: 30px 25px; line-height: 1.6; }
              .content h1 { color: #1e3a8a; font-size: 24px; margin-top: 0; }
              .content p { margin-bottom: 15px; }
              .data-label { font-weight: bold; color: #4f46e5; }
              .footer { background-color: #eef2ff; padding: 20px; text-align: center; font-size: 12px; color: #555555; }
              .footer a { color: #4f46e5; text-decoration: none; }
              .button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://alexanderzm.com/images/logo.png" alt="Alex's Website Logo" width="150" style="display:block; width:150px; max-width:150px; height:auto; border:0;">
              </div>
              <div class="content">
                  <h1>Hooray! A new message for Alex!</h1>
                  <p>Someone just sent a message through the contact form on <a href="https://alexanderzm.com" style="color: #22c55e; text-decoration: underline;">Alex's Website</a>. Here are the details:</p>
                  
                  <p><span class="data-label">From:</span> ${name}</p>
                  <p><span class="data-label">Grown-up's Email:</span> ${senderEmail}</p>
                  <p><span class="data-label">Message:</span></p>
                  <p style="background-color: #f9fafb; border-left: 3px solid #22c55e; padding: 10px; margin-left: 10px;">
                      ${message.replace(/\n/g, '<br>')}
                  </p>
      
                  <p style="text-align: center;">
                      <a href="https://alexanderzm.com" class="button">Visit Alex's Website</a>
                  </p>
              </div>
              <div class="footer">
                  <p>This email was sent automatically from <a href="https://alexanderzm.com">alexanderzm.com</a>.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmails,
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to send email.', details: error.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!', data })
    };

  } catch (parseError) {
    console.error('Error parsing request body or sending email:', parseError);
    return {
      statusCode: 400, // Bad Request if JSON parsing fails
      body: JSON.stringify({ message: 'Error processing your request.', details: parseError.message })
    };
  }
};
