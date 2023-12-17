import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
   host: 'smtp.zoho.com',
   port: 465, // Use 587 if you want to connect using STARTTLS
   secure: true, // true for 465, false for other ports
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
   },
});

export const sendEmail = async (to, subject, html) => {
   try {
      await transporter.sendMail({
         from: 'lineupx@lineupx.net',
         to,
         subject,
         html,
      });
      console.log('Email sent successfully');
   } catch (error) {
      console.error('Error sending email:', error);
   }
};
