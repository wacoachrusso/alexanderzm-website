import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

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

    // Path to the logo file (assuming function is in netlify/functions and images is at root)
    // __dirname will be /var/task/netlify/functions/send-contact-email (or similar in Netlify's environment)
    // The build process should place the images folder relative to the function, or we need to adjust path based on build output.
    // For local structure: path.join(__dirname, '..', '..', 'images', 'logo.png');
    // In Netlify, files included in the function deployment are relative to the function's root.
    // Let's assume 'images' is copied into the function's deployment package or accessible from project root.
    // A safer bet is to ensure 'images/logo.png' is deployed with the function or use a full public URL if CID fails.
    // For now, attempting to read relative to project root during build, hoping it's available to function.
    // Netlify typically bundles the function and its dependencies. Accessing files outside the function's immediate directory can be tricky.
    // A common pattern is to place assets needed by a function *within* that function's directory or a shared 'assets' dir deployed with functions.

    // Let's try a path relative to the project root, assuming the build process makes it available.
    // The `process.cwd()` in a Netlify function is usually the root of the function's unzipped package.
    // If `images` is at the project root, and the function is `netlify/functions/your-func`, then `../../images/logo.png` from `__dirname` is a common approach.

    let logoAttachment = null;
    try {
      const logoPath = path.resolve(process.cwd(), '..', 'images', 'logo.png'); // This path might need adjustment based on Netlify's build/deployment structure.
                                                                            // A more robust way if files are at project root: process.env.LAMBDA_TASK_ROOT might be the function dir, then go up.
                                                                            // Or, ensure `images/logo.png` is copied to the function's deployment package.
                                                                            // For a simpler approach, let's assume `images` is in the root of the deployed function package if not using a complex build step.
                                                                            // The most reliable path from a function at `netlify/functions/send-contact-email.js` to `images/logo.png` at project root is:
      const resolvedLogoPath = path.join(__dirname, '..', '..', 'images', 'logo.png');

      if (fs.existsSync(resolvedLogoPath)) {
        const logoFileBuffer = fs.readFileSync(resolvedLogoPath);
        logoAttachment = {
          filename: 'logo.png',
          content: logoFileBuffer.toString('base64'),
          cid: 'alexlogo'
        };
      } else {
        console.warn(`Logo file not found at ${resolvedLogoPath}. Email will be sent without embedded logo.`);
      }
    } catch (err) {
      console.error('Error reading logo file:', err);
      // Proceed without logo if there's an error reading it
    }

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
                  <img src="cid:alexlogo" alt="Alex's Website Logo">
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
      attachments: logoAttachment ? [logoAttachment] : [],
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
