import express, { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../model";
import puppeteer from "puppeteer";
import { generateCertificate } from "../services/certificates";
import { stat } from "fs";
import { sendMail } from "../services/email";
import { Certificate } from "../model/certificates";

const certiRouter = express.Router();

interface MyJWTPayload extends JwtPayload {
  userId: string;
}

certiRouter.get("/api/finish/:id", async (req: Request, res: Response) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    // if (!token) {
    //   return res.status(401).json({ message: "Unauthorized." });
    // }
    // const decoded = jwt.verify(
    //   token,
    //   `${process.env.JWT_TOKEN}`
    // ) as MyJWTPayload;

    // const { userId } = decoded;

    const userId=req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { certificate, pdf } = await generateCertificate(user);

    const EMAIL_HTML = `
    <body style="font-family: Arial, sans-serif; text-align: center;">

    <h1>Congratulations on Completing CBRN Training!</h1>

    <p>Dear ${user.name},</p>
    <p>We are pleased to inform you that you have successfully completed the CBRN (Chemical, Biological, Radiological, and Nuclear) training. Your dedication and hard work are truly commendable.</p>

    <p>As a recognition of your achievement, please find attached your training completion certificate. Click the download button below to get your certificate:</p>

    <a href="https://cbrn.onrender.com/certificates/${certificate._id}" download>
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px;">
            Download Certificate 📜
        </button>
    </a>

    <p>Thank you for your commitment to learning and improving your skills. We wish you continued success in your endeavors.</p>

    <p>Best regards,</p>
    <p>VR Rescue X Team</p>

</body>
    `;
    const subject = "Congratulations on Completing CBRN Training!";

    sendMail(user, EMAIL_HTML, subject, (err, info) => {
      if (err) {
        console.log("error", err);
      } else {
        console.log("info", info);
      }
    });

    res.status(200).json({ user, status: "success" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

certiRouter.get("/certificates/:id", async (req, res) => {
  const { id } = req.params;
  

  
  const certificate = await Certificate.findById(id);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found." });
  }

  const pdf: Buffer = certificate.pdf;
  res.contentType("application/pdf");
  // create pdf downloadable 
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${certificate._id}.pdf`
  );
  res.send(pdf);
});

export default certiRouter;
