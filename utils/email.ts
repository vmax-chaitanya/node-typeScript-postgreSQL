import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  text?: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // console.log(transporter);

  // 2) Define the email options
  const mailOptions = {
    from: "chaitanya kadali <hello@chaitanya.com>",
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
