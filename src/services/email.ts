import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IUser } from '../app';

export const sendMail=(user:IUser,html:string,subject:string,callback:(err: Error | null, info: SMTPTransport.SentMessageInfo) => void)=>{
  // Create a Nodemailer transporter using your email credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:process.env.EMAIL, 
      pass: process.env.PASSWORD
    }
  });

  // Email content
  const mailOptions = {
    from:process.env.EMAIL, 
    to: user.email,
    subject: 'Welcome to VR Rescue X App!',
    html
  };

  // Send the email
  return transporter.sendMail(mailOptions,callback)
}

