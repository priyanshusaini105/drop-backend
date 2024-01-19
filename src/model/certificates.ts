import { model } from "mongoose";
import { Schema } from "mongoose";
import { Certificate as CertificateType } from "../app";

const pdfSchema = new Schema<CertificateType>({
    html: { type: String, required: true },
    pdf: { type: Buffer, required: true },
});

export const Certificate = model<CertificateType>("certificates", pdfSchema);